const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// work with Report schema
const Report = require('./models/report');
const conf = require('../configuration.json');
const reportRoutes = require("./routes/report");
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
    "Origin, X-Requested-With, Content-Type, Accept");
  // allow these methods:
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

// filter for all request going to /api/reports and use the reportRoutes module for that
app.use("/api/reports", reportRoutes);

module.exports = app;
