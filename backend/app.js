const express = require('express');
const bodyParser = require('body-parser');

// the function returns us an express app
const app = express();

// helps us with parsing incoming data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// cors disabling middleware
app.use((req, res, next) => {
  //manipulate the header of the response
  // * : no matter on which domain this response is coming from on this server: disable cors
  res.setHeader("Access-Control-Allow-Origin", "*");
  // the incoming requests may have these headers:
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // allow these methods:
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});


// this is called a middleware
// code that can be executed upon a request
// filter by path with an additional parameter
app.use("/api/reports", (req, res, next) => {
  // with next we jump to the second middleware
  const reports = [
    {
      id:"akajsdn42",
      title: "persisted report mock",
      companyName: "the boring company",
      reporterId: "1",
      rating: "10",
      date: new Date(),
      comment: "no comments ahahaha"
    },
    {
      id:"a45789jhf",
      title: "second persisted report mock",
      companyName: "spacex",
      reporterId: "2",
      rating: "9",
      date: new Date(),
      comment: "inspiration 4 is nice"
    }
  ];
  res.status(200).json({
    message: 'Reports fetched successfully',
    reports: reports
  });
});

// handle incoming post requests
app.post("/api/reports", (req, res, next) => {
  const report = req.body;
  console.log(report);
  // everything was okay, a resource was created
  res.status(201).json({
    message: "report added successfully"
  });
})

module.exports = app;
