const express = require('express');
const Report = require("../models/report");

const router = express.Router();

// handle incoming post requests
router.post("", (req, res, next) => {
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

router.delete("/:id", (req, res, next) => {
  Report.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: "Report deleted!"});
  })
});

router.put("/:id", (req, res, next) => {
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
