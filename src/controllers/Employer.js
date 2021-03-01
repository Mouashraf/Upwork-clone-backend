var EmployerModel = require("../models/Employer");
var JobModel = require("../models/Job");
const authenticateLogin = require("../services/Authentication")
  .authenticateLogin;
const authenticateAndEncryptPassword = require("../services/Authentication")
  .authenticateAndEncryptPassword;

// get All Employers
exports.getAllEmployers = (req, resp) => {
  EmployerModel.find({}, {
      __v: 0,
    },
    (err, data) => {
      if (err)
        resp.status(404).json({
          message: "can not get any employers ",
        });
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
    }
  ).sort([
    ["createdAt", -1]
  ]);
};

//Get an employer by username "Auth"
exports.getAnEmployerByUsernameAuth = (req, resp) => {
  EmployerModel.findOne({
      UserName: req.params.UserName,
    }, {
      __v: 0,
      Password: 0,
    },
    (err, data) => {
      if (err || !data) {
        resp.status(404).json({
          message: "Wrong username entered",
        });
      } else {
        resp.status(200).send(data);
      }
    }
  );
};

//Get an employer by username "Public"
exports.getAnEmployerByUsername = (req, resp) => {
  EmployerModel.findOne({
      UserName: req.params.UserName,
    }, {
      Country: 1,
      Jobs: 1,
      createdAt: 1,
      Spent: 1
    },
    (err, data) => {
      if (err || !data) {
        resp.status(404).json({
          message: "Wrong username entered",
        });
      } else {
        resp.status(200).send(data);
      }
    }
  );
};

// create new Employer and add it to the DB
exports.createNewEmployer = (req, resp) => {
  EmployerModel.findOne({
      $or: [{
          Email: req.body.Email,
        },
        {
          UserName: req.body.UserName,
        },
      ],
    },
    (err, user) => {
      const hashedPassword = authenticateAndEncryptPassword(user, req, resp);
      if (typeof hashedPassword == "string") {
        EmployerModel.create({
            Email: req.body.Email,
            UserName: req.body.UserName,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Password: hashedPassword,
            // ImageURL: !req.file
            //   ? "https://www.djelfa.info/mobi/img/avatar/avatar.png"
            //   : req.file.path,
            Country: req.body.Country,
          },
          (err, employer) => {
            if (err)
              resp.status(404).json({
                message: "One of your fields is wrong " + err,
              });
            if (!err) {
              resp.status(200).send(employer);
            }
          }
        );
      }
    }
  );
};

//Edit an Employer using username
exports.findEmployerByUsernameAndUpdate = (req, resp) => {
  EmployerModel.findOneAndUpdate({
      UserName: req.params.UserName,
    }, {
      $set: req.body,
    },
    (err, job) => {
      if (err)
        resp.status(404).json({
          message: "Please be sure you're updating an existing employer " + err,
        });
      if (!err) {
        resp.status(200).send(job);
      }
    }
  );
};

//Find all Employer jobs using username "Public"
exports.findAllEmployerJobsByUsername = async (req, res) => {
  EmployerModel.findOne({
      UserName: req.params.UserName,
    })
    .populate("Jobs", "-Proposals")
    .exec((err, EmployerJobs) => {
      if (err || !EmployerJobs) {
        res.status(404).json({
          message: "Please be sure you entered an existing employer username",
        });
      } else {
        res.status(200).send(EmployerJobs.Jobs);
      }
    });
};

//Find all Employer jobs using username "Auth"
exports.findAllEmployerJobsByUsernameAuth = async (req, res) => {
  EmployerModel.findOne({
      UserName: req.params.UserName,
    })
    .populate("Jobs")
    .exec((err, EmployerJobs) => {
      if (err || !EmployerJobs)
        res.status(404).json({
          message: "Please be sure you entered an existing employer username" + err,
        });
      if (!err) {
        res.status(200).send(EmployerJobs.Jobs);
      }
    });
};

//Find all Employer active jobs using username
exports.findAllEmployerFinishedJobsByUsernameAndStatus = async (req, res, next) => {
  req.params.Status === "Done";
  next();
}

//Find all Employer jobs using username and job status
exports.findAllEmployerJobsByUsernameAndStatus = async (req, res) => {
  EmployerModel.findOne({
      UserName: req.params.UserName,
    })
    .populate({
      path: "Jobs",
      populate: {
        path: "HiredTalent",
        select: "FirstName LastName Title ImageURL UserName Email",
      },
    })
    .exec((err, Employer) => {
      if (err || !Employer) {
        res.status(404).json({
          message: "Please be sure you entered an existing employer username",
        });
      } else {
        const ActiveJobs = Employer.Jobs.filter((job) => {
          return job.Status === req.params.Status;
        });
        if (ActiveJobs) {
          res.status(200).send({
            NumberOfActiveJobs: ActiveJobs.length,
            ActiveJobs,
          });
        } else {
          res.status(404).json({
            message: "There's no active jobs for this employer",
          });
        }
      }
    });
};

//Find by username and remove talent from DB
exports.findEmployerByUsernameAndRemove = (req, resp) => {
  EmployerModel.findOneAndDelete({
      UserName: req.params.UserName,
    }, {
      useFindAndModify: false,
    },
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

//Logout for employer
exports.logout = (req, resp) => {
  resp.cookie("jwt", "", {
    maxAge: 1,
  });
  resp.status(200).json({
    message: "Logged out successfully",
  });
};