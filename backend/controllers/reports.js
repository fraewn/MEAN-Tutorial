const Report = require("../models/report");

exports.createReport =  (req, res, next) => {
    const report = new Report({
      title: req.body.title,
      rating: req.body.rating,
      comment: req.body.comment,
      creator: req.userData.userId
    });
    // write query is automatically created by mongoose using save() function on the mongoose model
    // collection name will be "reports" because the model's name is report
    report.save().then(createdReport => {
      console.log(createdReport);
      // everything was okay, a resource was created
      res.status(201).json({
        message: "Post added successfully",
        // get id for resource that was set by mongodb
        reportId: createdReport._id
      });
    }).catch(error => {
      res.status(500).json({
        message: "Report creation failed! Please try again. "
      })
    });
}

exports.getAllReports = (req, res, next) => {
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
    res.status(500).json({
      message: "Fetching reports failed."
    });
  });
}

exports.getReport = (req, res, next) => {
  Report.findById(req.params.id).then(report => {
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: "Report not found!" });
    }
  }).catch(err => {
    res.status(500).json({
      message: "Failed to fetch the requested report."
    });
  });
}

exports.deleteReport =  (req, res, next) => {
  Report.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if(result.deletedCount > 0) {
      res.status(200).json({message: "Report deleted."});
    }
    else {
      res.status(401).json({message: "Not authorized to delete the report!"});
    }
  }).catch(err => {
    res.status(500).json({
      message: "Report deletion failed due to an internal error. Please try again later."
    });
  });
}

exports.updateReport =  (req, res, next) => {
    const report = new Report( {
      _id: req.body.id,
      title: req.body.title,
      rating: req.body.rating,
      companyName: req.body.companyName,
      reporterId: req.body.reporterId,
      date: req.body.date,
      comment: req.body.comment,
      creator: req.userData.userId
    });
    // the check auth middleware is executed before this method
    // therefore we have the decoded token containing the userId of the user trying to update a report
    // now we only update the report, if this userId matches the one of the creator property, which was originally set when the report was created via POST
    Report.updateOne({ _id: req.params.id, creator: req.userData.userId }, report).then(result => {
      // in the result we get from the update operation in mongodb, we check the property matchedCount which indicates how many reports could be matched
      if(result.matchedCount > 0) {
        res.status(200).json({message: "Update successful!"});
      }
      else {
        res.status(401).json({message: "Not authorized to update the report!"});
      }
    }).catch(error => {
      res.status(500).json({message: "Couldn't update report due to an internal error. Please try again later. "})
    });
}

const { roles } = require('../roles/roles');

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.userData.role)[action](resource);

      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action!"
        });
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

exports.deleteReportBatch = () => {
  d = new Date();
  expiresAfter = new Date(d.setDate(d.getDate() - 1825));
  let result = new Date() + "+++ Cron job was not executed +++";
  Report.deleteMany({ date : {"$lte" : expiresAfter } }).then(result => {
    if(result.deletedCount > 0) {
      result =  result.deletedCount + " Reports deleted in automatic cron job.";
    }
    else {
      result = new Date() + " +++ No older reports than five years! No report got deleted during automatic cron job. +++";
    }
    console.log(result);
  }).catch(err => {
    console.log(err);
    result = new Date() + "+++ Batch report deletion during automatic cron job failed due to an internal error. Please try again later. +++";
    console.log(result);
  });
}
