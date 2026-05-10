import React from 'react';
import BlogImage from '../components/blog/BlogImage';

const KafkaSystemDesign: React.FC = () => {
  return (
    <>
      <p>
        Kafka is a distributed streaming platform that appears frequently in system design
        discussions. Understanding its architecture, trade-offs, and failure modes helps
        us make informed decisions about when and how to use it.
      </p>

      <BlogImage
        src="/images/blog/kafka.png"
        alt="Apache Kafka architecture"
      />

      <h2>What Kafka Is</h2>
      <p>
        Kafka is a distributed commit log. Producers append messages to topics, consumers
        read from topics, and messages are persisted to disk and replicated across brokers.
        We use Kafka when we need decoupling between services, buffering for traffic spikes,
        event sourcing, or streaming data pipelines.
      </p>

      <h2>Kafka Is a Log, Not a Message Queue</h2>
      <p>
        This distinction matters for understanding Kafka's behavior. Traditional message
        queues like RabbitMQ and SQS deliver messages to consumers and remove them. Kafka
        works differently—messages remain in the log at their offset until retention
        expires, regardless of whether anyone has read them.
      </p>
      <p>
        This design means Kafka has no built-in dead letter queue (DLQ). In SQS, after N
        failed delivery attempts, messages automatically move to a DLQ. Kafka cannot do
        this because it doesn't track delivery attempts. The broker doesn't know whether
        processing succeeded or failed.
      </p>
      <p>
        Kafka uses offset-based commits rather than per-message acknowledgments. We commit
        "I've processed up to offset 42", not "message X succeeded, message Y failed". The
        broker stores bytes while the consumer handles semantics. To implement a DLQ in
        Kafka, we catch failures in our consumer and publish to a separate dead letter
        topic. This gives us control over retry logic, failure categorization, and
        recovery strategies.
      </p>

      <h2>Core Concepts</h2>

      <h3>Topics and Partitions</h3>
      <p>
        A topic is a logical channel for messages. A partition is the unit of parallelism
        within a topic. Messages within a partition maintain their order, but messages
        across different partitions have no ordering guarantee.
      </p>
      <p>
        To guarantee ordering for related messages while maintaining parallelism, we
        partition by a key such as user_id. All messages with the same key go to the
        same partition, preserving order for that entity while allowing parallel
        processing across different entities.
      </p>

      <h3>Partition Assignment</h3>
      <p>
        When a producer sends a message with a key, Kafka determines the partition using
        a hash function: <code>partition = hash(key) % numPartitions</code>. Kafka uses
        murmur2 hash by default. The same key always goes to the same partition, as long
        as the partition count doesn't change.
      </p>
      <p>
        For messages without a key, Kafka uses sticky partitioning (default since Kafka
        2.4). The producer "sticks" to one partition until the batch is full or
        <code>linger.ms</code> expires, then switches to another partition. This improves
        batching efficiency compared to the older round-robin approach, which cycled
        through partitions one message at a time and created many small batches.
      </p>
      <p>
        On the consumer side, Kafka normally assigns partitions automatically through
        consumer group coordination. However, consumers can manually assign specific
        partitions using <code>assign()</code> instead of <code>subscribe()</code>. Manual
        assignment bypasses consumer group coordination—no automatic rebalancing, and we
        manage offsets and failover ourselves. This is useful when a specific consumer
        must handle specific partitions.
      </p>

      <h3>Consumer Groups</h3>
      <p>
        Consumers in the same group split partitions among themselves. Each partition is
        consumed by exactly one consumer in the group. With 4 partitions and 3 consumers,
        one consumer handles 2 partitions. With 4 partitions and 5 consumers, one consumer
        sits idle.
      </p>
      <p>
        This means consumer scaling is limited by partition count. We can only scale up to
        the number of partitions, so we should plan partition count based on expected peak
        throughput.
      </p>

      <h3>Offsets</h3>
      <p>
        An offset is the position of a message in a partition. Consumers track their offset
        to know where to resume after a restart. Offsets can be committed automatically or
        manually.
      </p>
      <p>
        By default, Kafka stores committed offsets in a special internal topic called
        <code>__consumer_offsets</code>. The broker manages this automatically. However,
        offset commits and message processing aren't atomic—we can process a message and
        crash before committing the offset.
      </p>
      <p>
        For stronger guarantees, we can store offsets ourselves in Redis, a database, or
        wherever our processing output goes. By writing the result and the offset in the
        same transaction, we get atomic "process + commit" semantics. On restart, we read
        our last offset from the external store and seek to it. This approach provides
        exactly-once semantics but adds complexity.
      </p>

      <h2>CAP Theorem and Kafka</h2>
      <p>
        Kafka is CP (Consistent + Partition Tolerant) by default. During a network
        partition, Kafka chooses consistency over availability—it won't accept writes
        if it can't guarantee replication.
      </p>
      <p>
        We can tune this behavior. Setting <code>acks=1</code> (leader only) makes Kafka
        more available but risks data loss. Setting <code>acks=all</code> with
        <code>min.insync.replicas=2</code> ensures durability but reduces availability.
      </p>

      <h3>The acks Setting</h3>
      <ul>
        <li><code>acks=0</code>: Fire and forget. Fastest option with no durability guarantee.</li>
        <li><code>acks=1</code>: Leader acknowledged. Fast, but data loss occurs if the leader dies before replication.</li>
        <li><code>acks=all</code>: All in-sync replicas acknowledged. Slowest option with strongest durability.</li>
      </ul>
      <p>
        For critical data like payments, we use <code>acks=all</code> with
        <code>min.insync.replicas=2</code>. For logs or metrics where some loss is
        acceptable, <code>acks=1</code> provides a reasonable trade-off.
      </p>

      <h2>Delivery Semantics</h2>

      <h3>At-Most-Once</h3>
      <p>
        Data is not duplicated, but data can be lost. We commit the offset before
        processing the message. If processing fails, we've already moved past it and
        the message is lost. This approach is fast but lossy, suitable for metrics,
        logs, or anything we can afford to lose.
      </p>

      <h3>At-Least-Once</h3>
      <p>
        Data is not lost, but data can be duplicated. We commit the offset after
        processing. If the consumer crashes after processing but before committing,
        the message gets reprocessed on restart. This requires idempotent consumers
        to handle duplicates and is the most common choice in practice.
      </p>

      <h3>Exactly-Once</h3>
      <p>
        Data is neither lost nor duplicated. Kafka achieves this using Producer IDs
        (PID) and sequence numbers (SN). Each producer receives a unique PID, and each
        message sent to a partition gets an incrementing sequence number. The broker
        tracks the last sequence number for each <code>&lt;PID, partition&gt;</code> pair.
      </p>
      <p>
        When a message arrives, the broker checks the sequence number. If it equals
        the expected value (last + 1), the broker accepts and writes it. If the
        sequence number is smaller than expected, the message is a duplicate from a
        retry and the broker ignores it. If the sequence number is larger than
        expected, something went wrong and the broker throws an OutOfOrderSequenceException.
      </p>
      <p>
        This mechanism requires <code>enable.idempotence=true</code>, which enforces
        <code>acks=all</code>. For end-to-end exactly-once that includes external
        systems, we need idempotent operations or distributed transactions.
      </p>

      <h2>Failure Modes</h2>

      <h3>Broker Failure</h3>
      <p>
        Kafka replicates partitions across brokers. When a broker dies, leadership
        transfers to a replica. Producers retry their requests and consumers rebalance.
        With a proper replication factor of 3 or higher, a single broker failure causes
        no data loss.
      </p>

      <h3>Consumer Failure</h3>
      <p>
        When a consumer fails, the consumer group rebalances. Partitions from the failed
        consumer are reassigned to remaining consumers. Some messages may be reprocessed
        depending on the commit strategy, which is why idempotency matters.
      </p>

      <h3>Producer Failure</h3>
      <p>
        If a producer crashes mid-send with <code>acks=0</code>, the message is lost.
        With <code>acks=1</code> or higher, the producer retries on timeout. Idempotent
        producers, available since Kafka 0.11, prevent duplicates from these retries.
      </p>

      <h3>Network Partition</h3>
      <p>
        If brokers can't communicate with the controller, affected partitions go offline.
        Kafka chooses consistency—it won't serve potentially stale reads or accept writes
        that can't be replicated.
      </p>

      <h3>Metadata Coordination</h3>
      <p>
        Older versions of Kafka used Zookeeper for metadata management. Zookeeper failure
        meant cluster metadata issues. KRaft mode, introduced in Kafka 2.8, removes the
        Zookeeper dependency by handling metadata within Kafka itself.
      </p>

      <h2>Trade-offs</h2>

      <h3>Throughput vs Latency</h3>
      <p>
        Kafka batches messages to achieve high throughput. Larger batches mean higher
        throughput but also higher latency. We tune <code>batch.size</code> and
        <code>linger.ms</code> to find the right balance. For low-latency requirements,
        we use smaller batches and accept lower throughput.
      </p>

      <h3>Durability vs Performance</h3>
      <p>
        Using <code>acks=all</code> with <code>min.insync.replicas=2</code> provides
        durability but is slower. Using <code>acks=1</code> is faster but risks data
        loss. We choose based on our requirements for each use case.
      </p>

      <h3>Ordering vs Parallelism</h3>
      <p>
        A single partition provides perfect ordering but no parallelism. Multiple
        partitions enable parallelism but only guarantee ordering within each partition.
        Partitioning by entity ID gives us both ordering for that entity and parallelism
        across entities.
      </p>

      <h3>Retention vs Storage</h3>
      <p>
        Longer retention enables replaying events but costs more storage. Typical
        retention is 7 days for events, with longer periods for event sourcing use
        cases. Tiered storage helps achieve cost-effective long retention.
      </p>

      <h2>Producer Tuning</h2>
      <p>
        Instead of sending messages one by one, the producer accumulates messages in
        a buffer (RecordAccumulator) organized by partition. A sender thread pulls
        batches from this buffer and sends them to brokers. This batching reduces
        network overhead and broker load.
      </p>

      <h3>Batching Configuration</h3>
      <p>
        Two settings control when batches are sent: <code>batch.size</code> (bytes)
        and <code>linger.ms</code> (time). A batch is sent when either limit is
        reached. Increase <code>batch.size</code> for higher throughput when latency
        is acceptable. Increase <code>linger.ms</code> to wait longer for fuller
        batches. Decrease both for lower latency at the cost of throughput.
      </p>

      <h3>In-Flight Requests</h3>
      <p>
        The setting <code>max.in.flight.requests.per.connection</code> controls how
        many batches can be sent without waiting for acknowledgment. The default is 5.
        Higher values increase throughput but can break ordering if a batch fails and
        retries while later batches succeed. Setting it to 1 guarantees ordering but
        reduces throughput.
      </p>

      <h3>Idempotent Producers</h3>
      <p>
        Enabling <code>enable.idempotence=true</code> allows Kafka to deduplicate
        retries using sequence numbers. This maintains ordering even with multiple
        in-flight requests. Idempotence requires <code>acks=all</code>,
        <code>max.in.flight.requests.per.connection &lt;= 5</code>, and
        <code>retries &gt; 0</code>. Kafka enforces these settings automatically
        when idempotence is enabled.
      </p>

      <h3>Producer Acknowledgments</h3>
      <p>
        The <code>acks</code> setting controls durability guarantees.
        With <code>acks=0</code>, the producer does not wait for acknowledgment,
        providing maximum throughput but risking data loss.
        With <code>acks=1</code>, the producer waits for the leader to acknowledge,
        balancing throughput and durability but risking loss if the leader fails
        before replication.
        With <code>acks=all</code>, the producer waits for all in-sync replicas to
        acknowledge, providing the strongest durability at the cost of latency.
      </p>

      <h2>Consumer Assignment Strategies</h2>
      <p>
        When consumers join a group, Kafka must decide which partitions each consumer
        handles. The assignment strategy determines this distribution.
      </p>
      <p>
        The Range strategy divides partitions into contiguous ranges. With 6 partitions
        and 2 consumers, consumer 1 gets partitions 0, 1, 2 and consumer 2 gets 3, 4, 5.
        This co-locates same-numbered partitions across topics but can be uneven with
        odd partition counts.
      </p>
      <p>
        The RoundRobin strategy distributes partitions one by one across consumers,
        providing even distribution but no co-location guarantees.
      </p>
      <p>
        The Sticky strategy works like RoundRobin but tries to preserve existing
        assignments during rebalancing, minimizing partition movement.
      </p>
      <p>
        The CooperativeSticky strategy adds incremental rebalancing. Instead of all
        consumers stopping during rebalance, only the partitions being moved pause.
        This improves availability during scaling events. CooperativeSticky is
        generally preferred for production workloads.
      </p>

      <h2>Scaling Considerations</h2>
      <p>
        Adding consumers is straightforward—new consumers join the group and receive
        partitions after a rebalance. However, scaling is limited by partition count.
        More consumers than partitions means idle consumers.
      </p>
      <p>
        Adding partitions is risky. The formula <code>hash(key) % partitionCount</code>
        produces different results with a new partition count. Messages for the same
        key will go to different partitions after the change, breaking ordering
        guarantees for existing keys. Old messages remain in old partitions while new
        messages go to potentially different partitions.
      </p>
      <p>
        Because partition count is difficult to change safely, we should over-provision
        partitions upfront based on expected peak throughput and consumer count.
      </p>

      <h2>Common Edge Cases</h2>

      <h3>Consumer Lag</h3>
      <p>
        Consumer lag occurs when consumers fall behind producers. Solutions include
        adding more consumers (up to the partition count), increasing consumer
        throughput, or accepting lag for batch processing workloads. Monitoring lag
        serves as an early warning system for capacity issues.
      </p>

      <h3>Poison Messages</h3>
      <p>
        A poison message crashes consumers repeatedly. The consumer restarts, processes
        the same message, and crashes again in an infinite loop. Solutions include
        implementing a dead letter queue, skipping messages after N retries, or fixing
        the underlying bug.
      </p>

      <h3>Rebalancing Storms</h3>
      <p>
        Consumer joins and leaves trigger rebalances. During a rebalance, consumption
        stops. Flaky consumers cause constant rebalancing, killing throughput. Solutions
        include increasing <code>session.timeout.ms</code>, using static membership, or
        fixing the flaky consumers.
      </p>

      <h3>Hot Partitions</h3>
      <p>
        Hot partitions occur when one partition receives significantly more traffic than
        others, usually due to a poor partition key choice. For example, partitioning by
        country when 80% of users are from one country creates a hot partition. The
        solution is choosing a better partition key or using a composite key.
      </p>

      <h3>Message Size</h3>
      <p>
        The default maximum message size is 1MB. Large messages hurt performance and
        memory usage. Solutions include compressing messages, storing payloads in S3 or
        blob storage and sending only a reference, or carefully increasing the limit.
      </p>

      <h2>When Not to Use Kafka</h2>
      <ul>
        <li>Low message volume: Kafka is overkill for fewer than 1000 messages per second. SQS or RabbitMQ are simpler alternatives.</li>
        <li>Request-response patterns: Kafka is asynchronous. HTTP or gRPC work better for synchronous communication.</li>
        <li>Strict ordering across all messages: This requires a single partition, creating a bottleneck. Consider redesigning the system.</li>
        <li>Small teams with simple needs: Kafka's operational complexity may not be worth it.</li>
      </ul>

      <h2>Configuration Reference</h2>
      <ul>
        <li>Replication factor: 3 (tolerates 1 broker failure)</li>
        <li>min.insync.replicas: 2 (with RF=3, ensures 1 failure tolerance)</li>
        <li>Partition count: Plan for 10-100x expected consumer count; difficult to change later</li>
        <li>Retention: 7 days default, tune based on replay requirements</li>
        <li>Consumer group: One per logical consumer application</li>
      </ul>
    </>
  );
};

export default KafkaSystemDesign;
