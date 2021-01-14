var EmployerModel = require("../models/Employer");
const authenticateLogin = require("../services/Authentication")
  .authenticateLogin;
const authenticateAndEncryptPassword = require("../services/Authentication")
  .authenticateAndEncryptPassword;

// get All Employers
exports.getAllEmployers = (req, resp) => {
  EmployerModel.find({}, { __v: 0 }, (err, data) => {
    if (err) resp.status(404).json({ message: "can not get any employers " });
    else {
      const employersCount = data.length;
      resp.status(200).send({
        employersCount,
        Employers: data.map((data) => {
          return {
            data,
            request: {
              type: "GET",
              url: "http://localhost:5000/employer/" + data.UserName,
            },
          };
        }),
      });
    }
  });
};

//Get an employer by username
exports.getAnEmployerByUsername = (req, resp) => {
  EmployerModel.findOne(
    { UserName: req.params.UserName },
    { __v: 0 },
    (err, data) => {
      if (err || !data) {
        resp.status(404).json({ message: "Wrong username entered" });
      } else {
        resp.status(200).send(data);
      }
    }
  );
};

// create new Employer and add it to the DB
exports.createNewEmployer = (req, resp) => {
  console.log(req.body.Email);
  EmployerModel.findOne(
    {
      $or: [{ Email: req.body.Email }, { UserName: req.body.UserName }],
    },
    (err, user) => {
      const hashedPassword = authenticateAndEncryptPassword(user, req, resp);
      if (typeof hashedPassword == "string") {
        EmployerModel.create(
          {
            Email: req.body.Email,
            UserName: req.body.UserName,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Password: hashedPassword,
            ImageURL: req.body.ImageURL
              ? req.file.path
              : "https://www.djelfa.info/mobi/img/avatar/avatar.png",
            Country: req.body.Country,
          },
          (err, employer) => {
            if (err)
              resp.status(404).send("One of your fields is wrong " + err);
            if (!err) {
              resp.status(200).send(employer);
            }
          }
        );
      }
    }
  );
};

//Find by username and remove talent from DB
exports.findEmployerByUsernameAndRemove = (req, resp) => {
  EmployerModel.findOneAndDelete(
    { UserName: req.params.UserName },
    { useFindAndModify: false },
    (err, data) => {
      if (err || !data) {
        resp.status(404).json({
          message: "Username is not correct!",
        });
      } else {
        resp.status(200).json({
          message: "User deleted successfully",
        });
      }
    }
  );
};

//Login Authentication for the talent
exports.authenticateLogin = (req, resp) => {
  authenticateLogin(EmployerModel, req, resp);
};
