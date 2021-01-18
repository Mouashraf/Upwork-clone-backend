const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");

module.exports.checkAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    const decoded = jwt.verify(token, "privateGP");
    console.log(decoded);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication Failed",
    });
  }
};

//Authenticate user creation and encrypt password
module.exports.authenticateAndEncryptPassword = (user, req, resp) => {
  if (user) {
    deleteUnwantedImage(req);
    return resp.status(409).json({
      message: "Email, username or phone number already exist",
    });
  } else {
    if (req.body.Password.length < 6) {
      deleteUnwantedImage(req);
      return resp.status(500).json({
        message: "Enter a valid password",
      });
    } else {
      var x = bcrypt.hashSync(req.body.Password, 10);
      return x;
    }
  }
};

//Authenticate and give token
module.exports.authenticateLogin = (model, req, resp) => {
  model.findOne({
    Email: req.body.Email
  }, (err, userData) => {
    if (err || !userData) {
      resp.status(401).json({
        message: "Wrong email entered!",
      });
    } else {
      const maxAge = 3 * 24 * 60 * 60;
      bcrypt.compare(req.body.Password, userData.Password, (err, res) => {
        if (err || !res) {
          resp.status(401).json({
            message: "Wrong password entered!",
          });
        }
        if (res) {
          const token = jwt.sign({
              email: userData.Email,
              ID: userData._id,
              Username: userData.UserName,
            },
            "privateGP", {
              expiresIn: maxAge,
            }
          );
          resp.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000
          });
          resp.status(200).json({
            message: "Successfully Authenticated!",
            token: token,
          });
        }
      });
    }
  });
};


//Function to delete the uploaded image if there is an error on adding a new talent
function deleteUnwantedImage(req) {
  if (typeof req.body.ImageURL != undefined) {
    fs.unlink(req.file.path, (err) => {
      if (err) throw err;
      console.log("successfully deleted uploaded image");
    });
  }
}