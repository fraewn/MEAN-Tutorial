const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  title: {type: String, required: true},
  companyName: {type: String, default: 'The boring company'},
  reporterId: {type: String, default: 'admin'},
  rating: {type: Number, default: 123},
  date: {type: Date, default: new Date()},
  comment: {type: String, default: 'we are awesome'}
});

module.exports = mongoose.model('Report', reportSchema);

