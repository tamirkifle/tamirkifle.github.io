/* ============================================
   tamir.info - Writing List Page
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const listEl = document.getElementById('writing-list');
  if (!listEl) return;

  try {
    const res = await fetch('posts/index.json');
    if (!res.ok) throw new Error(`Failed to load posts index: ${res.status}`);
    const data = await res.json();

    // Filter public posts and sort newest first
    const posts = (data.posts || [])
      .filter((p) => p.public)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (posts.length === 0) {
      listEl.innerHTML = '<p style="color:var(--foreground-faded)">No posts yet - check back soon.</p>';
      return;
    }

    listEl.innerHTML = posts
      .map(
        (post) => `
      <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="writing-item">
        <div class="writing-title">${escapeHtml(post.title)}</div>
        <div class="writing-summary">${escapeHtml(post.summary)}</div>
        <div class="writing-meta">${formatDate(post.date)} · ${post.readTime} min read</div>
        <div class="writing-tags">
          ${(post.tags || []).map((t) => `<span class="writing-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </a>`
      )
      .join('');
  } catch (err) {
    console.error('Error loading posts:', err);
    listEl.innerHTML = '<p style="color:var(--foreground-faded)">Unable to load posts.</p>';
  }
});

/** Minimal HTML escaping for safe rendering */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
