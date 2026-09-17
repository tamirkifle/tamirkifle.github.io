# Content provenance

This redesign reviews and improves presentation. It does not re-audit the project repositories or reproduce their benchmarks.

Primary content sources were the original `index.html` at commit `9bcd696` and the existing `media/resume.pdf`. The current résumé supplied exact employment dates, Seattle location, email, and fuller descriptions of recent roles. The original site supplied the detailed project scope and experiment caveats. No new benchmark outcomes, clients, employers, credentials, hobbies, or availability claims were invented.

| Area               | Editorial decision                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| InferRS            | Lead with an engine in development. Name the models and formats it actually runs. Do not imply GPU support, large-model generation, or a serving-throughput result.                         |
| LedgerKV           | Lead with two replication paths on shared storage. Distinguish a found counterexample from a bounded passing check. Put the cluster measurements in the project notes with their run scope. |
| Liftline           | Use the repository's own name. Keep the write-count and fleet-admission observations, and say that every recorded run measures LocalStack rather than real DynamoDB.                        |
| AI4HC              | State data-lead and integration-review ownership, team size, and teammates' contributions. Retain a private-repository notice rather than a disabled source button.                         |
| Vision Profiler    | Describe the harness and GPU synchronization method without inventing absent benchmark results.                                                                                             |
| Object Recognition | Describe the implemented feature-space method; link the existing demonstration without a frame-rate or accuracy claim.                                                                      |
| Employment         | Use résumé dates and concise descriptions of the work. Avoid unsourced public performance claims where the previous page gave insufficient measurement context.                             |
| Writing            | Nothing is published. Every file in `content/writing/` carries `published: false`, so the writing index and each project's collection render an empty state.                                |
| Education          | Keep December 2026 as expected graduation, not a completed degree.                                                                                                                          |

The diagrams are explanatory schematics, not screenshots, live telemetry, benchmark plots, or an assertion that incomplete components constitute a finished system. Project counts and current homepage selection come from `content/site.json`.

LedgerKV's interactive replication diagram was checked against its [README](https://github.com/tamirkifle/distributed-kv-database/blob/main/README.md) and [architecture documentation](https://github.com/tamirkifle/distributed-kv-database/blob/main/docs/architecture.md). It contrasts an elected Raft leader and ordered log with per-request coordination and configurable leaderless write quorums. The displayed N = 5, W = 3 configuration is labeled as an example, not a measured run or a claim about defaults. Animation timing is illustrative.

The quorum animation also uses [`LeaderlessKVCluster.write`](https://github.com/tamirkifle/distributed-kv-database/blob/main/src/main/java/com/ledgerkv/cluster/LeaderlessKVCluster.java) as a source: writes fan out concurrently to the key's replicas, and W successful acknowledgements establish success. The current loop can still await the remaining completions or deadline after reaching W, despite the class documentation describing an early return. The illustration ends at quorum attainment and does not animate an immediate client response. Replays vary which three replicas acknowledge first; the coordinator's local replica is eligible but is not automatically counted. Randomness represents illustrative response ordering, not random selection of replication targets or measured latency.

The independent reviewer received an unchanged snapshot and no design direction before the initial critique. Its perspective is simulated, subjective, and limited to presentation; the report makes those limits explicit.

## Engineering-blog revision

The user clarified that the site should be an engineering blog, not a presentation selling them as an employee. The final homepage therefore leads with projects and writing. Employment, education, and the résumé remain on About. The role/location eyebrow, colored status dot, hero calls to action, recent-employment strip, and contact sales band were removed.

Each project has a short overview in `content/overviews/`. All writing lives in `content/writing/`, one Markdown file per piece, and declares the projects it belongs to in its frontmatter. A project's collection is assembled from that association, so a project can carry several pieces and a piece can span several projects.

The six technical notes were originally served at `work/<project>/notes.html` with no publication date, on the reasoning that a date would have been invented. They are now dated `2026-09-05`, the day they were actually written (commit `d039a51`). That is a recorded fact rather than an invention; the earlier concern was backdating notes to imply older work, which this does not do. The old `work/<project>/notes.html` URLs were dropped rather than redirected. Existing placeholder articles remain unpublished.

## 2026-09-17 — InferRS and Liftline re-read at source

Two repositories had moved far enough that the site data was wrong rather than merely dated. Both
were read directly; the other four projects are unchanged, and the opening line of this document
still describes them. The prose was edited line by line rather than rewritten, so the existing
overview voice is intact.

**InferRS** — `github.com/tamirkifle/inferrs`, renamed from `mini-rust-inference`.

- The stack tag said `SIMD`. `grep -rni simd src/` returns nothing, and the README states that the
  multi-accumulator kernels use none. The tag now reads `Rust / GGUF / Q8_0`.
- "Full Llama-7B generation is unfinished" is gone. 7B appears nowhere in the repository. It now
  targets small models and F32, F16 and Q8_0 only, per `docs/LIMITATIONS.md`, and the overview says
  that instead.
- No benchmark figure was added to the site. The README has them; the site still describes
  components rather than quoting throughput.

**Liftline** — `github.com/tamirkifle/liftline`, renamed from `skier-tracking-system`.

- Renamed on the site to match the repository. The slug stays `ski-tracker`, so
  `/work/ski-tracker.html` does not break.
- The stack tag listed `AWS`. The README states that nothing has run against real DynamoDB and that
  every benchmark in `benchmarks/results/` is LocalStack-bound. The tag now names DynamoDB and the
  overview says where the runs were measured.
- The overview's closing line previously separated "the earlier cloud run" from the LocalStack
  experiments by pointing at the project notes. Nothing is published, so it now states the
  LocalStack constraint directly, and keeps the repository's own rule: counts reproduced under an
  arm swap, times did not, so the two are not read as interchangeable.

The `scope` field in `content/site.json` is read by no template. It was corrected for both projects
and changes nothing on the site.
