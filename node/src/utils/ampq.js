const createQueue = async ({channel, queue, params}) => {
  try {
    await channel.assertQueue(queue, params);
    console.log(`Queue ${queue} created`);
  } catch (error) {
    console.error(`Failed to create queue ${queue}`, error);
    throw error;
  }
};

const sendToQue = async ({channel, queue, message, options}) => {
  try {
    await channel.sendToQueue(queue, Buffer.from(message), options);
    console.log(`Message sent to queue ${queue}`);
  } catch (error) {
    console.error(`Failed to send message to queue ${queue}`, error);
    throw error;
  }
};

const receiveMessage = async ({channel, queue, callback}) => {
  try {
    await channel.consume(queue, callback, { noAck: true });
    console.log(`Consuming messages from queue ${queue}`);
  } catch (error) {
    console.error(`Failed to consume messages from queue ${queue}`, error);
    throw error;
  }
};

const receiveFromExchange = async ({channel, exchange, queue, key, callback}) => {
  try {
    await channel.bindQueue(queue, exchange, key);
    console.log(`Bound queue ${queue} to exchange ${exchange} with key ${key}`);
    await channel.consume(queue, callback, { noAck: true });
    console.log(`Consuming messages from exchange ${exchange} with key ${key}`);

  } catch (error) {
    console.error(`Failed to bind queue ${queue} to exchange ${exchange} with key ${key}`, error);
    throw error;
  }
};

module.exports = {
  createQueue,
  sendToQue,
  receiveMessage,
  receiveFromExchange
}