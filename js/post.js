// Preserve old article URLs, but never expose an unpublished draft as an article.
(() => {
  const slug = new URLSearchParams(location.search).get("slug");
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return;
  const manifest = document.getElementById("published-writing");
  if (!manifest) return;
  try {
    if (JSON.parse(manifest.textContent).includes(slug))
      location.replace(`/writing/${encodeURIComponent(slug)}.html`);
  } catch {
    /* The static fallback remains useful if the manifest is unreadable. */
  }
})();
