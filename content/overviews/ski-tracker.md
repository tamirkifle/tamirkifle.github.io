This project ingests ski lift-ride events through RabbitMQ and stores them in DynamoDB, with Redis-cached reads. It is also a place to examine what happens when the rate of incoming work gets ahead of the work a system can finish.

The pipeline uses a shared admission limit across replicas, queue-aware load shedding, and write batching. Those mechanisms address different parts of the same path: admitting an event, holding it in a queue, and writing it to storage.

The notes keep the earlier cloud run separate from the later experiments using LocalStack. They look at rate control and write counts without treating them as interchangeable throughput results.
