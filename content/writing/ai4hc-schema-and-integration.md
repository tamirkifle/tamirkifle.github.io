---
title: Schema and integration notes
summary: The event contract, database migrations, and integration review across a team.
date: 2026-09-05
projects: [ai4hc]
tags: [postgresql, data-modeling, integration]
published: true
---

## The pipeline

AI4HC takes clinician audio through AWS Transcribe and LLM extraction into structured records in PostgreSQL. It was built by a team of ten.

## My contribution

I was the data lead and integration reviewer. My scope was the database schema, migrations, canonical event specification, and Docker Compose stack.

The schema uses four tables, with JSONB for event shapes that vary. The shared specification defines field names and required fields for seven clinical event types across three teams. I authored seven of the eight Flyway migrations.

## The integration boundary

I reviewed 14 pull requests at the integration gate and blocked 11 with critical findings, including patient-data cascade deletion and corrupted JSONB. These are review counts, not a performance result.

The extraction consumer, architecture diagrams, and model-selection decision record were teammates' work. No performance measurements were collected for the pipeline.

## Source availability

The repository is private. This page describes my contribution; there is no public implementation link to inspect.
