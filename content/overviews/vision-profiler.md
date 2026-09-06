Vision Profiler is a benchmarking harness for four PyTorch vision models. A three-person team built it for a course, to compare the models through the same measurement path on the same GPU.

The central detail is synchronization. CUDA and MPS can return before queued work finishes, so timing a model call alone can give a misleading result. The harness uses warmup passes and explicitly waits for GPU work to complete.

The implementation is public. The result files were not committed, so the notes focus on the measurement method rather than quoting a model ranking.
