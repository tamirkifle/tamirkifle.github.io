/* ============================================
   tamir.info - Single Post Page
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const headerEl = document.getElementById('post-header');
  const contentEl = document.getElementById('post-content');
  if (!headerEl || !contentEl) return;

  const slug = new URLSearchParams(window.location.search).get('slug');

  if (!slug) {
    showError(headerEl, contentEl);
    return;
  }

  try {
    // 1. Fetch post metadata
    const indexRes = await fetch('posts/index.json');
    if (!indexRes.ok) throw new Error(`Failed to load posts index: ${indexRes.status}`);
    const data = await indexRes.json();

    const post = (data.posts || []).find((p) => p.slug === slug);
    if (!post) {
      showError(headerEl, contentEl);
      return;
    }

    // 2. Update document title
    document.title = `${post.title} - Tamir Yirga`;

    // 3. Render post header
    headerEl.innerHTML = `
      <h1>${escapeHtml(post.title)}</h1>
      <div class="post-meta">${formatDate(post.date)} · ${post.readTime} min read</div>
      <p class="post-summary">${escapeHtml(post.summary)}</p>
    `;

    // 4. Fetch markdown content
    const mdRes = await fetch(`posts/${encodeURIComponent(slug)}.md`);
    if (!mdRes.ok) throw new Error(`Failed to load post content: ${mdRes.status}`);
    const mdContent = await mdRes.text();

    // 5. Configure marked with highlight.js
    marked.setOptions({
      highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      },
    });

    // 6. Render markdown
    contentEl.innerHTML = marked.parse(mdContent);
  } catch (err) {
    console.error('Error loading post:', err);
    showError(headerEl, contentEl);
  }
});

/** Display a friendly "not found" message */
function showError(headerEl, contentEl) {
  document.title = 'Post Not Found - Tamir Yirga';
  headerEl.innerHTML = '<h1>Post not found</h1>';
  contentEl.innerHTML =
    '<p style="color:var(--foreground-faded)">The post you\'re looking for doesn\'t exist or has been removed. <a href="writing.html" class="link">Browse all writing →</a></p>';
}

/** Minimal HTML escaping for safe rendering */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
