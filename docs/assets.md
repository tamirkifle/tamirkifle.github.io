# Asset record

The redesigned public site uses original vector illustrations, the existing portrait and résumé, and self-hosted open-license fonts. It does not use the Graphik trial fonts or third-party stock art.

| Asset                                                               | Source / license                                                                                                | Use                            |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Instrument Sans                                                     | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/instrumentsans), SIL Open Font License 1.1  | Interface and body type        |
| Instrument Serif                                                    | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/instrumentserif), SIL Open Font License 1.1 | Page headings                  |
| Exploded model, memory blocks, replication topology, event pipeline | Original SVG in `scripts/art.mjs`, created for this redesign                                                    | Hero and project illustrations |
| Favicon                                                             | Original SVG in `media/favicon.svg`, created for this redesign                                                  | Browser icon                   |
| Social card                                                         | Generated from the site's type and SVG by `scripts/social-card.mjs`                                             | Link previews                  |
| Portrait and résumé                                                 | Pre-existing user-supplied `media/profile.jpeg` and `media/resume.pdf`                                          | About and download             |

Both font license texts are included in `media/type/`. Fonts were retrieved from Google's font service on September 5, 2026. Existing unused media remains in the repository. The legacy admin editor retains its existing external libraries and styling.
