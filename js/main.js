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

document.querySelectorAll(".replication-diagram").forEach((network) => {
  const controls = network.querySelector(".diagram-controls");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animations = [];
  function stopAnimation() {
    animations.forEach((animation) => animation.cancel());
    animations = [];
  }
  function playWrite(group) {
    if (reducedMotion.matches) return;
    const phases = {
      request: { delay: 0, duration: 380, reverse: false },
      replicate: { delay: 400, duration: 600, reverse: false },
      ack: { delay: 1020, duration: 500, reverse: true },
      reply: { delay: 1570, duration: 380, reverse: true },
    };
    group.querySelectorAll(".network-packet").forEach((packet) => {
      const path = group.querySelector(`[data-path="${packet.dataset.route}"]`);
      const { delay, duration, reverse } = phases[packet.dataset.phase];
      const length = path.getTotalLength();
      const frames = Array.from({ length: 33 }, (_, index) => {
        const fraction = index / 32;
        const point = path.getPointAtLength(
          length * (reverse ? 1 - fraction : fraction),
        );
        return {
          transform: `translate(${point.x}px, ${point.y}px)`,
          opacity: index === 0 || index === 32 ? 0 : 1,
        };
      });
      animations.push(packet.animate(frames, { delay, duration }));
    });
    animations.push(
      group
        .querySelector("[data-complete]")
        .animate(
          [{ strokeWidth: 1.2 }, { strokeWidth: 4 }, { strokeWidth: 1.2 }],
          { delay: 1500, duration: 450 },
        ),
    );
  }
  controls.hidden = false;
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-mode]");
    if (!button) return;
    stopAnimation();
    controls
      .querySelectorAll("button")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    network.querySelectorAll("[data-network-mode]").forEach((group) => {
      const active = group.dataset.networkMode === button.dataset.mode;
      group.toggleAttribute("hidden", !active);
      if (active) {
        network
          .querySelector("svg")
          .setAttribute("aria-label", group.dataset.description);
        playWrite(group);
      }
    });
    network.querySelector(".diagram-caption").textContent =
      button.dataset.caption;
  });
  reducedMotion.addEventListener("change", stopAnimation);
});
