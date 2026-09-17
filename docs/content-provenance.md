# Content provenance

This redesign reviews and improves presentation. It does not re-audit the project repositories or reproduce their benchmarks.

Primary content sources were the original `index.html` at commit `9bcd696` and the existing `media/resume.pdf`. The current résumé supplied exact employment dates, Seattle location, email, and fuller descriptions of recent roles. The original site supplied the detailed project scope and experiment caveats. No new benchmark outcomes, clients, employers, credentials, hobbies, or availability claims were invented.

| Area               | Editorial decision                                                                                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| InferRS            | Lead with an engine in development. Retain the 24 GB → 6.03 GB footprint and identify the 21× result as a component comparison. Do not imply completed 7B generation or a serving-throughput result. |
| LedgerKV           | Lead with two replication paths on shared storage. Distinguish a found counterexample from a bounded passing check. Put the cluster measurements in the project notes with their run scope.          |
| Ski Tracker        | Separate the earlier EC2 run from later local LocalStack comparisons. Retain write-count and fleet-admission observations with their contexts.                                                       |
| AI4HC              | State data-lead and integration-review ownership, team size, and teammates' contributions. Retain a private-repository notice rather than a disabled source button.                                  |
| Vision Profiler    | Describe the harness and GPU synchronization method without inventing absent benchmark results.                                                                                                      |
| Object Recognition | Describe the implemented feature-space method; link the existing demonstration without a frame-rate or accuracy claim.                                                                               |
| Employment         | Use résumé dates and concise descriptions of the work. Avoid unsourced public performance claims where the previous page gave insufficient measurement context.                                      |
| Writing            | Original bodies were all “Coming soon...”. They remain drafts. The six project notes carry their real authoring date, 2026-09-05, and no date was backdated to suggest earlier work.                 |
| Education          | Keep December 2026 as expected graduation, not a completed degree.                                                                                                                                   |

The diagrams are explanatory schematics, not screenshots, live telemetry, benchmark plots, or an assertion that incomplete components constitute a finished system. Project counts and current homepage selection come from `content/site.json`.

LedgerKV's interactive replication diagram was checked against its [README](https://github.com/tamirkifle/distributed-kv-database/blob/main/README.md) and [architecture documentation](https://github.com/tamirkifle/distributed-kv-database/blob/main/docs/architecture.md). It contrasts an elected Raft leader and ordered log with per-request coordination and configurable leaderless write quorums. The displayed N = 5, W = 3 configuration is labeled as an example, not a measured run or a claim about defaults. Animation timing is illustrative.

The quorum animation also uses [`LeaderlessKVCluster.write`](https://github.com/tamirkifle/distributed-kv-database/blob/main/src/main/java/com/ledgerkv/cluster/LeaderlessKVCluster.java) as a source: writes fan out concurrently to the key's replicas, and W successful acknowledgements establish success. The current loop can still await the remaining completions or deadline after reaching W, despite the class documentation describing an early return. The illustration ends at quorum attainment and does not animate an immediate client response. Replays vary which three replicas acknowledge first; the coordinator's local replica is eligible but is not automatically counted. Randomness represents illustrative response ordering, not random selection of replication targets or measured latency.

The independent reviewer received an unchanged snapshot and no design direction before the initial critique. Its perspective is simulated, subjective, and limited to presentation; the report makes those limits explicit.

## Engineering-blog revision

The user clarified that the site should be an engineering blog, not a presentation selling them as an employee. The final homepage therefore leads with projects and writing. Employment, education, and the résumé remain on About. The role/location eyebrow, colored status dot, hero calls to action, recent-employment strip, and contact sales band were removed.

Each project has a short overview in `content/overviews/`. All writing lives in `content/writing/`, one Markdown file per piece, and declares the projects it belongs to in its frontmatter. A project's collection is assembled from that association, so a project can carry several pieces and a piece can span several projects.

The six technical notes were originally served at `work/<project>/notes.html` with no publication date, on the reasoning that a date would have been invented. They are now dated `2026-09-05`, the day they were actually written (commit `d039a51`). That is a recorded fact rather than an invention; the earlier concern was backdating notes to imply older work, which this does not do. The old `work/<project>/notes.html` URLs were dropped rather than redirected. Existing placeholder articles remain unpublished.
