
const soap = require("soap");
const CleanReportService = require('./service/cleanReports');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const conf = require('../configuration.json');
const reportRoutes = require("./routes/report");
const userRoutes = require("./routes/user");
const companyRoutes = require('./routes/company')
// the function returns us an express app
const app = express();

// create uri to database from configuration file
const mongoUri = "mongodb://" + conf.database.username + ":" + conf.database.password
                              + "@" + conf.host.ip + "/" + conf.database.name
                              + "?" + conf.database.params;

// connect to database
mongoose.connect(mongoUri).then(() => {
  console.log("connecting to database was successfull")
})
  .catch((e) => {
    console.log("connection failed due to:");
    console.log(e.toString());
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


// Web socket
let WSServer = require('ws').Server;
let server = require('http').createServer();

// Create web socket server on top of a regular http server
let wss = new WSServer({
  server: server
});

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {

    console.log(`received: ${message}`);

    ws.send(JSON.stringify({
      id: 'ti',
      title: 'answer',
      status: 't',
      type: 't',
      user_id : 't'
    }));
  });
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


