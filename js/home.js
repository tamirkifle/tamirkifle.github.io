/* ============================================
   tamir.info - Home Page JS
   Fetches featured posts and renders them.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedPosts();
});

async function loadFeaturedPosts() {
  const container = document.getElementById('featured-writing');
  if (!container) return;

  try {
    const response = await fetch('posts/index.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const posts = (data.posts || []).filter(
      (post) => post.featured && post.public
    );

    if (posts.length === 0) {
      container.innerHTML =
        '<p style="color:var(--foreground-faded);font-size:0.8125rem;">No featured posts yet.</p>';
      return;
    }

    container.innerHTML = posts
      .map(
        (post) => `
        <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="featured-writing-card">
          <div class="card-title">${escapeHtml(post.title)}</div>
          <div class="card-summary">${escapeHtml(post.summary)}</div>
          <div class="card-meta">${formatDate(post.date)} · ${post.readTime} min read</div>
        </a>`
      )
      .join('');
  } catch (err) {
    console.error('Failed to load featured posts:', err);
    container.innerHTML =
      '<p style="color:var(--foreground-faded);font-size:0.8125rem;">Could not load posts.</p>';
  }
}

/** Simple HTML escape to prevent XSS in rendered post data. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
