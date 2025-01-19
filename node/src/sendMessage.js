const { Worker } = require('worker_threads');
const path = require('path');

const {
  rabbitConnPromise,
  createChannelPromises,
} = require('./connection/connect');

const {
  createQueue,
  sendToQue,
  receiveMessage,
} = require('./utils/ampq');

const startProcess = async() => {
  const rabbitConn = await rabbitConnPromise;

  const {
    writeChannelPromise,
  } = createChannelPromises(rabbitConn);

  const writeChannel = await writeChannelPromise;
  const queue = "rue_queue";

  await createQueue({
    channel: writeChannel,
    queue,
    params: {
      durable: true,
    },
  });

  for (let i = 0; i < 5; i++) {
    await sendToQue({
      channel: writeChannel,
      queue,
      message: JSON.stringify({ message: `Hello, RabbitMQ! Message ${i + 1}` }),
      options: {
        persistent: true,
      },
    });
  }

};

startProcess();
