const { Kafka } = require('kafkajs')
const conf = require('../../configuration.json');



exports.run = async (message) => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [conf.kafka.kafkaHost]
  })
  const producer = kafka.producer();
  // Producing
  await producer.connect()
  await producer.send({
    topic: 'failureMessage',
    messages: [
      { value: JSON.stringify(message) },
    ],
  })
}


