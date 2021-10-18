const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// work with Report schema
const Report = require('./models/report');
const conf = require('../configuration.json');

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

// handle incoming post requests
app.post("/api/reports", (req, res, next) => {
  const report = new Report({
    title: req.body.title,
    rating: req.body.rating,
    comment: req.body.comment
  });
  // write query is automatically created by mongoose using save() function on the mongoose model
  // collection name will be "reports" because the model's name is report
  report.save().then(createdReport => {
    // everything was okay, a resource was created
    res.status(201).json({
      message: "Post added successfully",
      // get id for resource that was set by mongodb
      reportId: createdReport._id
    });
  });
})

app.get("/api/reports", (req, res, next) => {
  Report.find().then(documents => {
    // we need to execute the response code here, because the find() is an asynchronous call
    // only then we can rely on the documents being fetched already
    res.status(200).json({
      message: "reports fetched successfully",
      reports: documents
    })
  }).catch(err => {
    console.log(err);
  });
});

app.delete("/api/reports/:id", (req, res, next) => {
  Report.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: "Report deleted!"});
  })
});

app.put("api/reports/:id", (req, res, next) => {
  const report = new Report( {
    _id: req.body.id,
    title: req.body.title,
    rating: req.body.rating,
    companyName: req.body.companyName,
    reporterId: req.body.reporterId,
    date: req.body.date,
    comment: req.body.comment
  });
  Report.updateOne({_id: req.params.id}, report).then(result => {
    console.log(result);
    res.status(200).json({message: "Update successful"});
  });
});

module.exports = app;
