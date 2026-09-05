InferRS is an inference engine I’m building in Rust. The code covers the pieces between a model file and a generated token: loading GGUF weights, tensor operations, attention, KV caching, and sampling.

Much of the work sits close to memory and computation. How the weights are represented changes what fits in cache; the shape of an operation changes which matrix kernel is useful. Quantization and SIMD kernels are part of that work.

The engine is still in development. Full Llama-7B generation is unfinished. The notes below describe the implemented components and the measurements so far.
