const amqp = require('amqplib');
require('dotenv').config();
const username = process.env.RABBIT_USER;
const password = process.env.RABBIT_PASS;
const host = process.env.RABBITMQ_HOST || 'localhost';

const callback = (consumer) => (msg) => {
  msg.ack();
  console.log(`Received message in ${consumer} with key ${msg.fields.routingKey}: ${msg.content.toString()}`);
};

(async() => {
  const connection = await amqp.connect(`amqp://${username}:${password}@${host}`);
  const channel = await connection.createChannel();

  const queueParams = {
    durable: true,
  };
  const exchange = "inspections";
  const queue1 = "inspections_queue";
  const queue2 = "all_inspections_types";

  /**
   * Create Queue if it does not exist already
   */
  await channel.assertQueue(queue1, { params: queueParams });
  await channel.assertQueue(queue2, { params: queueParams });

  /**
   * Create Exchange if it does not exist already
   */
  await channel.assertExchange(exchange, 'topic', { durable: false });

  /**
   * Bind queue to exchange with routing key
   */
  const key1 = 'inspections.mount';
  const key2 = 'inspections.*';
  await channel.bindQueue(queue1, exchange, key1);
  await channel.bindQueue(queue2, exchange, key2);

  /**
   * Consume messages from queues
   */
  await channel.consume(queue1, callback('consumer 1'), { noAck: false });
  await channel.consume(queue2, callback('consumer 2'), { noAck: false });

})();