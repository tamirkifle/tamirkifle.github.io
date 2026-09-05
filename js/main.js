const toggle = document.querySelector(".theme-toggle");
const preference = window.matchMedia("(prefers-color-scheme: dark)");
let hasExplicitTheme = false;
try {
  hasExplicitTheme = ["light", "dark"].includes(
    localStorage.getItem("tamir-theme"),
  );
} catch {}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (toggle)
    toggle.setAttribute(
      "aria-label",
      `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
    );
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#1c201e" : "#f5f3ed");
}
applyTheme(document.documentElement.dataset.theme || "light");
if (toggle) {
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    hasExplicitTheme = true;
    applyTheme(theme);
    try {
      localStorage.setItem("tamir-theme", theme);
    } catch {}
  });
}
preference.addEventListener("change", (event) => {
  if (!hasExplicitTheme) applyTheme(event.matches ? "dark" : "light");
});

const diagram = document.querySelector(".hero-diagram");
if (diagram) {
  const captions = {
    load: "Read model weights from a memory-mapped GGUF file.",
    compute: "Run tensor operations, attention, and quantized matrix kernels.",
    sample: "Use the output distribution to choose the next token.",
  };
  const controls = diagram.querySelector(".diagram-controls");
  controls.hidden = false;
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-step]");
    if (!button) return;
    const step = button.dataset.step;
    controls
      .querySelectorAll("button")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    diagram
      .querySelectorAll("[data-layer]")
      .forEach((layer) =>
        layer.classList.toggle("is-active", layer.dataset.layer === step),
      );
    diagram.querySelector(".diagram-caption").textContent = captions[step];
  });
}
