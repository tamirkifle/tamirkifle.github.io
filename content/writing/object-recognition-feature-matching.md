---
title: From pixels to feature matching
summary: Thresholding, region features, and matching in a smaller representation.
date: 2026-09-05
projects: [object-recognition]
tags: [computer-vision, python]
published: false
---

## From pixels to regions

This C++ pipeline recognizes objects using hand-written vision primitives. It thresholds each frame using ISODATA over a 6.25% pixel sample, segments regions, and estimates orientation using the least central moment.

## Two representations

Regions can be described by seven rotation- and scale-invariant features, or projected onto 20 principal components from a 64 × 64 image patch. The projection reduces 4,096 pixel values to a 20-dimensional representation for matching.

A new object can be added from one example image through matching in that feature space, without a new model training run. This describes the implemented method; it is not a general one-shot recognition accuracy claim.

## Watch it work

The repository does not contain committed timing measurements, so there is no frame-rate claim here. The recorded demonstration shows the pipeline in use.

[Watch the demonstration](https://youtu.be/xzrkeZ7salo) or [browse the implementation](https://github.com/tamirkifle/realtime-2d-object-recognition).
