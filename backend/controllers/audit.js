const Audit = require("../models/audit");

exports.logChange = (req, res, next) => {
    const audit = new Audit({
      changeSummary: req.body.changeSummary,
      userId: req.body.userId,
      date: req.body.date
    })
    audit.save().then(result => {
      res.status(201).json({
        message: 'User created!', result: result
      });
    })
      .catch(err => {
        res.status(500).json({
          error: "Invalid authentication credentials!"
        });
      })  ;
}


