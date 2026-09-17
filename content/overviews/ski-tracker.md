Liftline ingests ski lift-ride events through RabbitMQ and stores them in DynamoDB, with Redis-cached reads. It is also a place to examine what happens when the rate of incoming work gets ahead of the work a system can finish.

The pipeline uses a shared admission limit across replicas, queue-aware load shedding, and write batching. Those mechanisms address different parts of the same path: admitting an event, holding it in a queue, and writing it to storage.

Every recorded run measures LocalStack on one laptop rather than real DynamoDB. The write counts reproduce under an arm swap and the times do not, so they are not read as interchangeable throughput results.
