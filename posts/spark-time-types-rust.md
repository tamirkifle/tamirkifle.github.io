# Implementing Spark 4.1 TIME Types in Rust

When I joined LakeSail as an intern, one of my first projects was implementing the Spark 4.1.1 TIME data type in their Rust-based execution engine. This meant achieving 100% functional parity with the Apache Spark 4.0 specification — including all temporal functions, edge cases, and cross-timezone behavior.

## What is the TIME Type?

The TIME type represents a time-of-day without a date component. Think `14:30:00` rather than `2026-01-15 14:30:00`. While this sounds simple, the spec is surprisingly complex:

- Precision up to microseconds
- Time zone awareness for conversions
- Arithmetic operations (adding intervals, computing differences)
- Casting to and from strings, timestamps, and other temporal types

## The Challenge: 46 Failing Gold-Data Tests

LakeSail runs a comprehensive test suite that compares output against Apache Spark's reference implementation. When I started, 46 tests related to TIME operations were failing. Each failure represented a gap between our Rust implementation and Spark's behavior.

## Implementation Approach

I structured the implementation in layers:

### 1. Core TIME Representation

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct TimeValue {
    /// Microseconds since midnight (0 to 86_399_999_999)
    micros: i64,
}

impl TimeValue {
    pub fn new(hour: u8, minute: u8, second: u8, micro: u32) -> Result<Self> {
        if hour > 23 || minute > 59 || second > 59 || micro > 999_999 {
            return Err(SparkError::InvalidTime);
        }
        let micros = (hour as i64) * 3_600_000_000
            + (minute as i64) * 60_000_000
            + (second as i64) * 1_000_000
            + micro as i64;
        Ok(Self { micros })
    }
}
```

### 2. Temporal Functions

I implemented 15+ temporal functions including `HOUR()`, `MINUTE()`, `SECOND()`, `MAKE_TIME()`, and the tricky `DATE_DIFF()` variants that involve TIME components.

### 3. String Parsing and Formatting

The most edge-case-heavy part. Spark accepts numerous time string formats:
- `14:30:00`
- `2:30 PM`
- `14:30:00.123456`
- Various locale-specific formats

## The Arrow-Native UDF Framework

Beyond TIME types, I also built an Arrow-native PySpark UDF framework for vectorized execution. The key innovation was zero-copy data transfer between Rust and Python:

Instead of serializing data row-by-row (the traditional PySpark approach), we pass Arrow record batches directly through shared memory. This eliminated serialization overhead entirely and achieved a **15× throughput speedup** compared to standard PySpark UDFs.

## Key Takeaways

1. **Specification compliance is harder than implementation** — getting the logic right took 30% of the time; matching every edge case in the spec took 70%
2. **Gold-data tests are invaluable** — having reference output from the canonical implementation made debugging much faster
3. **Zero-copy is transformative** — the performance difference between serialized and zero-copy data transfer is not incremental; it's a paradigm shift

Working on a production Spark engine in Rust was an incredible learning experience. It showed me how the interplay between language design (Rust's ownership model) and system design (Arrow's columnar format) can produce something far greater than the sum of its parts.
