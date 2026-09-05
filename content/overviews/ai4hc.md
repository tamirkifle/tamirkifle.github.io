AI4HC is a team project that turns clinician audio into structured medical records. Audio passes through transcription and model extraction before the resulting events reach PostgreSQL.

My part was the data model and integration boundary: schema, migrations, a shared event specification, and the Compose stack. A common contract mattered because three teams were producing and consuming the same clinical events.

The repository is private. The notes describe my contribution and distinguish it from the extraction and architecture work done by teammates.
