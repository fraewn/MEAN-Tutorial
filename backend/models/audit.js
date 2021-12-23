const mongoose = require('mongoose');

const auditSchema = mongoose.Schema({
  changeSummary: {type: String},
  date: {type: Date}
});

module.exports = mongoose.model('Audit', auditSchema);
