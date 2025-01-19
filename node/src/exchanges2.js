const workerName = process.argv[2] || 'worker';

const {
  rabbitConnPromise,
  createChannelPromises,
} = require('./connection/connect');

const {
  receiveFromExchange,
  createQueue,
} = require('./utils/ampq');

(async() => {
  const rabbitConn = await rabbitConnPromise;

  const {
    readChannelPromise,
  } = createChannelPromises(rabbitConn);

  const channel = await readChannelPromise;
  const exchange = "inspections";
  const queue = "all_inspections_types";
  const key = 'inspections.*';

  await createQueue({
    channel,
    queue,
    params: {
      durable: true,
    },
  });

  await channel.assertExchange(exchange, 'fanout', { durable: false });

  receiveFromExchange({
    channel,
    exchange,
    queue,
    key,
    callback: (msg) => {
      console.log(`Received message from exchange ${exchange} with key ${msg.fields.routingKey}: ${msg.content.toString()}`);
  }});

})();