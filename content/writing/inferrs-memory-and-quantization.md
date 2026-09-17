---
title: Memory, quantization, and the unfinished parts
summary: What is implemented in InferRS, what the component measurements mean, and what remains open.
date: 2026-09-05
projects: [inferrs]
tags: [rust, inference, quantization]
published: true
---

## What it does

InferRS is an inference engine in development, written in Rust. Its components cover memory-mapped GGUF loading, tensor operations, grouped-query attention, KV caching, sampling, and custom matrix multiplication kernels.

The work spans the path from a model file to token generation. Full Llama-7B generation is unfinished; the measurements below describe implemented components, not a completed serving system.

## The memory constraint

Llama-7B weights in f32 take roughly 24 GB in the measured configuration. INT8 quantization brings the footprint to 6.03 GB. Smaller weights also change how the kernels interact with the CPU cache.

The component benchmarks reported a 21× decode speedup over the f32 baseline on an M1 Pro. That is a comparison between those implementations on that machine, not an end-to-end tokens-per-second result or a comparison with an established inference runtime.

## What is implemented

- GGUF parsing and memory-mapped model loading.
- Tensor operations, grouped-query attention, KV caching, and sampling.
- INT8 quantization and parallel SIMD matrix multiplication kernels.
- Component tests and Criterion benchmarks.

## What remains open

The next meaningful milestone is complete 7B generation with a reproducible end-to-end throughput measurement. Until then, component speedups should stay separate from model-serving claims.

## Source

[Browse the implementation and benchmark code on GitHub](https://github.com/tamirkifle/mini-rust-inference).
