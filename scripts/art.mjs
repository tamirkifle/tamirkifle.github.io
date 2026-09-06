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

export const replicationModes = {
  raft: {
    label: "Raft",
    caption:
      "The elected leader orders writes in one log. A majority replicates the entry before it commits.",
    description:
      "Example Raft write: the client sends to leader 01, which replicates to four followers. Nodes 01, 02, and 03 form the committing majority.",
  },
  quorum: {
    label: "Quorum",
    caption:
      "Any node can coordinate. Write to all 5 replicas; any 3 successful acknowledgements satisfy the write quorum.",
    description:
      "Example leaderless write with N = 5 and W = 3: node 02 coordinates writes to all five replicas. Nodes 01, 02, and 03 acknowledge, satisfying the write quorum. There is no elected leader.",
  },
};

function replicationArt() {
  const nodes = [
    [280, 180],
    [130, 125],
    [430, 125],
    [130, 250],
    [430, 250],
  ];
  const paths = {
    raft: [
      "M280 84V147",
      "M249 168L154 137",
      "M311 168L406 137",
      "M250 194L154 239",
      "M310 194L406 239",
    ],
    quorum: [
      "M250 84L154 111",
      "M153 137L256 168",
      "M156 125H404",
      "M130 151V224",
      "M148 147Q224 268 404 250",
    ],
  };
  return `<svg class="replication-art" viewBox="0 0 560 350" role="img" aria-label="${replicationModes.raft.description}">
    ${Object.entries(replicationModes)
      .map(([mode, content]) => {
        const source = mode === "raft" ? 0 : 1;
        const targets = mode === "raft" ? [0, 2, 3, 4, 5] : [0, 1, 3, 4, 5];
        return `<g data-network-mode="${mode}" data-acknowledgements="1,2,3" data-description="${content.description}" ${mode === "raft" ? "" : "hidden"}>
      <text class="diagram-label" x="36" y="38">${mode === "raft" ? "RAFT" : "LEADERLESS"}</text><text class="diagram-label" x="524" y="38" text-anchor="end">ONE WRITE</text>
      <rect class="network-client" x="243" y="58" width="74" height="26" rx="13"/><text class="network-client-text" x="280" y="76" text-anchor="middle">write</text>
      ${paths[mode].map((path, i) => `<path class="replication-route ${i > 2 ? "route-pending" : "route-confirmed"}" data-path="${i}" data-replica="${targets[i]}" d="${path}"/>`).join("")}
      ${nodes
        .map(
          ([x, y], i) => `<g>
        <circle class="network-confirmation" data-node="${i + 1}" ${i < 3 ? "" : "hidden"} cx="${x}" cy="${y}" r="${i === source && mode === "raft" ? 39 : 32}"/>
        <circle class="replication-node ${i === source ? (mode === "raft" ? "is-leader" : "is-coordinator") : ""}" ${i === source ? "data-complete" : ""} cx="${x}" cy="${y}" r="${i === source && mode === "raft" ? 33 : 26}"/>
        <text class="replication-node-text ${i === source && mode === "raft" ? "is-leader" : ""}" x="${x}" y="${y + 5}" text-anchor="middle">0${i + 1}</text>
        ${i === source ? `<text class="diagram-label network-role" x="${x}" y="${mode === "raft" ? 240 : 80}" text-anchor="middle">${mode === "raft" ? "LEADER" : "COORDINATOR"}</text>` : ""}
      </g>`,
        )
        .join("")}
      ${paths[mode].map((_, i) => `<circle class="network-packet" r="4" data-route="${i}" data-phase="${i === 0 ? "request" : "replicate"}"/>`).join("")}
      ${(mode === "raft" ? [1, 2] : [1, 2, 3, 4]).map((i) => `<circle class="network-packet packet-ack" r="4" data-route="${i}" data-phase="ack"/>`).join("")}
      ${mode === "raft" ? '<circle class="network-packet packet-ack" r="4" data-route="0" data-phase="reply"/>' : ""}
      <path class="diagram-rule" d="M36 300H524"/><text class="diagram-foot" x="36" y="324">${mode === "raft" ? "Majority commit · 3 of 5 nodes" : "Example write · N = 5, W = 3"}</text>
      </g>`;
      })
      .join("")}
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
  if (type === "consensus") return replicationArt();
  return `<svg viewBox="0 0 560 350" role="img" aria-label="Event flow from replicas, through admission control and a queue, to batched writes in DynamoDB.">
    <text class="diagram-label" x="36" y="38">EVENT FLOW</text><text class="diagram-label" x="524" y="38" text-anchor="end">SHARED LIMIT</text>
    <g class="pipeline-lines"><path d="M78 114H132V226H78M78 170H190M244 170H290M388 170H462"/><path d="m179 165 5 5-5 5m100-10 5 5-5 5m167-10 5 5-5 5"/></g>
    ${[114, 170, 226].map((y) => `<rect class="pipeline-source" x="44" y="${y - 17}" width="34" height="34" rx="2"/><path class="pipeline-tick" d="M55 ${y}h12"/>`).join("")}
    <rect class="pipeline-gate" x="190" y="136" width="54" height="68" rx="27"/><path class="gate-mark" d="M204 154H230L220 171V184L214 188V171Z"/>
    <rect class="pipeline-queue" x="290" y="134" width="98" height="72" rx="3"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect class="pipeline-event" x="${302 + i * 13}" y="152" width="9" height="36" rx="1"/>`).join("")}
    <path class="pipeline-db" d="M462 145V195C462 206 512 206 512 195V145"/><ellipse class="pipeline-db" cx="487" cy="145" rx="25" ry="9"/><path class="pipeline-tick" d="M462 169C462 180 512 180 512 169"/>
    <text class="diagram-label" x="61" y="272" text-anchor="middle">REPLICAS</text><text class="diagram-label" x="217" y="272" text-anchor="middle">ADMISSION</text><text class="diagram-label" x="339" y="272" text-anchor="middle">QUEUE</text><text class="diagram-label" x="487" y="272" text-anchor="middle">DYNAMODB</text>
    <path class="diagram-rule" d="M36 300H524"/><text class="diagram-foot" x="36" y="324">Fleet admission and batched DynamoDB writes.</text>
  </svg>`;
}
