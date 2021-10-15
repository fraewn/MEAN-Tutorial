const mongoose = require('mongoose');

// Schema groß?
const reportSchema = mongoose.Schema({
  id: String,
  title: {type: String, required: true},
  companyName: {type: String, default: 'The boring company'},
  reporterId: {type: String, default: 'admin'},
  rating: {type: Number, default: 123},
  date: Date,
  comment: {type: String, default: 'we are awesome'}
});

module.exports = mongoose.model('Report', reportSchema);

