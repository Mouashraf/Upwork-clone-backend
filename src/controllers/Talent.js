// import Talent Model from our models folder;
const fs = require("fs");
const jwt = require("jsonwebtoken");
const TalentModel = require("../models/Talent");
const JobModel = require("../models/Job");
const authenticateLogin = require("../services/Authentication")
  .authenticateLogin;
const authenticateAndEncryptPassword = require("../services/Authentication")
  .authenticateAndEncryptPassword;

// get All Talents
exports.getAllTalents = (req, resp) => {
  TalentModel.find(
    {},
    {
      __v: 0,
    },
    (err, data) => {
      if (err) resp.status(404).send("can not get any talents ");
      else {
        const talentsCount = data.length;
        resp.status(200).send({
          talentsCount,
          talents: data.map((data) => {
            return {
              data,
              request: {
                type: "GET",
                url: "http://localhost:5000/talent/" + data.UserName,
              },
            };
          }),
        });
      }
    }
  ).sort([["createdAt", -1]]);
};

//Get a talent by username "Public"
exports.getATalentByUsername = (req, resp) => {
  TalentModel.findOne(
    {
      UserName: req.params.UserName,
    },
    {
      __v: 0,
      Password: 0,
      Connects: 0,
      SavedJobs: 0,
      PhoneNumber: 0,
      isVerified: 0,
      Email: 0,
      Proposals: 0,
      isVerified: 0,
      PhoneNumber: 0,
      Jobs: 0,
      SavedJobs: 0
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

//Get a talent by username "Auth"
exports.getATalentByUsernameAuth = (req, resp) => {
  TalentModel.findOne(
    {
      UserName: req.params.UserName,
    },
    {
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

// create new Talent and add it to the DB
exports.createNewTalent = (req, resp) => {
  TalentModel.findOne(
    {
      $or: [
        {
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
        TalentModel.create(
          {
            Email: req.body.Email,
            UserName: req.body.UserName,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Password: hashedPassword,
            MainService: req.body.MainService,
            Skills: req.body.Skills,
            ExpertiseLevel: req.body.ExpertiseLevel,
            EnglishProficiency: req.body.EnglishProficiency,
            HourlyRate: req.body.HourlyRate,
            Title: req.body.Title,
            ProfessionalOverview: req.body.ProfessionalOverview,
            // ImageURL: !req.file
            //   ? "https://www.djelfa.info/mobi/img/avatar/avatar.png"
            //   : req.file.path,
            Country: req.body.Country,
            PhoneNumber: req.body.PhoneNumber,
            Availability: req.body.Availability,
            Connects: req.body.Connects,
            Earnings: req.body.Earnings
          },
          (err, talent) => {
            if (err)
              resp.status(500).json({
                message: "One or more fields isn't valid ",
              });
            resp.status(200).send(talent);
          }
        );
      }
    }
  );
};

//Find Talent by username and edit it
exports.findTalentByUsernameAndUpdate = (req, resp) => {
  if (req.file) {
    req.body.ImageURL = req.file.path;
  }
  TalentModel.findOneAndUpdate(
    {
      UserName: req.params.UserName,
    },
    {
      $set: req.body,
    },
    (err, job) => {
      if (err)
        resp
          .status(404)
          .send("Please be sure you're updating an existing talent ");
      if (!err) {
        resp.status(200).send(job);
      }
    }
  );
};

//Find all Talent jobs using username "Public"
exports.findAllTalentJobsByUsername = async (req, res) => {
  TalentModel.findOne({
    UserName: req.params.UserName,
  })
    .populate(
      "Jobs",
      "Status EmployerUserName Name EmployerRating EmployerReview TalentRating TalentReview"
    )
    .exec((err, Talent) => {
      if (Talent) {
        const EndedJobs = Talent.Jobs.filter(job => {
          return job.Status === "Done"
        })
        res.status(200).send(EndedJobs);
      } else
        res.status(404).json({
          message: "Please be sure you entered an existing talent username",
        });
    });
};

//Find all Talent jobs using username "Auth"
exports.findAllTalentJobsByUsernameAuth = async (req, res) => {
  TalentModel.findOne({
    UserName: req.params.UserName,
  })
    .populate("Jobs", "-Proposals")
    .exec((err, Talent) => {
      if (Talent) {
        res.status(200).send(Talent.Jobs);
      } else
        res.status(404).json({
          message: "Please be sure you entered an existing talent username",
        });
    })
};

//Find by username and remove talent from DB
exports.findTalentByUsernameAndDelete = (req, resp) => {
  TalentModel.findOneAndDelete(
    {
      UserName: req.params.UserName,
    },
    {
      useFindAndModify: false,
    },
    (err, talent) => {
      if (err || !talent) {
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

//Add job to talent's saved collection
exports.AddToTalentSavedJobsByUsername = (req, resp) => {
  TalentModel.findOne(
    {
      UserName: req.params.UserName,
    },
    {
      useFindAndModify: false,
    },
    (err, talent) => {
      if (err || !talent) {
        resp.status(404).json({
          message: "Username is not correct!",
        });
      } else {
        JobModel.findById(req.params.id, (err, job) => {
          if (job) {
            const isAlreadyAdded = talent.SavedJobs.find((item) => {
              return item.toString() === job._id.toString();
            });
            if (!isAlreadyAdded) {
              talent.addToSavedJobs(job);
              resp.status(200).json({
                message: "Job added to saved collection successfully",
              });
            } else {
              resp.status(501).json({
                message: "Job Already Added to your saved collection!",
              });
            }
          }
          if (err || !job) {
            resp.status(404).json({
              message: "Job ID is not correct!",
            });
          }
        });
      }
    }
  );
};

//Find all proposals for a talent
exports.findAllProposalsForAJob = async (req, res, next) => {
  TalentModel.findOne({
    UserName: req.params.UserName,
  })
    .populate("Proposals.Job", "-Proposals -__v")
    .exec((err, talent) => {
      if (err || !talent) {
        res.status(404).json({
          message: "Please be sure you entered a correct talent username",
        });
      } else {
        if (req.params.proposeID) {
          req.body.Proposals = talent.Proposals;
          next();
        } else {
          res.status(200).json(talent.Proposals);
        }
      }
    });
};

//Find a single propose for a job
exports.findAProposeForAJob = async (req, res) => {
  const Propose = req.body.Proposals.find((item) => {
    return item._id.toString() === req.params.proposeID.toString();
  });
  if (!Propose)
    res.status(404).json({
      message: "Please be sure you entered a correct propose id",
    });
  if (Propose) {
    res.status(200).send(Propose);
  }
};

//Remove job from talent's saved collection
exports.RemoveFromTalentSavedJobsByUsername = (req, resp) => {
  TalentModel.findOne(
    {
      UserName: req.params.UserName,
    },
    {
      useFindAndModify: false,
    },
    (err, talent) => {
      if (err || !talent) {
        resp.status(404).json({
          message: "Username is not correct!",
        });
      } else {
        JobModel.findById(req.params.id, (err, job) => {
          if (job) {
            const isNotRemoved = talent.SavedJobs.find((item) => {
              return item.toString() === job._id.toString();
            });
            if (isNotRemoved) {
              talent.removeFromSavedJobs(job._id);
              resp.status(200).json({
                message: "Job removed from saved collection successfully",
              });
            } else {
              resp.status(501).json({
                message: "Job is not in your saved collection!",
              });
            }
          }
          if (err || !job) {
            resp.status(404).json({
              message: "Job ID is not correct!",
            });
          }
        });
      }
    }
  );
};

//Find all Talent saved jobs using username
exports.findAllTalentSavedJobsByUsername = async (req, res) => {
  TalentModel.findOne({
    UserName: req.params.UserName,
  })
    .populate("SavedJobs", "-Proposals -__v")
    .exec((err, Talent) => {
      if (Talent) {
        res.status(200).send(Talent.SavedJobs);
      } else {
        res.status(404).json({
          message: "Please be sure you entered an existing talent username",
        });
      }
    })
};

//Login Authentication for the talent
exports.authenticateLogin = (req, resp) => {
  authenticateLogin(TalentModel, req, resp);
};

//Logout for talents
module.exports.logout = (req, resp) => {
  resp.cookie("jwt", "", {
    maxAge: 1,
  });
  resp.status(200).json({
    message: "Logged out successfully",
  });
};

exports.checkLogged = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    const decoded = jwt.verify(token, "privateGP");
    res.status(200).json({
      message: "Logged in",
    });
  } catch (error) {
    res.status(401).json({
      message: "Not logged in!",
    });
  }
};
