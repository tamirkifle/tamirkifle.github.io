# Building an LLM Inference Engine in Pure Rust

Large language models are typically served through Python-based frameworks like vLLM or llama.cpp's server mode. But what if you wanted to understand every single layer of inference — from parsing the model file to generating tokens? That's exactly what I set out to do.

## Why Rust?

Rust gives you three things that matter enormously for inference: zero-cost abstractions, manual memory control, and safe concurrency. When you're dealing with multi-gigabyte model weights and need to squeeze every cycle out of matrix multiplications, these properties aren't nice-to-haves — they're essential.

## The GGUF Parser

The first step was building a parser for the GGUF format, which is how quantized model weights are distributed. GGUF is a binary format with a header, metadata key-value pairs, and tensor data.

```rust
pub struct GGUFFile {
    pub header: GGUFHeader,
    pub metadata: HashMap<String, MetadataValue>,
    pub tensors: Vec<TensorInfo>,
    pub mmap: Mmap,
}
```

I used memory-mapped I/O (`mmap`) to avoid loading the entire model into RAM at once. This was critical — a 7B parameter model in Q4_0 format is still ~4GB.

## The Transformer Forward Pass

Implementing the transformer forward pass meant building each component by hand:

1. **RMS Normalization** — simpler than LayerNorm, just variance normalization
2. **Rotary Position Embeddings (RoPE)** — encoding position information into the attention mechanism
3. **Grouped Query Attention** — the attention mechanism used by Llama models
4. **SwiGLU Feed-Forward Network** — the MLP layers between attention blocks
5. **KV-Cache** — caching key/value projections for efficient autoregressive generation

## INT8 Quantization

The biggest performance win came from INT8 per-channel quantization. Instead of using full FP32 for matrix multiplications, I quantized weights to 8-bit integers with per-channel scale factors:

```rust
pub fn quantize_per_channel(weights: &[f32], channels: usize) -> QuantizedTensor {
    let channel_size = weights.len() / channels;
    let mut scales = Vec::with_capacity(channels);
    let mut quantized = Vec::with_capacity(weights.len());

    for ch in 0..channels {
        let start = ch * channel_size;
        let end = start + channel_size;
        let max_abs = weights[start..end]
            .iter()
            .map(|x| x.abs())
            .fold(0.0f32, f32::max);
        let scale = max_abs / 127.0;
        scales.push(scale);

        for &w in &weights[start..end] {
            quantized.push((w / scale).round() as i8);
        }
    }

    QuantizedTensor { data: quantized, scales }
}
```

## SIMD Kernels

The final optimization layer was hand-written SIMD kernels. On ARM (Apple Silicon), I used NEON intrinsics; on x86, AVX2:

- **INT8 dot product**: Process 16 elements per iteration using `vdotq_s32` on NEON
- **Vectorized softmax**: Parallel `exp` approximation across SIMD lanes
- **Memory prefetching**: Hint the CPU to preload cache lines ahead of computation

The combined effect: a **21× decode speedup** compared to the naive FP32 implementation, with a **4× memory reduction** from quantization.

## 873 Tests and Counting

One thing I'm particularly proud of is the test suite. Every component has unit tests, integration tests, and golden-file tests comparing output against reference implementations. When you're working at this low a level, a single off-by-one error in a matrix index can produce subtly wrong text that *looks* reasonable but is actually garbage.

## What I Learned

Building an inference engine from scratch gave me a deep appreciation for the engineering that goes into systems like vLLM. It also reinforced a belief I've held for a while: **you understand something best when you build it yourself**.

The code is open source — check it out on [GitHub](https://github.com/tamirkifle/mini-rust-inference).
