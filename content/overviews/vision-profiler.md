Vision Profiler is a PyTorch benchmarking harness designed to evaluate computer vision models through a unified GPU measurement path. It was engineered to systematically benchmark architectures like ResNet-50 and ConvNeXt-Tiny, directly supporting our research and latency analysis on automated waste classification.

Designed for strict profiling precision, the tool actively manages hardware synchronization. CUDA and MPS can return before queued work finishes, so timing a model call alone measures the queueing rather than the work. By enforcing warmup iterations and explicit GPU wait states, the framework removes that error from the numbers.

Latencies are means over 100 inference passes after 10 warmup iterations, measured on a single Apple M1 Pro. The first version of the profiler was built for a computer vision study on automated waste classification; that paper is linked above.
