const jwt = require("jsonwebtoken");
const auth = require("../../auth.json");

// a typical middleware is just a function executed on request
module.exports = (req, res, next) => {
  try {
    // most tokens look like "bearer <token>" so we split it at the whitespace
    // and access the second half by accessing the second element in the array via [1]
    // evtl. mal mit 0 probieren - iwie scheint es das element bei index 1 nicht zu geben
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, auth.user.secret);
    next();
  }
  catch(err){
    res.status(401).json({
      message: "Auth failed"
    });
    console.log(err);
  }

};
