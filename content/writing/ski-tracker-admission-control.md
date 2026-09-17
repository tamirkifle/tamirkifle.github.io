---
title: Admission control and write batching
summary: Coordinating a fleet-wide limit, reducing writes, and keeping local and cloud experiments separate.
date: 2026-09-05
projects: [ski-tracker]
tags: [java, aws, rate-limiting]
published: true
---

## What it does

The system ingests ski lift-ride events through RabbitMQ, stores them in DynamoDB, and serves cached reads through Redis. An admission controller coordinates a rate limit across replicas and sheds load when the queue falls behind.

Two separate questions drive the implementation: how many events the system admits, and how much downstream work each admitted event creates.

## A rate limit belongs to the fleet

A per-replica limit grows with the number of replicas. The rebuilt admission controller uses Redis coordination to apply a shared target across the fleet.

In the recorded saturation experiment, admission moved from about 200 events per second to 99.8 events per second against a target of 100. This tests rate-control behavior, not maximum ingestion capacity.

## Reducing downstream writes

Batch coalescing reduced DynamoDB write requests from 13,168 to 533, a 96% reduction in the local comparison. HyperLogLog-based distinct counting reduced distinct-count writes from 25,163 to 9,635, or 62%.

These post-rebuild comparisons ran locally against LocalStack. They measure write-request reduction in those experiments; they are not cloud throughput or billing measurements.

## Keep the runs separate

An earlier EC2 run using the DynamoDB service sustained 4,309 requests per second across 200,000 requests, with all requests succeeding. That run predates the local rebuild comparisons above.

A batching throughput result changed when the run order was swapped, so it does not support a stable throughput claim. The write-count and admission-control observations are the narrower results to take from the later experiments.

## Source

[Browse the pipeline, experiments, and architecture decisions on GitHub](https://github.com/tamirkifle/skier-tracking-system).
