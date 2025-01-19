const workerName = process.argv[2] || 'worker';

const {
  rabbitConnPromise,
  createChannelPromises,
} = require('./connection/connect');

const {
  createQueue,
  receiveMessage,
} = require('./utils/ampq');

(async() => {
  const rabbitConn = await rabbitConnPromise;

  const {
    readChannelPromise,
  } = createChannelPromises(rabbitConn);

  const readChannel = await readChannelPromise;
  const queue = "rue_queue";

  await createQueue({
    channel: readChannel,
    queue,
    params: {
      durable: true,
    },
  });

  receiveMessage({
    channel: readChannel,
    queue,
    callback: (msg) => {
      console.log(`${workerName}:`, msg.content.toString());
    }
  });

})();