const amqp = require('amqplib');
require('dotenv').config();
const username = process.env.RABBIT_USER;
const password = process.env.RABBIT_PASS;
const host = process.env.RABBITMQ_HOST || 'localhost';

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(`amqp://${username}:${password}@${host}`);
    console.log('Connected to RabbitMQ');
    return connection;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    throw error;
  }
}

const createChannelPromises = (connection) => {
  let readChannelPromise = connection.createChannel();
  let writeChannelPromise = connection.createChannel();
  return { readChannelPromise, writeChannelPromise };
}

rabbitConnPromise = connectRabbitMQ();

module.exports = {
  rabbitConnPromise,
  createChannelPromises,
};
