## What it does

LedgerKV is a distributed key-value store with two replication modes: Raft for strong consistency and leaderless quorum replication for a different availability tradeoff. Both use the same LSM storage engine, with a write-ahead log, Bloom filters, and compaction.

Keeping storage shared makes the replication behavior the central comparison. The project also includes cluster monitoring and a bounded, Jepsen-style linearizability checker.

## The useful result was a counterexample

In the tested histories, the checker found a concrete linearizability violation on the quorum path. It found no counterexample on the Raft path.

Those statements have different strength: a counterexample demonstrates a violation, while a passing bounded check does not prove correctness for every execution. The distinction is part of the result.

## A five-node run

One recorded cluster run completed 69,140 operations at roughly 210 operations per second, with no failed operations. One node was down for 90 seconds during the run. Steady-state latency was 2 ms at the median and 15 ms at p99.

These are observations from one run on one cluster. They are not a capacity ceiling or a general fault-tolerance guarantee.

## The implementation

- Shared LSM storage with write-ahead logging, Bloom filters, and compaction.
- Raft and leaderless quorum replication over gRPC.
- Kubernetes deployment and Prometheus/Grafana monitoring.
- A bounded linearizability checker for recorded histories.

## Source

[Browse the database, checker, and deployment configuration on GitHub](https://github.com/tamirkifle/distributed-kv-database).
