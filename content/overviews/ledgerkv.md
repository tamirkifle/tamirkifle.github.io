LedgerKV is a distributed key-value store with two replication paths: Raft and leaderless quorum. They share an LSM storage engine, so the replication model can change without replacing the storage underneath it.

LedgerKV includes write-ahead logging, Bloom filters, compaction, cluster monitoring, and a bounded linearizability checker. The checker makes it possible to look for concrete consistency violations in recorded histories.

The notes cover the implementation and what happened in the tested runs, including the difference between finding a violation and finding no counterexample.
