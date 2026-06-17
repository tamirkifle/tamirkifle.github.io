# Testing Distributed Consistency: Jepsen-Style Validation

Building a distributed key-value store is one thing. *Proving* it works correctly under failure conditions is another thing entirely. This post covers how I designed and validated a distributed KV store using techniques inspired by the Jepsen testing framework.

## The System Under Test

The distributed KV store is a 5-node cluster with the following properties:

- **Quorum-based replication**: reads and writes require agreement from a configurable number of nodes
- **Vector clocks**: for tracking causal ordering between concurrent updates
- **Tunable consistency**: operators can choose between strong consistency (majority quorum) and eventual consistency (single-node reads)

## Why Consistency Testing Matters

Consider this scenario: Node A accepts a write `SET key=42`. Before the write replicates, a network partition isolates Node A. A client reads from Node B and gets an old value — or worse, no value at all. Is this a bug, or expected behavior?

The answer depends on your consistency model. And the only way to verify you're actually implementing the model you claim is to test it under adversarial conditions.

## Designing the Test Harness

Inspired by Kyle Kingsbury's [Jepsen](https://jepsen.io/) framework, I built a test harness with three components:

1. **Workload Generator**: Produces concurrent read/write operations from multiple client threads
2. **Fault Injector**: Simulates network partitions, node crashes, and message delays
3. **Consistency Checker**: Analyzes the operation history to detect violations

```java
public class PartitionSimulator {
    private final Set<Pair<Integer, Integer>> blockedPairs = new HashSet<>();

    public void isolateNode(int nodeId) {
        for (int other = 0; other < clusterSize; other++) {
            if (other != nodeId) {
                blockedPairs.add(Pair.of(nodeId, other));
                blockedPairs.add(Pair.of(other, nodeId));
            }
        }
    }

    public boolean canCommunicate(int from, int to) {
        return !blockedPairs.contains(Pair.of(from, to));
    }
}
```

## The Linearizability Checker

For strong consistency mode, every operation should be linearizable — meaning there exists some total order of operations consistent with real time and each operation's return value.

I implemented a brute-force linearizability checker that explores all possible orderings of concurrent operations:

1. Build a directed graph of operations based on real-time ordering
2. For each topological sort of the graph, simulate execution
3. If any ordering produces the observed results, the history is linearizable

## What We Found

Running the test suite uncovered two subtle bugs:

1. **Split-brain during symmetric partitions**: When the cluster split into two groups of 2 and 3, the 2-node group could briefly accept writes if it hadn't yet detected the partition
2. **Stale reads after partition healing**: When a partition healed, nodes didn't immediately sync, leading to a window where stale reads could occur

Both bugs were fixed by tightening the leader election protocol and adding a sync phase after partition recovery.

## Lessons Learned

- **Distributed systems bugs are nondeterministic** — you need to run hundreds of test iterations to catch them
- **The hardest bugs happen at boundaries** — partition formation, partition healing, leader changes
- **Vector clocks are necessary but not sufficient** — they track causality, but you still need protocols to *act* on that information correctly

The full implementation is on [GitHub](https://github.com/tamirkifle/distributed-kv-database).
