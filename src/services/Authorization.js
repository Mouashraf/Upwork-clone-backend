const jwt = require("jsonwebtoken");

module.exports.authorize = (req, resp, next) => {
  const decoded = jwt.decode(req.cookies.jwt, "privateGP");
  if (decoded.Username == req.params.UserName) {
    next();
  } else {
    return resp.status(401).json({
      message: "Not Authorized.",
    });
  }
};
