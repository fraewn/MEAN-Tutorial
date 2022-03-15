const jwt = require("jsonwebtoken");
const auth = require("../../auth.json");

module.exports = (req, res, next) => {
  try {
    // most tokens look like this: "bearer <token>", so we split it at the whitespace
    // and access the second half by accessing the second element in the array via [1]
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, auth.user.secret);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId,
                                                    role: decodedToken.role };
    next();
  }
  catch(err){
    res.status(401).json({
      message: "You are not authenticated!"
    });
    console.log(err);
  }
};
