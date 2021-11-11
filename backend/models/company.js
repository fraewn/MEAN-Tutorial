const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
  companyName: {type: String},
  businessType: {type: String, default: 'other'},
  foundationDate: {type: Date},
  principalOfficeLocation: {type: String},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Company', companySchema);
