---
title: Measuring asynchronous GPU work
summary: Warmup, synchronization, and the difference between queuing work and finishing it.
date: 2026-09-05
projects: [vision-profiler]
tags: [python, pytorch, benchmarking]
published: true
---

## What it measures

Vision Profiler compares ResNet-50, ConvNeXt-Tiny, EfficientNet-B3, and MobileNetV3 through the same GPU benchmarking harness. A three-person team built it for a course.

## Waiting for the GPU

CUDA and MPS queue GPU work asynchronously. A timer around a model call can measure the time to enqueue work rather than the time to finish it.

The harness performs ten warmup passes, then explicitly synchronizes after each of 100 timed passes. It reports mean, standard deviation, minimum, maximum, and derived throughput.

## Scope of the evidence

The harness is inspectable in the repository. Result files were gitignored, so this page does not quote a model speed ranking or measured throughput. It describes the measurement method rather than claiming a performance outcome.

## Source

[Browse the benchmarking harness on GitHub](https://github.com/tamirkifle/vision-model-profiler).
