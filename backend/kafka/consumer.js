const conf = require('../../configuration.json');
let failureMessages = [];

exports.run = (kafka, consumer, callback) => {
  console.log("0  " + failureMessages.length);

  consumer.run({
    eachMessage: ({topic, partition, message}) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      const obj = {
        part: partition,
        off: message.offset,
        val: JSON.parse(message.value.toString())
      }
      callback(obj);
    }
  });
}


