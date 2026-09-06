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
  function chooseQuorum(group) {
    // Randomize illustrative response order, not which replicas receive the write.
    const order = [1, 2, 3, 4, 5];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const previous = group.dataset.acknowledgements;
    if (order.slice(0, 3).sort().join(",") === previous) {
      // Keep consecutive replays visibly different, even if the shuffle repeats.
      [order[2], order[3]] = [order[3], order[2]];
    }
    const responders = order.slice(0, 3);
    group.dataset.acknowledgements = [...responders].sort().join(",");
    group.querySelectorAll(".network-confirmation").forEach((ring) => {
      ring.toggleAttribute(
        "hidden",
        !responders.includes(Number(ring.dataset.node)),
      );
    });
    group.querySelectorAll(".replication-route").forEach((path) => {
      const confirmed =
        path.dataset.path === "0" ||
        responders.includes(Number(path.dataset.replica));
      path.classList.toggle("route-confirmed", confirmed);
      path.classList.toggle("route-pending", !confirmed);
    });
    const labels = responders
      .map((id) => String(id).padStart(2, "0"))
      .join(", ");
    group.dataset.description = `Example leaderless write with N = 5 and W = 3: node 02 coordinates writes to all five replicas. Nodes ${labels} acknowledge first, satisfying the write quorum. There is no elected leader.`;
    return responders;
  }
  function playWrite(group, responders = null) {
    if (reducedMotion.matches) return;
    const phases = {
      request: { delay: 0, duration: 380, reverse: false },
      replicate: { delay: 400, duration: 600, reverse: false },
      ack: { delay: 1020, duration: 500, reverse: true },
      reply: { delay: 1570, duration: 380, reverse: true },
    };
    group.querySelectorAll(".network-packet").forEach((packet) => {
      const path = group.querySelector(`[data-path="${packet.dataset.route}"]`);
      let { delay, duration, reverse } = phases[packet.dataset.phase];
      if (responders && packet.dataset.phase === "ack") {
        const rank = responders.indexOf(Number(path.dataset.replica));
        if (rank === -1) return;
        delay = 1020 + rank * 160;
        duration = 330;
      }
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
    if (responders) {
      responders.forEach((node, rank) => {
        const ring = group.querySelector(
          `.network-confirmation[data-node="${node}"]`,
        );
        animations.push(
          ring.animate([{ opacity: 0 }, { opacity: 1 }], {
            delay: 1350 + rank * 160,
            duration: 100,
            fill: "backwards",
          }),
        );
      });
    }
    animations.push(
      group
        .querySelector("[data-complete]")
        .animate(
          [{ strokeWidth: 1.2 }, { strokeWidth: 4 }, { strokeWidth: 1.2 }],
          { delay: responders ? 1670 : 1500, duration: 450 },
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
        const responders =
          button.dataset.mode === "quorum" ? chooseQuorum(group) : null;
        network
          .querySelector("svg")
          .setAttribute("aria-label", group.dataset.description);
        playWrite(group, responders);
      }
    });
    network.querySelector(".diagram-caption").textContent =
      button.dataset.caption;
  });
  reducedMotion.addEventListener("change", stopAnimation);
});
