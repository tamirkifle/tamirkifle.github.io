// Runs before paint. A blocked storage API must never stop the page rendering.
(() => {
  let theme;
  try {
    theme = localStorage.getItem("tamir-theme");
  } catch {}
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  document.documentElement.dataset.theme = theme;
})();
