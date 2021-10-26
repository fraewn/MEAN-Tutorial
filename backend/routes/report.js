const express = require('express');
const Report = require("../models/report");

// auth middleware to protect the non public routes
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// handle incoming post requests
router.post("", checkAuth, (req, res, next) => {
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

router.get("", (req, res, next) => {
  // if you extract the query parameters from req they are always in string format
  // therefore we need to cast by writing a + in front of them
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const reportQuery = Report.find();
  let fetchedReports;
  // only execute block if pageSize and currentPage parameters are set at all in query
  // example query for get request: http://localhost/3000/api/reports?pagesize=2&page=1
  if(pageSize && currentPage){
    // if you are on page 2 (currentPage) and you can see 10 elements per page (pagesize)
    // you want to skip the first 10 elements in the database (so you want to display element 11-20)
    // therefore you need to skip the first 10 * (2-1) = 10 elements
    reportQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  reportQuery.then(documents => {
    fetchedReports = documents;
    // we need to execute the response code here, because the find() is an asynchronous call
    // only then we can rely on the documents being fetched already
    return Report.count();
  }).then(count => {
    res.status(200).json({
      message: "Reports fetched successfully!",
      reports: fetchedReports,
      maxReports: count
    });
  }).catch(err => {
    console.log(err);
  });
});

router.get("/:id", (req, res, next) => {
  Report.findById(req.params.id).then(report => {
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Report.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: "Report deleted!"});
  })
});

router.put("/:id", checkAuth, (req, res, next) => {
  const report = new Report( {
    _id: req.body.id,
    title: req.body.title,
    rating: req.body.rating,
    companyName: req.body.companyName,
    reporterId: req.body.reporterId,
    date: req.body.date,
    comment: req.body.comment
  });
  Report.updateOne({ _id: req.params.id }, report).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});

module.exports = router;
