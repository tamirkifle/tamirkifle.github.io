/* ============================================
   tamir.info - Side Quest case-study content
   --------------------------------------------
   Every number here is measured, not estimated. Sources:
     - LLM engine: Criterion benchmarks on Apple M1 Pro (10 cores),
       plus the repo's own memory-footprint harness.
     - LedgerKV: a live 5-node Docker cluster driven under load with a
       SIGKILL'd replica; metrics scraped from each node's /metrics.
   ============================================ */

window.PROJECTS = [
  /* ==========================================================
     1. LLM Inference Engine
     ========================================================== */
  {
    slug: 'llm-engine',
    name: 'LLM Inference Engine',
    eyebrow: 'Systems / ML infrastructure',
    tagline: 'Llama-family inference written from scratch in Rust — no PyTorch, no ONNX, no BLAS. Every kernel hand-written, profiled, and rewritten until the numbers made sense.',
    status: { label: 'Pipeline complete · 7B end-to-end in progress', tone: 'active' },
    stack: ['Rust', 'NEON / AVX2 intrinsics', 'Rayon', 'GGUF', 'Criterion'],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/tamirkifle/mini-rust-inference', primary: true },
      { label: 'Read the write-up', href: 'post.html?slug=building-llm-inference-rust' }
    ],
    metrics: [
      { value: '157.9', unit: 'Gelem/s', label: 'f32 GEMM throughput', note: '1024², NEON + Rayon, 10 cores' },
      { value: '21', unit: '×', label: 'INT8 speedup on decode', note: 'the projection that gates interactive generation' },
      { value: '6.03', unit: 'GB', label: 'Llama-7B weights, INT8', note: 'down from 24.12 GB in f32 — fits 8 GB' },
      { value: '873', unit: 'tests', label: 'passing', note: 'kernels, tensors, attention, cache, quantization' }
    ],
    story: [
      {
        heading: 'The problem',
        body: 'Running a 7-billion-parameter model on a laptop is a memory-bandwidth problem wearing a linear-algebra costume. Every mainstream stack hides that behind PyTorch, BLAS, and a vendor runtime — so you never find out which layer is actually costing you the token. I wanted to own all of it: file format to sampled token.'
      },
      {
        heading: 'What I built',
        body: 'A complete inference path in Rust with no numeric dependencies. A GGUF v2/v3 parser with memory-mapped lazy weight loading. An N-dimensional tensor system with zero-copy strided views for slice/reshape/transpose. Hand-written NEON and AVX2 GEMM kernels plus an INT8 × INT8 → INT32 path. RMSNorm, SiLU, SwiGLU, RoPE, numerically stable softmax. Grouped-query attention with causal and sliding-window masking. Flat and paged KV-caches, chunked prefill, LRU prompt-cache reuse. A SentencePiece BPE tokenizer read straight out of GGUF metadata, temperature/top-k/top-p sampling, and a Session API with multi-turn extend().'
      },
      {
        heading: 'Why it matters',
        body: 'The interesting result is not that it runs — it is that the measurements changed the design three separate times. A cache-tiled kernel that should have been faster was 5.5× slower. Quantization that looked like a 2× win was a 21× win on the one shape that matters. The memory math is what decides whether 7B fits in 8 GB at all, and it does: 6.03 GB.'
      }
    ],
    exhibits: [
      {
        tab: 'GEMM evolution',
        title: 'Three kernels, same shape, 1024 × 1024',
        caption: 'Criterion means on an Apple M1 Pro (10 cores). Blocking alone bought nothing — the win came from making the inner loop vectorize, then handing rows to Rayon.',
        type: 'bars',
        unit: 'Gelem/s',
        max: 175,
        bars: [
          { label: 'naive scalar (i-p-j)', value: 23.3 },
          { label: 'cache-tiled + NEON', value: 22.2 },
          { label: 'NEON + Rayon (10 cores)', value: 157.9, highlight: true }
        ]
      },
      {
        tab: 'INT8 on decode',
        title: 'Where quantization actually pays',
        caption: 'Decode runs one token row against a full weight matrix — [1, 4096] × [4096, 11008]. It is bandwidth-bound, so the 512 KB INT8 weight block fits in L2 where the 2 MB f32 block cannot. 21× on the path that gates every generated token.',
        type: 'bars',
        unit: 'Gelem/s',
        max: 260,
        groups: [
          {
            label: '512 × 512 (prefill-shaped)',
            bars: [
              { label: 'f32 parallel', value: 120.3 },
              { label: 'INT8 parallel', value: 234.4, highlight: true }
            ],
            note: '1.95×'
          },
          {
            label: 'decode token [1, 4096] × [4096, 11008]',
            bars: [
              { label: 'f32 parallel', value: 4.7 },
              { label: 'INT8 parallel', value: 100.6, highlight: true }
            ],
            note: '21×'
          }
        ]
      },
      {
        tab: 'Does 7B fit?',
        title: 'Llama-7B weight footprint vs. an 8 GB machine',
        caption: 'Per-channel INT8 quantization, plus direct Q8_0 inference from GGUF without ever materializing f32 weights. Toggle the dtype — the threshold is the whole argument for building the quantized path.',
        type: 'memfit',
        thresholdLabel: '8 GB RAM budget',
        thresholdGb: 8,
        maxGb: 26,
        options: [
          { label: 'f32', perLayerMb: 772, totalGb: 24.12, fits: false, verdict: 'Does not fit — 3× over budget' },
          { label: 'INT8', perLayerMb: 193, totalGb: 6.03, fits: true, verdict: 'Fits, with 2 GB left for KV-cache and activations' }
        ]
      },
      {
        tab: 'Loading a real model',
        title: 'Parsing a 4 GB Llama-7B GGUF file',
        caption: 'Real output from the engine\'s CLI against a 4.08 GB meta-llama-7b Q4_K_M checkpoint. Memory-mapped: the 291 tensor descriptors are read without pulling weights into RAM.',
        type: 'terminal',
        prompt: 'cargo run --release --bin llm -- llama-7b.Q4_K_M.gguf',
        lines: [
          'GGUF File: llama-7b.Q4_K_M.gguf',
          '  Version: 2',
          '  Architecture: llama',
          '  Name: meta-llama-7b',
          '  Tensors: 291',
          '  Parameters: 6.74B',
          '  Size: 4.08 GB',
          '  Layers: 32'
        ]
      },
      {
        tab: 'The pipeline',
        title: 'GGUF bytes to sampled token',
        caption: 'Everything inside the dashed border is hand-written Rust. The SIMD backend is chosen once at startup via a OnceLock, so the hot path pays a single atomic load.',
        type: 'flow',
        stages: [
          { name: 'GGUF mmap', detail: 'v2/v3 parser · lazy tensor load · LRU cache' },
          { name: 'BPE tokenizer', detail: 'SentencePiece vocab from GGUF metadata' },
          { name: 'Prefill', detail: 'chunked · Rayon above 32 tokens · prompt cache' },
          { name: '32 × transformer block', detail: 'QKV → RoPE → GQA → residual → SwiGLU', wide: true },
          { name: 'KV-cache', detail: 'pre-allocated flat + paged variants' },
          { name: 'Sampling', detail: 'temperature · top-k · top-p · greedy' }
        ]
      }
    ],
    deepDive: [
      {
        title: 'The 5.5× "optimization" that wasn\'t',
        body: 'The cache-tiled kernel was textbook-correct and measured 521.9 ms at 1024² — against the naive scalar loop\'s 94.9 ms. Blocking was not the problem; the tiling had restructured the inner loop into a shape the compiler would no longer auto-vectorize, so every tile ran scalar with added index arithmetic. Rewriting the accumulator so NEON <code>vfmaq_f32</code> could be emitted, then dispatching rows across Rayon, took the same shape to 157.9 Gelem/s. The lesson I actually keep: benchmark the version you are sure is faster, first.'
      },
      {
        title: 'Quantization targeted at the bottleneck, not the benchmark',
        body: 'It is easy to report INT8 as "≈2× faster" from square-matrix benchmarks. But interactive generation does not run square matmuls — it runs one token row against an 11008-wide projection, once per layer, per token. That shape is purely memory-bandwidth-bound, and it is where INT8 goes 21× (4.7 → 100.6 Gelem/s). Per-channel weight quantization with calibration tooling keeps the accuracy cost bounded while the weights stay resident in L2.'
      },
      {
        title: 'Memory management as a first-class subsystem',
        body: 'A pre-allocated flat KV-cache for the common case and a paged variant for dynamic allocation. A free-list tensor pool and an arena bump allocator so the decode loop stops touching the global allocator. Chunked prefill with LRU KV snapshot reuse so a repeated system prompt is not recomputed. RSS tracked directly through <code>task_vm_info</code> on macOS and <code>/proc/self/status</code> on Linux, so the footprint claims are observed rather than derived.'
      },
      {
        title: 'One binary, three instruction sets',
        body: 'NEON on aarch64, AVX2 on x86_64, scalar everywhere else — selected once behind a <code>OnceLock</code> and reduced to a single relaxed atomic load on every subsequent call. Each backend is tested against the scalar reference so a vectorized path cannot silently diverge.'
      }
    ],
    note: 'Straight answer on scope: the full pipeline is implemented and 873 tests pass, but the numbers above are kernel-level and memory-level measurements — not an end-to-end tokens/sec claim. A polished CLI and a full Llama-7B generation run against the real checkpoint are the remaining work, and I would rather publish the honest benchmark than a flattering one.'
  },

  /* ==========================================================
     2. LedgerKV
     ========================================================== */
  {
    slug: 'ledgerkv',
    name: 'LedgerKV',
    eyebrow: 'Distributed systems',
    tagline: 'A distributed key-value store that implements both sides of the CAP tradeoff — Dynamo-style leaderless quorum and Raft — over one LSM storage engine, then proves in CI which guarantee each one actually delivers.',
    status: { label: '5-node cluster · 361 tests · Docker + Kubernetes', tone: 'shipped' },
    stack: ['Java 11', 'gRPC / Protobuf', 'Raft', 'LSM-tree', 'Docker', 'Kubernetes', 'Prometheus / Grafana'],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/tamirkifle/distributed-kv-database', primary: true },
      { label: 'Read the write-up', href: 'post.html?slug=distributed-kv-consistency' }
    ],
    metrics: [
      { value: '69,140', unit: 'ops', label: 'driven through a live 5-node cluster', note: 'Docker, N=3, W=R=2, ~250 ops/s sustained' },
      { value: '0', unit: '', label: 'failed ops · 0 quorum failures', note: 'including 90 s with a replica SIGKILL\'d mid-run' },
      { value: '15', unit: 'ms', label: 'steady-state p99 latency', note: 'p50 2 ms · p95 8 ms · 90 hedge requests fired' },
      { value: '361', unit: 'tests', label: 'passing in CI', note: 'including a linearizability checker' }
    ],
    story: [
      {
        heading: 'The problem',
        body: '"AP or CP" is one slide in every distributed-systems course, and almost nobody builds both. So the tradeoff stays abstract — you can recite that a quorum with W+R ≤ N serves stale reads without ever having watched it happen. I wanted a system where both models run in the same binary against the same storage engine, and where the difference between them is demonstrated by a test rather than asserted by a README.'
      },
      {
        heading: 'What I built',
        body: 'Bottom-up: a write-ahead log with CRC32 framing, group-commit fsync, and crash recovery; a MemTable and SSTables with sparse indexes and Bloom filters; size-tiered and leveled compaction. Then the cluster: a consistent-hash ring with 150 virtual nodes per node, tunable N/R/W quorums with vector-clock versioning, read repair, and hinted handoff. Then Raft — leader election, log replication, durable log, snapshotting and log compaction — driving a linearizable register state machine. Around all of it: gRPC transport with streaming range scans, deadline-bounded replica fan-out, request hedging, a hand-written Prometheus exporter on every node, a provisioned Grafana dashboard, and Docker Compose plus Kubernetes manifests.'
      },
      {
        heading: 'Why it matters',
        body: 'The system is operable, and it is falsifiable. Every number in this case study came out of a cluster I brought up and hammered: 69,140 operations at roughly 250 ops/s across five Docker nodes, with one replica hard-killed for 90 seconds in the middle of the run. Zero operations failed, zero quorum failures, steady-state p99 of 15 ms. And a Wing & Gong-style linearizability checker runs in CI to confirm the Raft path is linearizable while the W+R ≤ N quorum path is not — the interesting claim, checked automatically, on every commit.'
      }
    ],
    exhibits: [
      {
        tab: 'Live dashboard',
        title: 'A 5-node cluster through a hard node kill',
        caption: 'Not a mock-up — this is Grafana reading Prometheus, scraping the hand-written exporter on all five nodes during the run described above. <strong>node2 is SIGKILL\'d at 15:14 and restarted at 15:16</strong>: its ops line drops out and comes back while the other four hold ~50 ops/s each, and <strong>quorum failures stay flat at zero for the entire window</strong>. Being straight about the two p99 spikes: the 250 ms one is JVM warm-up as load ramps, and node2\'s 105 ms blip is its cold restart. The kill itself never moved p99 — that is what deadline-bounded fan-out and hedging are for.',
        type: 'image',
        src: 'media/projects/ledgerkv-grafana.png',
        alt: 'Grafana dashboard showing LedgerKV operations per second, p99 latency, quorum failures, and repairs across five nodes during an injected node failure'
      },
      {
        tab: 'Failure demo',
        title: 'A write that outlives the node holding it',
        caption: 'Verbatim capture against the live cluster. Note two things: node1 successfully coordinates a read for a key it does not even store — every node is a coordinator — and a brand-new write commits while a third of the key\'s replica set is dead.',
        type: 'terminal',
        termTitle: 'ledgerkv — failure injection',
        prompt: 'docker compose ps  &&  grpcurl ...   # 5-node cluster, N=3, W=R=2',
        lines: [
          '  node0   Up 12 minutes (healthy)',
          '  node1   Up 12 minutes (healthy)',
          '  node2   Up 12 minutes (healthy)',
          '  node3   Up 12 minutes (healthy)',
          '  node4   Up 12 minutes (healthy)',
          '',
          '$ grpcurl -d \'{"key":"cart:9f3e","value":"in-cart"}\' :9090 LedgerKvNode/Put',
          '  version: 1',
          '',
          '# which replicas actually hold it? direct local reads, no coordination',
          '  node0   HOLDS   version 1',
          '  node1   -       not in the preference list',
          '  node2   HOLDS   version 1',
          '  node3   -       not in the preference list',
          '  node4   HOLDS   version 1',
          '',
          '$ docker compose kill -s SIGKILL node2      # a replica for this key',
          '  node2 /health: UNREACHABLE   process gone, 2 of 3 replicas left',
          '',
          '$ grpcurl -d \'{"key":"cart:9f3e"}\' :9091 LedgerKvNode/Get   # via node1',
          '  found: true   version: 1   value: "in-cart"   vclock: {"node-0":"1"}',
          '',
          '$ grpcurl -d \'{"key":"cart:9f3e","value":"checked-out"}\' :9090 .../Put',
          '  version: 2                                  # degraded write commits',
          '',
          '$ grpcurl -d \'{"key":"cart:9f3e"}\' :9093 LedgerKvNode/Get   # via node3',
          '  found: true   version: 2   value: "checked-out"   vclock: {"node-0":"2"}',
          '',
          '# 90 s of sustained load with that replica dead:',
          '#   69,140 ops · 0 failed · 0 quorum failures · p99 15 ms'
        ]
      },
      {
        tab: 'Quorum simulator',
        title: 'Kill replicas and watch the guarantee hold — then break',
        caption: 'The real preference list for <code>cart:9f3e</code> on the running cluster, taken from the transcript in the previous tab. Click a node to kill it. N=3, W=R=2 — this is the arithmetic the coordinator actually runs before it decides whether it is allowed to say yes.',
        type: 'ring'
      },
      {
        tab: 'Architecture',
        title: 'Two consistency paths, one storage engine',
        caption: 'The AP and CP paths are deliberately separate gRPC services over shared WAL framing, so the linearizability checker can verify each one independently.',
        type: 'arch'
      }
    ],
    deepDive: [
      {
        title: 'Proving the guarantee instead of claiming it',
        body: 'A Wing & Gong / Porcupine-style linearizability checker runs against recorded operation histories in CI. It confirms the Raft-backed register set is linearizable, and it demonstrates empirically that the leaderless quorum path admits stale reads when W+R ≤ N. Both results are the point: the checker is what separates a system that says it is consistent from one that is.'
      },
      {
        title: 'Tail latency treated as a design problem',
        body: 'A dead replica is easy — it fails fast. A slow replica is what wrecks p99, because the coordinator waits on it. So replica fan-out is concurrent and deadline-bounded, and after a p95-tuned delay the coordinator fires a hedge request at the next replica in the preference list and takes whichever returns first. Hedges are counted in <code>ledgerkv_hedged_requests_total</code>, so the mechanism is observable rather than a claim in a comment.'
      },
      {
        title: 'Failure as the test case, not the edge case',
        body: 'The repo ships failure-injection scripts for hard node loss and for network partitions, so "survives a node loss" is something you run in about thirty seconds rather than something you take on faith — which is exactly how the numbers on this page were produced. Divergence is handled on two paths: hinted handoff parks writes bound for an unreachable replica on a live neighbour for delivery on recovery, and read repair reconciles staleness discovered during a quorum read. Convergence there is eventual by construction, and pinning down its actual timing under load is the next measurement I want to publish rather than assert.'
      },
      {
        title: 'Built to be operated',
        body: '<code>/health</code> and <code>/metrics</code> on every node off the same JDK HttpServer, with a hand-written Prometheus text exporter — operation and failure counters, quorum failures, stale-read and conflict observations, hedge counts, repair activity, and p50/p95/p99 gauges. Plus a pre-provisioned Grafana dashboard, Kubernetes manifests with PVCs, and an in-repo YCSB-shaped JMH workload generator with a compaction read/write/space-amplification report.'
      }
    ],
    note: 'Current scope, stated plainly: the quorum value type is a UTF-8 string, and public Delete is served by the local engine only — cluster-wide delete is next, though the on-disk and wire formats already carry tombstones.'
  },

  /* ==========================================================
     Remaining side quests — short entries
     ========================================================== */
  {
    slug: 'vision-profiler',
    name: 'Vision Model Profiler',
    eyebrow: 'ML tooling',
    tagline: 'A profiling toolkit for PyTorch vision models — layer-level latency, memory, and throughput, so an architecture change can be justified with a measurement instead of a hunch.',
    stack: ['Python', 'PyTorch'],
    links: [{ label: 'View on GitHub', href: 'https://github.com/tamirkifle/vision-model-profiler', primary: true }],
    highlights: [
      'Per-layer timing and memory attribution across a forward and backward pass.',
      'Comparative runs so two architectures can be judged on the same hardware and batch shape.',
      'Reports built for deciding what to optimize next, not just for looking at.'
    ],
    note: 'Full case study with benchmark charts is being written up.'
  },
  {
    slug: 'ai4hc',
    name: 'AI4HC Pipeline',
    eyebrow: 'Research engineering',
    tagline: 'A TensorFlow training and evaluation pipeline built for the AI for Healthcare research project.',
    stack: ['Python', 'TensorFlow'],
    links: [],
    highlights: [
      'Reproducible preprocessing, training, and evaluation stages for clinical data.',
      'Experiment configuration and metric tracking designed for research iteration speed.'
    ],
    note: 'Full case study with results is being written up.'
  },
  {
    slug: 'ski-tracker',
    name: 'Ski Tracker',
    eyebrow: 'Computer vision',
    tagline: 'A real-time skier tracking system — C++ vision pipeline behind a React front end.',
    stack: ['C++', 'React'],
    links: [{ label: 'View on GitHub', href: 'https://github.com/tamirkifle/skier-tracking-system', primary: true }],
    highlights: [
      'Detection and tracking of skiers across frames from moving-camera footage.',
      'Live visualization of tracks and trajectories in the browser.'
    ],
    note: 'Full case study with demo footage is being written up.'
  },
  {
    slug: 'object-recognition',
    name: 'Object Recognition',
    eyebrow: 'Computer vision',
    tagline: 'Real-time 2D object recognition from a live camera feed, built on classical vision primitives rather than a pretrained network.',
    stack: ['Python', 'OpenCV'],
    links: [{ label: 'View on GitHub', href: 'https://github.com/tamirkifle/realtime-2d-object-recognition', primary: true }],
    highlights: [
      'Segmentation, region analysis, and rotation- and scale-invariant feature extraction.',
      'Nearest-neighbour classification against a labelled object database, live at frame rate.'
    ],
    note: 'Full case study with a confusion matrix and demo footage is being written up.'
  }
];
