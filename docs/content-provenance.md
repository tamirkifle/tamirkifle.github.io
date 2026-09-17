# Content provenance

This redesign reviews and improves presentation. It does not re-audit the project repositories or reproduce their benchmarks.

Primary content sources were the original `index.html` at commit `9bcd696` and the existing `media/resume.pdf`. The current résumé supplied exact employment dates, Seattle location, email, and fuller descriptions of recent roles. The original site supplied the detailed project scope and experiment caveats. No new benchmark outcomes, clients, employers, credentials, hobbies, or availability claims were invented.

| Area                | Editorial decision                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dreaming Up Authors | Every figure comes from the accepted paper itself, served at `/media/`. State the second-author position and do not claim the analyses that were co-authors' work.                          |
| InferRS             | Lead with an engine in development. Name the models and formats it actually runs. Do not imply GPU support, large-model generation, or a serving-throughput result.                         |
| LedgerKV            | Lead with two replication paths on shared storage. Distinguish a found counterexample from a bounded passing check. Put the cluster measurements in the project notes with their run scope. |
| Liftline            | Use the repository's own name. Keep the write-count and fleet-admission observations, and say that every recorded run measures LocalStack rather than real DynamoDB.                        |
| AI4HC               | State data-lead and integration-review ownership, team size, and teammates' contributions. Retain a private-repository notice rather than a disabled source button.                         |
| Vision Profiler     | Describe the harness and GPU synchronization method without inventing absent benchmark results.                                                                                             |
| Object Recognition  | Describe the implemented feature-space method; link the existing demonstration without a frame-rate or accuracy claim.                                                                      |
| Employment          | Use résumé dates and concise descriptions of the work. Avoid unsourced public performance claims where the previous page gave insufficient measurement context.                             |
| Writing             | Nothing is published. Every file in `content/writing/` carries `published: false`, so project pages drop their Writing section entirely and the writing index says so.                      |
| Education           | Keep December 2026 as expected graduation, not a completed degree.                                                                                                                          |

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

**InferRS** — `github.com/tamirkifle/mini-rust-inference`.

- The stack tag said `SIMD`. `grep -rni simd src/` returns nothing, and the README states that the
  multi-accumulator kernels use none. The tag now reads `Rust / GGUF / Q8_0`.
- "Full Llama-7B generation is unfinished" is gone. 7B appears nowhere in the repository. It now
  targets small models and F32, F16 and Q8_0 only, per `docs/LIMITATIONS.md`, and the overview says
  that instead.
- No benchmark figure was added to the site. The README has them; the site still describes
  components rather than quoting throughput.

**Liftline** — `github.com/tamirkifle/skier-tracking-system`.

- Renamed on the site to the name the working tree and the résumé both use. The slug stays
  `ski-tracker`, so `/work/ski-tracker.html` does not break.
- The stack tag listed `AWS`. The README states that nothing has run against real DynamoDB and that
  every benchmark in `benchmarks/results/` is LocalStack-bound. The tag now names DynamoDB and the
  overview says where the runs were measured.
- The overview's closing line previously separated "the earlier cloud run" from the LocalStack
  experiments by pointing at the project notes. Nothing is published, so it now states the
  LocalStack constraint directly, and keeps the repository's own rule: counts reproduced under an
  arm swap, times did not, so the two are not read as interchangeable.

The `scope` field in `content/site.json` is read by no template. It was corrected for both projects
and changes nothing on the site.

### Correction, same day: the repositories were not renamed

An earlier version of this section said InferRS had moved to `github.com/tamirkifle/inferrs` and
the ski tracker to `github.com/tamirkifle/liftline`, and the site's links were changed to match.
That was wrong, and the links were reverted. Both local checkouts carry a git remote pointing at
those names, but neither resolves:

```
mini-rust-inference     200        inferrs      404
skier-tracking-system   200        liftline     404
```

A GitHub rename leaves a redirect, so a renamed `mini-rust-inference` would also answer 200 by
following one — `inferrs` returning 404 rules that out. The remotes point at repositories that are
private or were never pushed. The site links what resolves. Everything else in this section stands:
it came from the working trees, which are the real code, not from the remote names.

**Liftline's name** is still used on the site. It is what the working tree's README and the
résumé's Projects section both call the project, independent of the repository's URL.

## 2026-09-17 — Dreaming Up Authors added

Sourced entirely from the accepted camera-ready, served at
`/media/dreaming-up-authors-emnlp-2026.pdf`. Tamir is second of five authors; the overview says
"my part was the data and the evaluation runs" and claims nothing about the co-authors' analysis.

- Corpus figures are the paper's own: 9,999,863 OAG records filtered to 1,921,209 papers by five
  filters (document type, author count, language, author-name patterns, title/author match), then
  9,108 papers stratified across eight disciplines and thirteen citation bins.
- The two rates quoted, above 98% and below 37%, are the abstract's own framing rather than any
  single model's endpoints, which differ (0.364 GPT-4o, 0.362 DeepSeek-R1, 0.169 Claude Sonnet 4.5).
- Five models is three plus two, not five of a kind: GPT-4o, DeepSeek-R1 and Claude Sonnet 4.5 were
  scored behaviourally; Qwen3-32B and Mistral-Small-3.2-24B were probed at their hidden states. The
  overview keeps those two groups apart.
- The `prevalence` diagram traces the shape of the measured curve across thirteen bins. Like the
  others it is a schematic, and its `aria-label` says so; only its two end figures are claims. Its
  axis is labelled by training-data prevalence, which is the quantity the paper is about, and its
  footer names citation count as the proxy, so the diagram does not imply prevalence was measured.
- The prose is the author's own, checked against the camera-ready and corrected in two places.
  "Models failed over 98% of the time" named the wrong kind of quantity: HR2 is a continuous
  Jaccard error rate over author names, not a count of failed attempts, so it now reads
  "hallucination rates exceeded 98%". The multiple-choice recognition sentence keeps its
  plural: Section 6 ran that experiment on GPT-4o alone, but the paper's own Conclusion states the
  finding in the same general terms, so the plural reports the claim rather than the run. It says
  "author options", not author teams, because the task is forced choice. "Landmark publications" became "the
  most-cited publications", since the bins are citation counts and landmark status is not a
  category the dataset has.

The InferRS `memory` diagram was relabelled in the same pass. It had asserted "LLAMA–7B" and
"24 GB f32 → 6.03 GB INT8" — figures from a README the repository no longer has — while the prose
beside it said larger models are not implemented. It now reads 929 MB f32 against 273 MB Q8_0 on
Llama-160M, which is the comparison the current README makes.

## 2026-09-17 — InferRS overview replaced, three claims corrected

The author supplied new prose. Its shape, emphasis and most of its wording are kept. Three claims
did not survive a check against the working tree.

**"Custom hand-written SIMD kernels" is not true, and this is the second place it has appeared.**
The whole crate has one SIMD-family token in it, and it is a comment recording an absence:

```
$ grep -rniE 'simd|neon|avx|target_feature|core::arch|std::arch' src benches tests
benches/kernels.rs:163: // No AVX2 or INT8-intrinsic rung: this machine is aarch64, so an x86 rung
```

`Cargo.toml` declares `memmap2` and `rayon` and nothing else, and the README states it outright:
"Splitting the dot product 8 ways drops the decode matmul from 41.56 ms to 1.77 ms. Reading Q8_0
blocks in place takes it to 0.68 ms. **Neither uses hand-written SIMD.**" The speedup is real and
large; the mechanism is multi-accumulator scalar code, which is what the overview now names. The
same claim is in the résumé's InferRS bullet ("parallel ARM NEON/AVX2 SIMD kernels with size-aware
runtime dispatch") and has been flagged there.

**"Zero-copy memory mapping ... drastically cuts down initialization times" is the exact reading
`docs/LIMITATIONS.md` warns against.** It says: "The load column measures nothing. `load 0.01s` is
not a fast load, it is an absent one. The weights are mmapped and untouched at startup, so the page
faults land in the first forward pass instead." The mapping is real; the saving is not. The
overview now says the cost moves rather than disappears.

**"A fast, transparent, and highly capable solution for local model inference" overstates the
range.** Per `docs/LIMITATIONS.md`: no GPU, no server, no batching above 1 outside prefill; F32,
F16 and Q8_0 only, so most `*-Q4_K_M.gguf` files will not load; the tokenizer needs
`tokenizer.ggml.scores`, which rules out SmolLM, Qwen, Phi and Llama-3; contexts past 831 tokens
are untested. The closing sentence carries the limits a reader would hit first, CPU only and
three weight formats, which is also how the other five overviews end. The context limit was cut
from it at the author's request; it remains recorded in `docs/LIMITATIONS.md` upstream.

Two register edits came with them: "high-performance" was dropped, and "latency bottlenecks common
in standard AI deployments" became "dependency weight common in standard AI stacks", because the
engine does not serve, batch, or run concurrent sessions and should not invite comparison against
systems that do.

## 2026-09-17 — AI4HC overview replaced, checked against `~/Documents/MyCode/NEU/CS6510/primary`

The author supplied new prose and renamed the project AI4HC Platform. Most of it verified exactly
against the repository. What held:

| Claim                                              | Evidence                                                                                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| AWS Transcribe and Claude on Amazon Bedrock        | `BEDROCK_MODEL_ID=us.anthropic.claude-haiku-4-5-20251001-v1:0` in `llm/config.py`                                                  |
| 11-person team                                     | 11 distinct humans in `git shortlog -sne --all`, after merging duplicate addresses                                                 |
| 4-table schema                                     | exactly four `CREATE TABLE`s: patients, sessions, transcripts, clinical_events                                                     |
| JSONB with GIN indexing                            | `CREATE INDEX idx_clinical_events_data_gin ON clinical_events USING GIN(data jsonb_path_ops)` in V4, which he wrote                |
| PHI kept off the broker                            | both publishers send only a session UUID: `convertAndSend(STT_QUEUE, sessionId)` and `convertAndSend(EXTRACTION_QUEUE, sessionId)` |
| canonical clinical event schema spec               | `docs/architecture/clinical-event-schemas-v2.md`, added by him                                                                     |
| ARM64 base image blockers                          | `backend/Dockerfile`: "arm64 (Apple Silicon). The -alpine variant has no ARM64 image on Docker Hub."                               |
| 30 pull requests reviewed                          | `gh search prs --reviewed-by tamirkifle` returns 32, so 30 understates rather than overstates                                      |
| double-encoded JSONB, Float/Double, cascade delete | his review bodies on PR #87, PR #145 and PR #71                                                                                    |

Three did not, and were corrected:

- **"Wrote the Flyway migrations" claimed all eight.** He added V1–V5 and V8; V6 is lsleek's and V7
  is Tzu-Ching Lin's, by `git log --diff-filter=A` per file. It now reads six of the eight. All
  four `CREATE TABLE`s are still his, which is the stronger half of the claim anyway.
- **"Five-service architecture" is six.** `compose.yml` declares postgres, rabbitmq, redis,
  backend, llm-consumer and llm-api.
- **"Because this was a project built for a client, the repository is not open sourced" is not
  supported.** The words client, sponsor, stakeholder and partner appear nowhere in `README.md` or
  `docs/`. The README calls it "a collaborative research and development project". The repository
  may well be private for other reasons, but the site should not assert a provenance the project's
  own documents do not record, so the sentence is now just "The repository is private."
