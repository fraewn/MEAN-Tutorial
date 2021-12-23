const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../../auth.json');

const User = require("../models/user");
const Audit = require("../models/audit");

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
          message: "Wrong password!"
        });
      }
      const token = jwt.sign({
        email: fetchedUser.email, userId: fetchedUser._id, role: fetchedUser.role
      },
        auth.user.secret, {
        expiresIn: auth.user.params.expirationPeriod
      });
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        role: fetchedUser.role
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Credentials were correct but authentication failed due to an internal server error. Please try again later."
      });
    });
}

exports.createUserWithAuditLog = async (req, res, next) => {
    // Start the transaction.
    const session = await User.startSession();
    session.startTransaction();
    console.log("++++++++++++ Beginning Transaction 'User Creation With Log' +++++++++++++ ")
    try {
      const options = { session };

      // hash password
      let hash;
      await bcrypt.hash(req.body.password, 10).then(result => {
        hash = result;
      })

      // Try and perform first operation on model User
      // create user
      await User.create([{
        email: req.body.email,
        password: hash
      }], options);

      // Try and perform second operation on model Audit
      // log the user creation in audit entity with timestamp and message
      let audit;
      audit = new Audit({
        changeSummary: "user " + req.body.email + " was created",
        date: new Date()
      });

      let result;
      await Audit.create([{
        changeSummary: audit.changeSummary,
        date: audit.date, audit: "toll"
      }], options).then(res => {
        result = res;
      })

      // If all succeeded with no errors, commit and end the session.
      await session.commitTransaction();
      await session.endSession();
      console.log("++++++++++++ Ending Transaction 'User Creation With Log' +++++++++++++ ");

      // set successful result status
      return res.status(201).json({
        message: 'User created!',
        result: result
      });
    } catch (err) {
      // If any error occured, the whole transaction fails and throws error.
      // Undos changes that may have happened.
      await session.abortTransaction();
      await session.endSession();

      console.log("++++++++++++ Transaction aborted and rollbacked due to error: " + err + " +++++++++++++ ")

      // set erroneous result status
      return res.status(500).json({
        message: "This email address is already in use, please use a different one."
      });
  }
}





