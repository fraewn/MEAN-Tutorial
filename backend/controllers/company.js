const Company = require("../models/company");
const { roles } = require('../roles/roles');

exports.createReport =  (req, res, next) => {
  const company = new Company({
    companyName: req.body.companyName,
    businessType: req.body.businessType,
    foundationDate: req.body.foundationDate,
    principalOfficeLocation: req.body.principalOfficeLocation,
    creator : req.userData.userId
  });
  // write query is automatically created by mongoose using save() function on the mongoose model
  // collection name will be "reports" because the model's name is report
  company.save().then(createdCompany => {
    // everything was okay, a resource was created
    res.status(201).json({
      message: "Company added successfully",
      // get id for resource that was set by mongodb
      reportId: createdCompany._id
    });
  }).catch(error => {
    res.status(500).json({
      message: "Company creation failed! Please try again. "
    })
  });
}

exports.getAllCompanies = (req, res, next) => {
  // if you extract the query parameters from req they are always in string format
  // therefore we need to cast by writing a + in front of them
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const companyQuery = Company.find();
  let fetchedCompanies;
  if(pageSize && currentPage){
    companyQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  companyQuery.then(documents => {
    fetchedCompanies = documents;
    // we need to execute the response code here, because the find() is an asynchronous call
    // only then we can rely on the documents being fetched already
    return Company.count();
  }).then(count => {
    res.status(200).json({
      message: "Companies fetched successfully!",
      companies: fetchedCompanies,
      maxCompanies: count
    });
    console.log(fetchedCompanies);
  }).catch(err => {
    res.status(500).json({
      message: "Fetching companies failed."
    });
  });
}

exports.getCompany = (req, res, next) => {
  Company.findById(req.params.id).then(company => {
    if (company) {
      res.status(200).json(company);
    } else {
      res.status(404).json({ message: "Company not found!" });
    }
  }).catch(err => {
    res.status(500).json({
      message: "Failed to fetch the requested company."
    });
  });
}

exports.deleteCompany=  (req, res, next) => {
  Company.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if(result.deletedCount > 0) {
      res.status(200).json({message: "Company deleted."});
    }
    else {
      res.status(401).json({message: "Not authorized to delete company!"});
    }
  }).catch(err => {
    res.status(500).json({
      message: "Company deletion failed due to an internal error. Please try again later."
    });
  });
}

exports.updateCompany =  (req, res, next) => {
  const company = new Company( {
    _id: req.body.id,
    companyName: req.body.companyName,
    businessType: req.body.businessType,
    foundationDate: req.body.foundationDate,
    principalOfficeLocation: req.body.principalOfficeLocation,
    creator : req.userData.userId,
  });
  Company.updateOne({ _id: req.params.id, creator: req.userData.userId }, company).then(result => {
    // in the result we get from the update operation in mongodb, we check the property matchedCount which indicates how many reports could be matched
    if(result.matchedCount > 0) {
      res.status(200).json({message: "Update successful!"});
    }
    else {
      res.status(401).json({message: "Not authorized to update company!"});
    }
  }).catch(error => {
    res.status(500).json({message: "Couldn't update company due to an internal error. Please try again later. "})
  });
}



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
