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
| Writing            | Original bodies were all “Coming soon...”. They remain drafts. New project notes are explicitly project notes, not backdated standalone articles.                                                    |
| Education          | Keep December 2026 as expected graduation, not a completed degree.                                                                                                                                   |

The diagrams are explanatory schematics, not screenshots, live telemetry, benchmark plots, or an assertion that incomplete components constitute a finished system. Project counts and current homepage selection come from `content/site.json`.

The independent reviewer received an unchanged snapshot and no design direction before the initial critique. Its perspective is simulated, subjective, and limited to presentation; the report makes those limits explicit.

## Engineering-blog revision

The user clarified that the site should be an engineering blog, not a presentation selling them as an employee. The final homepage therefore leads with projects and writing. Employment, education, and the résumé remain on About. The role/location eyebrow, colored status dot, hero calls to action, recent-employment strip, and contact sales band were removed.

Each project now has a short overview in `content/overviews/` and a separate technical note sourced from the previously prepared project text. Those notes have no invented publication dates. Future posts can specify a `project` slug; multiple published articles are gathered automatically into that project’s collection. Existing placeholder articles remain unpublished.
