const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../../auth.json');

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({
        message: 'User created!', result: result
      });
    })
      .catch(err => {
        res.status(500).json({
          error: "Invalid authentication credentials!"
        });
      });
  });
}


exports.login = (req, res, next) =>  {
  let fetchedUser;
  User.findOne({
    email: req.body.email }).then(user => {
    if(!user){
      return res.status(401).json({
        message: "User was not found"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password)
  })
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: "Wrong password"
        });
      }
      const token = jwt.sign({
        email: fetchedUser.email, userId: fetchedUser._id
      }, auth.user.secret, {
        expiresIn: auth.user.params.expirationPeriod
      });
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Credentials were correct but authentication failed due to an internal server error. Please try again."
      });
    });
}
