const amqp = require('amqplib');

require('dotenv').config();
const username = process.env.RABBIT_USER;
const password = process.env.RABBIT_PASS;
const host = process.env.RABBITMQ_HOST || 'localhost';

const startProcess = async() => {
  const connection = await amqp.connect(`amqp://${username}:${password}@${host}`);
  const channel = await connection.createChannel();

  const key1 = 'inspections.inspection';
  const key2 = 'inspections.mount';

  const msg1 = {
    type: 'inspection',
    id: 1,
    name: 'Inspection 1',
  };

  const msg2 = {
    type: 'mount',
    id: 2,
    name: 'Inspection type mount',
  };

  const exchange = "inspections";

  await channel.assertExchange(exchange, 'topic', { durable: false });

  channel.publish(exchange, key1, Buffer.from(JSON.stringify(msg1)));
  channel.publish(exchange, key2, Buffer.from(JSON.stringify(msg2)));

};

startProcess();