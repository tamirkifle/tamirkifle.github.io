// Preserve old article URLs, but never expose an unpublished draft as an article.
(async () => {
  const slug = new URLSearchParams(location.search).get("slug");
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return;
  try {
    const response = await fetch("/posts/index.json");
    if (!response.ok) return;
    const data = await response.json();
    if (data.posts.some((post) => post.public && post.slug === slug)) {
      location.replace(`/writing/${encodeURIComponent(slug)}.html`);
    }
  } catch {
    /* The static fallback remains useful offline or on a fetch failure. */
  }
})();
