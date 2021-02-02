// import Talent Model from our models folder;
const fs = require("fs");
const TalentModel = require("../models/Talent");
const JobModel = require("../models/Job");
const authenticateLogin = require("../services/Authentication")
  .authenticateLogin;
const authenticateAndEncryptPassword = require("../services/Authentication")
  .authenticateAndEncryptPassword;

// get All Talents
exports.getAllTalents = (req, resp) => {
  TalentModel.find({}, {
    __v: 0
  }, (err, data) => {
    if (err) resp.status(404).send("can not get any talents " + err);
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
  });
};

//Get a talent by username
exports.getATalentByUsername = (req, resp) => {
  TalentModel.findOne({
      UserName: req.params.UserName
    }, {
      __v: 0
    },
    (err, data) => {
      if (err || !data) {
        resp.status(404).json({
          message: "Wrong username entered"
        });
      } else {
        resp.status(200).send(data);
      }
    }
  );
};

// create new Talent and add it to the DB
exports.createNewTalent = (req, resp) => {
  console.log(req.body.Password);

  TalentModel.findOne({
      $or: [{
          Email: req.body.Email
        },
        {
          UserName: req.body.UserName
        },
        // {
        //   PhoneNumber: req.body.PhoneNumber
        // },
      ],
    },
    (err, user) => {
      const hashedPassword = authenticateAndEncryptPassword(user, req, resp);
      if (typeof hashedPassword == "string") {
        TalentModel.create({
            Email: req.body.Email,
            UserName: req.body.UserName,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Password: hashedPassword,
            MainService: req.body.MainService,
            Skills: req.body.Skills,
            ExpertiseLevel: req.body.ExpertiseLevel,
            Languages: req.body.Languages,
            HourlyRate: req.body.HourlyRate,
            Title: req.body.Title,
            ProfessionalOverview: req.body.ProfessionalOverview,
            ImageURL: !req.file ?
              "https://www.djelfa.info/mobi/img/avatar/avatar.png" : req.file.path,
            Country: req.body.Country,
            PhoneNumber: req.body.PhoneNumber,
            Availability: req.body.Availability,
            Connects: req.body.Connects,
          },
          (err, talent) => {
            if (err)
              resp.status(500).json({
                message: "One or more fields isn't valid " + err,
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
    req.body.ImageURL = req.file.path
  }
  TalentModel.findOneAndUpdate({
      UserName: req.params.UserName
    }, {
      $set: req.body,
    },
    (err, job) => {
      if (err)
        resp
        .status(404)
        .send("Please be sure you're updating an existing talent " + err);
      if (!err) {
        resp.status(200).send(job);
      }
    }
  );
};

//Find all Talent jobs using username
exports.findAllTalentJobsByUsername = async (req, res) => {
  TalentModel.findOne({
      UserName: req.params.UserName
    })
    .populate('Jobs')
    .exec((err, Talent) => {
      if (Talent) {
        res.status(200).send(Talent.Jobs);
      } else res.status(404).json({
        message: "Please be sure you entered an existing talent username"
      });
    });
}

//Find by username and remove talent from DB
exports.findTalentByUsernameAndDelete = (req, resp) => {
  TalentModel.findOneAndDelete({
      UserName: req.params.UserName
    }, {
      useFindAndModify: false
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
  TalentModel.findOne({
      UserName: req.params.UserName
    }, {
      useFindAndModify: false
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

//Remove job from talent's saved collection
exports.RemoveFromTalentSavedJobsByUsername = (req, resp) => {
  TalentModel.findOne({
      UserName: req.params.UserName
    }, {
      useFindAndModify: false
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
              talent.removeFromSavedJobs(job._id)
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
      UserName: req.params.UserName
    })
    .populate('SavedJobs')
    .exec((err, Talent) => {
      if (Talent) {
        res.status(200).send(Talent.SavedJobs);
      } else {
        res.status(404).json({
          message: "Please be sure you entered an existing talent username"
        });
      }
    });
}

//Login Authentication for the talent
exports.authenticateLogin = (req, resp) => {
  authenticateLogin(TalentModel, req, resp);
};

//Logout for talents
exports.logout = (req, resp) => {
  resp.cookie("jwt", "", {
    maxAge: 1
  });
  resp.status(200).json({
    message: "Logged out successfully",
  });
};