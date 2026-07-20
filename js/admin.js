/* ============================================
   tamir.info - Admin Panel
   Self-contained blog management tool.
   All data persisted in localStorage.
   ============================================ */

const STORAGE_KEY = 'tamir_posts';

let posts = [];
let currentEditSlug = null;

// --- DOM references ---
const postListEl = document.getElementById('admin-post-list');
const postsTab = document.getElementById('posts-tab');
const editorTab = document.getElementById('editor-tab');
const tabButtons = document.querySelectorAll('.admin-tab');
const toastEl = document.getElementById('toast');

// Form fields
const titleInput = document.getElementById('post-title');
const slugInput = document.getElementById('post-slug');
const dateInput = document.getElementById('post-date');
const readTimeInput = document.getElementById('post-read-time');
const summaryInput = document.getElementById('post-summary');
const publicCheckbox = document.getElementById('post-public');
const featuredCheckbox = document.getElementById('post-featured');
const tagsInput = document.getElementById('post-tags');
const bodyTextarea = document.getElementById('post-body');
const previewEl = document.getElementById('post-preview');

// =============================================
// State Management
// =============================================

async function loadPosts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      posts = JSON.parse(stored);
      return;
    } catch (e) {
      console.warn('Failed to parse stored posts, fetching from index.json');
    }
  }

  // First load - seed from posts/index.json
  try {
    const res = await fetch('posts/index.json');
    if (res.ok) {
      const data = await res.json();
      posts = data.posts || [];
      savePosts();
    }
  } catch (e) {
    console.warn('Could not fetch posts/index.json:', e);
    posts = [];
  }
}

function savePosts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// =============================================
// Rendering
// =============================================

function renderPostList() {
  if (posts.length === 0) {
    postListEl.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:var(--foreground-faded);">
        <p style="font-size:1.5rem; margin-bottom:0.5rem;">📝</p>
        <p>No posts yet. Click <strong>New Post</strong> to create one.</p>
      </div>`;
    return;
  }

  // Sort by date descending
  const sorted = [...posts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  postListEl.innerHTML = sorted.map(post => `
    <div class="admin-post-row" data-slug="${escapeAttr(post.slug)}">
      <div class="admin-post-info">
        <div class="admin-post-title">${escapeHtml(post.title)}</div>
        <div class="admin-post-meta">${post.date || '-'} · ${post.readTime || '?'} min · ${escapeHtml(post.slug)}</div>
      </div>
      ${post.featured ? '<span class="badge badge-featured">Featured</span>' : '<span></span>'}
      ${post.public ? '<span class="badge badge-public">Public</span>' : '<span class="badge badge-private">Private</span>'}
      <div class="btn-group">
        <button class="btn btn-edit" data-action="edit" data-slug="${escapeAttr(post.slug)}">Edit</button>
        <button class="btn btn-danger btn-delete" data-action="delete" data-slug="${escapeAttr(post.slug)}">Delete</button>
      </div>
    </div>
  `).join('');
}

// =============================================
// Tab Switching
// =============================================

function switchTab(tabName) {
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  if (tabName === 'posts') {
    postsTab.hidden = false;
    editorTab.hidden = true;
  } else {
    postsTab.hidden = true;
    editorTab.hidden = false;
  }
}

// =============================================
// Post CRUD
// =============================================

function newPost() {
  currentEditSlug = null;
  clearForm();

  // Default to today's date
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  publicCheckbox.checked = true;

  switchTab('editor');
  titleInput.focus();
}

async function editPost(slug) {
  const post = posts.find(p => p.slug === slug);
  if (!post) return;

  currentEditSlug = slug;
  titleInput.value = post.title || '';
  slugInput.value = post.slug || '';
  dateInput.value = post.date || '';
  readTimeInput.value = post.readTime || '';
  summaryInput.value = post.summary || '';
  publicCheckbox.checked = !!post.public;
  featuredCheckbox.checked = !!post.featured;
  tagsInput.value = (post.tags || []).join(', ');

  // Load body: try stored body first, then fetch .md file
  if (post.body) {
    bodyTextarea.value = post.body;
  } else {
    try {
      const res = await fetch(`posts/${slug}.md`);
      if (res.ok) {
        bodyTextarea.value = await res.text();
      } else {
        bodyTextarea.value = '';
      }
    } catch {
      bodyTextarea.value = '';
    }
  }

  switchTab('editor');
  updatePreview();
  titleInput.focus();
}

function deletePost(slug) {
  const post = posts.find(p => p.slug === slug);
  if (!post) return;

  const confirmed = confirm(`Delete "${post.title}"?\n\nThis will remove the post from localStorage. You'll need to manually delete the .md file.`);
  if (!confirmed) return;

  posts = posts.filter(p => p.slug !== slug);
  savePosts();
  renderPostList();
  showToast('Post deleted');
}

function savePost() {
  const title = titleInput.value.trim();
  const slug = slugInput.value.trim();
  const date = dateInput.value;

  // Validate
  if (!title) { showToast('Title is required'); titleInput.focus(); return; }
  if (!slug) { showToast('Slug is required'); slugInput.focus(); return; }
  if (!date) { showToast('Date is required'); dateInput.focus(); return; }

  const postData = {
    slug,
    title,
    summary: summaryInput.value.trim(),
    date,
    readTime: parseInt(readTimeInput.value) || 5,
    featured: featuredCheckbox.checked,
    public: publicCheckbox.checked,
    tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean),
    body: bodyTextarea.value
  };

  if (currentEditSlug) {
    // Update existing
    const idx = posts.findIndex(p => p.slug === currentEditSlug);
    if (idx !== -1) {
      posts[idx] = postData;
    } else {
      posts.push(postData);
    }
  } else {
    // Check for duplicate slug
    if (posts.some(p => p.slug === slug)) {
      showToast('A post with this slug already exists');
      slugInput.focus();
      return;
    }
    posts.push(postData);
  }

  savePosts();
  renderPostList();
  switchTab('posts');
  showToast(currentEditSlug ? 'Post updated' : 'Post created');
  currentEditSlug = null;
}

function clearForm() {
  titleInput.value = '';
  slugInput.value = '';
  dateInput.value = '';
  readTimeInput.value = '';
  summaryInput.value = '';
  publicCheckbox.checked = false;
  featuredCheckbox.checked = false;
  tagsInput.value = '';
  bodyTextarea.value = '';
  previewEl.innerHTML = '';
}

// =============================================
// Export / Download
// =============================================

function downloadMarkdown() {
  const title = titleInput.value.trim() || 'untitled';
  const slug = slugInput.value.trim() || slugify(title);
  const content = bodyTextarea.value;

  if (!content) {
    showToast('Nothing to download - write some content first');
    return;
  }

  const blob = new Blob([content], { type: 'text/markdown' });
  triggerDownload(blob, `${slug}.md`);
  showToast(`Downloaded ${slug}.md`);
}

async function exportAll() {
  if (typeof JSZip === 'undefined') {
    showToast('JSZip library failed to load');
    return;
  }

  const zip = new JSZip();

  // 1. Add index.json
  const exportData = {
    posts: posts.map(({ body, ...meta }) => meta)
  };
  zip.file('index.json', JSON.stringify(exportData, null, 2));

  // 2. Add .md files
  posts.forEach(post => {
    if (post.slug && post.body != null) {
      zip.file(`${post.slug}.md`, post.body);
    }
  });

  // 3. Generate and download
  try {
    const content = await zip.generateAsync({ type: 'blob' });
    triggerDownload(content, 'posts.zip');
    showToast('Exported posts.zip');
  } catch (err) {
    console.error('Failed to generate zip:', err);
    showToast('Failed to generate zip file');
  }
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// =============================================
// Utilities
// =============================================

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function insertMedia(type) {
  const label = type === 'image' ? 'image' : 'video';
  const path = prompt(`Enter the file path for the ${label}:`);
  if (!path) return;

  const textarea = bodyTextarea;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  let insertion;
  if (type === 'image') {
    const alt = prompt('Alt text for the image:', '') || label;
    insertion = `![${alt}](${path})`;
  } else {
    insertion = `<video src="${path}" controls></video>`;
  }

  textarea.value = text.slice(0, start) + insertion + text.slice(end);
  textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
  textarea.focus();
  updatePreview();
}

function updatePreview() {
  const raw = bodyTextarea.value;
  
  // Auto-calculate read time (~200 words per minute)
  if (raw.trim()) {
    const wordCount = raw.trim().split(/\s+/).length;
    readTimeInput.value = Math.max(1, Math.ceil(wordCount / 200));
  } else {
    readTimeInput.value = '';
  }

  if (!raw.trim()) {
    previewEl.innerHTML = '<p style="color:var(--foreground-faded); font-style:italic;">Preview will appear here…</p>';
    return;
  }

  previewEl.innerHTML = marked.parse(raw);

  // Apply highlight.js to code blocks
  previewEl.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2500);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// =============================================
// Event Listeners
// =============================================

function setupEventListeners() {
  // Tab buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Header buttons
  document.getElementById('btn-new-post').addEventListener('click', newPost);
  document.getElementById('btn-export-all').addEventListener('click', exportAll);
  document.getElementById('btn-reset-data').addEventListener('click', async () => {
    if (confirm('Are you sure you want to discard all local edits and reload from the website files? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      await loadPosts();
      renderPostList();
      showToast('Local data reset from website files.');
    }
  });

  // Title → auto-slug
  titleInput.addEventListener('input', () => {
    if (!currentEditSlug) {
      slugInput.value = slugify(titleInput.value);
    }
  });

  // Editor textarea → debounced preview
  let previewTimer;
  bodyTextarea.addEventListener('input', () => {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(updatePreview, 300);
  });

  // Form action buttons
  document.getElementById('btn-save-post').addEventListener('click', savePost);
  document.getElementById('btn-download-md').addEventListener('click', downloadMarkdown);
  document.getElementById('btn-cancel').addEventListener('click', () => {
    switchTab('posts');
  });

  // Media insert buttons
  document.getElementById('btn-insert-image').addEventListener('click', () => insertMedia('image'));
  document.getElementById('btn-insert-video').addEventListener('click', () => insertMedia('video'));

  // Event delegation for post list (Edit / Delete)
  postListEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const slug = btn.dataset.slug;

    if (action === 'edit') editPost(slug);
    if (action === 'delete') deletePost(slug);
  });
}

// =============================================
// Initialization
// =============================================

document.addEventListener('DOMContentLoaded', async () => {
  // Configure marked.js with highlight.js
  marked.setOptions({
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
    breaks: false,
    gfm: true
  });

  await loadPosts();
  renderPostList();
  setupEventListeners();
});
