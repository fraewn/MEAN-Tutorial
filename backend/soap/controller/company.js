const Company = require("../../models/company");
const conf = require("../../../configuration.json");

exports.createReport =  (args, res) => {
  const company = new Company({
    companyName: args.name,
    businessType: args.businessType,
    foundationDate : new Date(),
    principalOfficeLocation: args.location,
    creator: conf.admin.creator
  });
  console.log(company.creator);
  company.save().then(createdCompany => {
    console.log("Soap Company Controller: Company " + createdCompany + " was added successfully");
  }).catch(error => {
    console.log(error);
    res = error;
  });
  return res;
}
