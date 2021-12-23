const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  title: {type: String, required: true},
  // companyName: {type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true},
  // also: refactor to company, not companyName anymore (because instance id not name is used)
  companyName: {type: String, default: 'The boring company'},
  reporterId: {type: String, default: 'admin'},
  rating: {type: Number, default: 123},
  date: {type: Date, default: new Date(2018, 11, 24, 10, 33, 30, 0)},
  comment: {type: String, default: 'we are awesome'},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Report', reportSchema);

