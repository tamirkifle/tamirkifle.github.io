// Original vector illustrations. These explain components; they are not benchmark plots.
export function stackArt() {
  const slabs = [
    {
      y: 100,
      id: "load",
      label: "GGUF",
      name: "MODEL FILE",
      detail: "GGUF / memory map",
    },
    {
      y: 195,
      id: "compute",
      label: "GEMM",
      name: "COMPUTE",
      detail: "tensors / attention",
    },
    {
      y: 290,
      id: "sample",
      label: "TOKEN",
      name: "OUTPUT",
      detail: "sampling / tokens",
    },
  ];
  return `<svg class="stack-art" viewBox="0 0 560 480" role="img" aria-labelledby="stack-title stack-desc">
    <title id="stack-title">Inside InferRS</title><desc id="stack-desc">Three layers of an inference engine: load the model file, compute tensors and attention, then sample the next token. A conceptual illustration of components in development.</desc>
    <g class="art-guides" fill="none"><path d="M72 350 292 462 492 350M72 350V92M292 462V207M492 350V92" stroke-dasharray="3 6"/><path d="M70 92 292 204 494 92M70 190 292 302 494 190" stroke-dasharray="2 7"/></g>
    ${slabs
      .map(
        (
          s,
        ) => `<g class="stack-layer ${s.id === "load" ? "is-active" : ""}" data-layer="${s.id}">
      <path class="slab-side" d="M108 ${s.y + 42} 290 ${s.y + 134} 290 ${s.y + 150} 108 ${s.y + 58}Z"/>
      <path class="slab-front" d="M290 ${s.y + 134} 455 ${s.y + 51} 455 ${s.y + 67} 290 ${s.y + 150}Z"/>
      <path class="slab-top" d="M108 ${s.y + 42} 273 ${s.y - 41} 455 ${s.y + 51} 290 ${s.y + 134}Z"/>
      <g class="slab-grid">${Array.from({ length: 7 }, (_, i) => `<path d="M${128 + i * 22} ${s.y + 32 - i * 11}l181 92"/><path d="M${131 + i * 24} ${s.y + 54 + i * 12}l165 -83"/>`).join("")}</g>
      <path class="slab-chip" d="M229 ${s.y + 44} 275 ${s.y + 21} 329 ${s.y + 48} 283 ${s.y + 71}Z"/>
      ${s.id === "load" ? `<g class="chip-detail"><path d="m252 ${s.y + 43} 27 14 29-15m-48-5 19 10 21-11"/></g>` : s.id === "compute" ? `<g class="chip-detail"><path d="m254 ${s.y + 41} 34 17m-19-25 34 17m-51 2 35-18m-22 25 35-18"/></g>` : `<g class="chip-detail"><path d="m263 ${s.y + 47} 5 3m3-14 14 7m-1-17 23 12"/></g>`}
      <path class="art-callout" d="M108 ${s.y + 42}H49"/><text class="art-number" x="24" y="${s.y + 30}">${s.label}</text>
    </g>`,
      )
      .reverse()
      .join("")}
    <path class="signal-line" d="M278 65V331" stroke-dasharray="2 7"/>
    <circle class="signal-dot" cx="278" cy="65" r="5"/>
    <path class="art-guides" d="M472 406h36m-18-18v36M76 62h16m-8-8v16"/>
  </svg>`;
}

export function projectArt(type) {
  if (type === "memory")
    return `<svg viewBox="0 0 560 350" role="img" aria-label="Weight storage comparison: f32, 24 gigabytes; INT8, 6.03 gigabytes. A schematic, not a benchmark plot.">
    <text class="diagram-label" x="36" y="38">WEIGHT STORAGE</text><text class="diagram-label" x="524" y="38" text-anchor="end">LLAMA–7B</text>
    ${Array.from({ length: 4 }, (_, row) => Array.from({ length: 8 }, (_, col) => `<rect class="memory-cell" x="${36 + col * 28}" y="${77 + row * 28}" width="22" height="22"/>`).join("")).join("")}
    ${Array.from({ length: 4 }, (_, row) => Array.from({ length: 2 }, (_, col) => `<rect class="memory-cell compact" x="${378 + col * 28}" y="${77 + row * 28}" width="22" height="22"/>`).join("")).join("")}
    <path class="diagram-arrow" d="M293 128h42m-8-8 8 8-8 8"/>
    <text class="diagram-value" x="36" y="246">24 <tspan class="diagram-unit">GB</tspan></text><text class="diagram-value" x="370" y="246">6.03 <tspan class="diagram-unit">GB</tspan></text>
    <text class="diagram-label" x="36" y="275">f32 WEIGHTS</text><text class="diagram-label" x="378" y="275">INT8 WEIGHTS</text>
    <path class="diagram-rule" d="M36 300H524"/><text class="diagram-foot" x="36" y="324">Same model. A smaller representation.</text>
  </svg>`;
  if (type === "consensus")
    return `<svg viewBox="0 0 560 350" role="img" aria-label="A conceptual five-node Raft cluster with a leader connected to four followers.">
    <text class="diagram-label" x="36" y="38">REPLICATION</text><text class="diagram-label" x="524" y="38" text-anchor="end">FIVE NODES</text>
    <g class="network-lines"><path d="M280 175 132 107M280 175 428 107M280 175 132 239M280 175 428 239"/></g>
    ${[
      [132, 107],
      [428, 107],
      [132, 239],
      [428, 239],
    ]
      .map(
        ([x, y], i) =>
          `<circle class="network-orbit" cx="${x}" cy="${y}" r="29"/><circle class="network-node" cx="${x}" cy="${y}" r="5"/><text class="diagram-label" x="${x + (x < 280 ? -45 : 45)}" y="${y + 4}" text-anchor="${x < 280 ? "end" : "start"}">0${i + 2}</text>`,
      )
      .join("")}
    <circle class="network-leader" cx="280" cy="175" r="42"/><text class="leader-text" x="280" y="180" text-anchor="middle">01</text>
    <text class="diagram-label" x="280" y="245" text-anchor="middle">LEADER</text>
    <path class="diagram-rule" d="M36 300H524"/><text class="diagram-foot" x="36" y="324">The Raft path · conceptual topology</text>
  </svg>`;
  return `<svg viewBox="0 0 560 350" role="img" aria-label="Event flow from replicas, through admission control and a queue, to batched writes in DynamoDB.">
    <text class="diagram-label" x="36" y="38">EVENT FLOW</text><text class="diagram-label" x="524" y="38" text-anchor="end">SHARED LIMIT</text>
    <g class="pipeline-lines"><path d="M78 102H148V174H198M78 174H198M78 246H148V174M250 174H350M410 174H475"/></g>
    ${[102, 174, 246].map((y) => `<rect class="pipeline-source" x="44" y="${y - 17}" width="34" height="34"/><path class="pipeline-tick" d="M56 ${y}h10"/>`).join("")}
    <rect class="pipeline-gate" x="198" y="135" width="52" height="78" rx="26"/><path class="gate-mark" d="M218 162h13l-13 24h13"/>
    ${Array.from({ length: 5 }, (_, i) => `<rect class="pipeline-event" x="${287 + i * 17}" y="154" width="10" height="40"/>`).join("")}
    <rect class="pipeline-db" x="461" y="143" width="52" height="62" rx="3"/><path class="pipeline-tick" d="M471 158h32m-32 14h32m-32 14h32"/>
    <text class="diagram-label" x="61" y="283" text-anchor="middle">REPLICAS</text><text class="diagram-label" x="224" y="243" text-anchor="middle">ADMIT</text><text class="diagram-label" x="326" y="243" text-anchor="middle">QUEUE</text><text class="diagram-label" x="487" y="243" text-anchor="middle">BATCH</text>
    <path class="diagram-rule" d="M36 300H524"/><text class="diagram-foot" x="36" y="324">Control the work before it reaches storage.</text>
  </svg>`;
}
