const { Kafka } = require('kafkajs')
const conf = require('../../configuration.json');
const websocket = require('../websocket/websocket');

exports.run = async () => {
  const kafka = new Kafka({
    clientId: 'my-consumer',
    brokers: [conf.kafka.kafkaHost]
  })

  const consumer = kafka.consumer({groupId: 'consumer-group'});

  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: conf.kafka.topic, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      // access the message with JSONparse()
      // send back to frontend
    }
  })


}


