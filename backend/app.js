

const soap = require("soap");
const CleanReportService = require('./service/cleanReports');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const conf = require('../configuration.json');
const reportRoutes = require("./routes/report");
const userRoutes = require("./routes/user");
const companyRoutes = require('./routes/company')
const kafkaProducer = require('./kafka/producer');
const kafkaConsumer = require('./kafka/consumer');
// the function returns us an express app
const app = express();

// single mongo instance
const single = "mongodb://"
                + conf.database_single.username + ":" + conf.database_single.password + "@"
                + conf.host_single.ip + ":" + conf.host_single.port + ","
                + "/" + conf.database_single.name
                + "?" + conf.database_single.params;

// replica set mongo instance
const replicaSet = "mongodb://"
                + conf.database_replicaset.username + ":" + conf.database_replicaset.password + "@"
                + conf.host_replicaset.ip + ":" + conf.host_replicaset.port1 + ","
                + conf.host_replicaset.ip + ":" + conf.host_replicaset.port2 + ","
                + conf.host_replicaset.ip + ":" + conf.host_replicaset.port3
                + "/" + conf.database_replicaset.name
                + "?" + conf.database_replicaset.params;

// connect to database
mongoose.connect(replicaSet, {
  serverSelectionTimeoutMS: 5000,
  useNewUrlParser : true,
  replicaSet      : 'rs0'
  }).then(() => {
  console.log("Connecting to " + replicaSet + " was successful!")
  })
  .catch((e) => {
    console.log("Connecting to " + replicaSet + " failed due to:");
    console.log(e.reason);
  });

// helps us with parsing incoming data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// a middleware to disable cors
// always executed when the app is used (could be filtered for a specific path via an additional first parameter too)
app.use((req, res, next) => {
  //manipulate the header of the response
  // * : no matter on which domain this response is coming from on this server: disable cors
  res.setHeader("Access-Control-Allow-Origin", "*");
  // the incoming requests may have these headers:
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  // allow these methods:
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

// filter for all request going to /api/reports and use the reportRoutes module for that
app.use("/api/reports", reportRoutes);
app.use("/api/user", userRoutes);
app.use("/api/companies", companyRoutes);

module.exports = app;
// Kafka
const { Kafka } = require('kafkajs')
const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: [conf.kafka.kafkaHost]
})

const consumer = kafka.consumer({groupId: 'consumer-group'});
consumer.connect();
consumer.subscribe({ topic: conf.kafka.topic, fromBeginning: true });

// Web socket
const WSServer = require('ws').Server;
const server = require('http').createServer();

// Create web socket server on top of a regular http server
let wss = new WSServer({
  server: server
});

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws) {
   ws.on('message', function incoming(message) {
    console.log(`Web Socket: received message: ${message}`);
    kafkaProducer.run(JSON.parse(message)).catch(err => console.log(err));
    console.log("Kafka: Message produced");
    kafkaConsumer.run(kafka, consumer, sending);
  });
  function sending(obj) {
    console.log("Web Socket: answer (consumed from Kafka Queue):");
    console.log(obj.val);
    ws.send(JSON.stringify({
      id: obj.val.id,
      title: obj.val.title,
      status: obj.val.status,
      type: obj.val.type,
      user_id: obj.val.user_id
    }));
    consumer.disconnect(); 
  }
});



server.listen('3001', function() {
  console.log(`http/ws server listening on 3001`);
});



















// SOAP
const CompanyController = require("./soap/controller/company");
function addCompany_function(args){
  let result = "res: ";
  result = CompanyController.createReport(args, result)
  return {
    result: result
  }
}

// the service
let serviceObject = {
  CompanyService: {
    CompanyServiceSoapPort: {
      Company: addCompany_function
    },
    CompanyServiceSoap12Port: {
      Company: addCompany_function
    }
  }
};

let xml = require('fs').readFileSync('companyService.wsdl', 'utf8');

// root handler
app.get('/', function (req, res) {
  res.send('Node Soap Example!<br /><a href="https://github.com/macogala/node-soap-example#readme">Git README</a>');
})

// Launch the server and listen
const port = 8000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
  const wsdl_path = "/wsdl";
  soap.listen(app, wsdl_path, serviceObject, xml);
  console.log("Check http://localhost:" + port + wsdl_path +"?wsdl to see if the service is working");
});

CleanReportService.cleanReportCronJob();


