const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  // unique allows mongoose and mongodb internal optimizations, it does not however work as validator nor does it throw errors
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, default: 'basic', enum: ["basic", "admin"]}
});

// for all unique attributes the unique validator mongoose plugin checks
// and actually throws and error if the attribute's value already exists in the database
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
