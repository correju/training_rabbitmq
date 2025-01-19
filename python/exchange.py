import asyncio
import os
import aio_pika

username = os.getenv('RABBIT_USER')
password = os.getenv('RABBIT_PASS')
host = os.getenv('RABBITMQ_HOST', 'localhost')

async def callback(consumer, message: aio_pika.IncomingMessage):
  async with message.process():
    print(f"Received message in {consumer} with key {message.routing_key}: {message.body.decode()}")

async def main():
  connection = await aio_pika.connect_robust(f"amqp://{username}:{password}@{host}/")
  channel = await connection.channel()

  queue_params = {
    'durable': True,
  }
  exchange_name = "inspections"
  queue1_name = "inspections_queue"
  queue2_name = "all_inspections_types"
  key1 = 'inspections.mount'
  key2 = 'inspections.*'

  queue1 = await channel.declare_queue(queue1_name, **queue_params)
  queue2 = await channel.declare_queue(queue2_name, **queue_params)

  exchange = await channel.declare_exchange(exchange_name, aio_pika.ExchangeType.TOPIC, durable=False)

  await queue1.bind(exchange, routing_key=key1)
  await queue2.bind(exchange, routing_key=key2)

  await queue1.consume(lambda message: callback('consumer 1', message))
  await queue2.consume(lambda message: callback('consumer 2', message))

  print(" [*] Waiting for messages. To exit press CTRL+C")
  await asyncio.Future()  # Run forever

if __name__ == "__main__":
  asyncio.run(main())