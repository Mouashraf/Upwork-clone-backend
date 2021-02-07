const JobModel = require("../models/Job");
const EmployerModel = require("../models/Employer");
const TalentModel = require("../models/Talent");

// get All Jobs
exports.getAllJobs = (req, resp) => {
  JobModel.find(
    {},
    {
      __v: 0,
    },
    (err, data) => {
      if (err)
        resp.status(404).json({
          message: "Can't get the jobs ",
        });
      else {
        const jobsCount = data.length;
        // console.log("Worked.");
        resp.status(200).send({
          jobsCount,
          jobs: data.map((data) => {
            return {
              data,
              request: {
                type: "GET",
                url: "http://localhost:5000/job/" + data._id,
              },
            };
          }),
        });
      }
    }
  );
};

// Search for jobs by skill
exports.searchforJobsBySkill = (req, resp) => {
  JobModel.find({ Skills: { $in: req.params.skill } }, {
      __v: 0,
    },
    (err, data) => {
      if (err)
        resp.status(404).json({
          message: "Can't get the jobs ",
        });
      else {
        const jobsCount = data.length;
        // console.log("Worked.");
        resp.status(200).send({
          jobsCount,
          jobs: data.map((data) => {
            return {
              data,
              request: {
                type: "GET",
                url: "http://localhost:5000/job/" + data._id,
              },
            };
          }),
        });
      }
    }
  );
};

//Get a job by ID

//FIX search by Category
exports.getAJobById = (req, resp) => {
  JobModel.findById(
    req.params.id, {
      __v: 0,
    },
    (err, data) => {
      if (err || !data) {
        resp.status(404).json({
          message: "Wrong ID entered",
        });
      } else {
        resp.status(200).send(data);
      }
    }
  );
};

// create new job and add it to the DB
exports.createNewJob = (req, resp) => {
  // Add Employer ID

  JobModel.create(
    {
      EmployerUserName: req.params.UserName,
      Name: req.body.Name,
      Category: req.body.Category,
      Description: req.body.Description,
      JobType: req.body.JobType,
      Skills: req.body.Skills,
      ExpertiseLevel: req.body.ExpertiseLevel,
      TalentsRequired: req.body.TalentsRequired,
      Country: req.body.Country,
      JobSuccessScore: req.body.JobSuccessScore,
      EnglishLevel: req.body.EnglishLevel,
      Earning: req.body.Earning,
      PaymentType: req.body.PaymentType,
      Price: req.body.Price,
      Duration: req.body.Duration,
      WeeklyHoursRequired: req.body.WeeklyHoursRequired,
      EmployerRating: req.body.EmployerRating,
      EmployerReview: req.body.EmployerReview,
      TalentUserName: req.body.TalentUserName,
      TalentRating: req.body.TalentRating,
      TalentReview: req.body.TalentReview,
      Proposals: req.body.Proposals,
      ConnectsNeeded: req.body.ConnectsNeeded,
      Status: req.body.Status,
    },
    (err, job) => {
      if (err)
        resp.status(404).json({
          message: "One of your fields is wrong ",
        });
      if (!err) {
        EmployerModel.findOne({
          UserName: job.EmployerUserName,
        }).then((employer) => {
          employer.addToJobs(job);
        });
        resp.status(200).send(job);
      }
    }
  );
};

//Find job by ID and edit
exports.findJobByIDAndUpdate = (req, resp) => {
  JobModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, job) => {
      if (err)
        resp
          .status(404)
          .send("Please be sure you're updating an existing job " + err);
      if (!err) {
        resp.status(200).send(job);
      }
    }
  );
};

//Find job and make a proposal by Talent
exports.findJobAndMakeAProposalByTalent = (req, res) => {
  TalentModel.findOne(
    {
      UserName: req.params.UserName,
    },
    (err, talent) => {
      JobModel.findById(req.params.id, (err, job) => {
        if (job) {
          const isEligible = job.Proposals.find((item) => {
            return item.toString() === talent._id.toString();
          });
          const isEnoughConnects = () => {
            return talent.Connects >= job.ConnectsNeeded;
          };
          if (!isEligible && isEnoughConnects()) {
            talent.deductFromConnects(job.ConnectsNeeded);
            job.addToProposals(talent._id);
            res.status(200).json({
              message: "You've successfully proposed to this job",
            });
          } else {
            res.status(401).json({
              message: "You Can't make a proposal to this job",
            });
          }
        }
        if (err || !job) {
          res.status(404).json({
            message: "Job ID is not correct!",
          });
        }
      });
      if (err || !talent) {
        res.status(404).json({
          message: "Talent Username is not correct!",
        });
      }
    }
  );
};

//Find job and accept a proposal by Employer
exports.findJobAndAcceptAProposalByEmployer = (req, res, next) => {
  TalentModel.findOne(
    {
      UserName: req.params.TalentUserName,
    },
    (err, talent) => {
      if (talent) {
        JobModel.findOne(
          {
            _id: req.params.id,
            TalentUserName: { $nin: talent.UserName },
            EmployerUserName: req.params.UserName,
            Proposals: talent._id.toString(),
            Status: "Pending",
          },
          (err, job) => {
            if (job) {
              talent.returnConnects(job.ConnectsNeeded);
              req.body.TalentUserName = req.params.TalentUserName;
              req.body.Status = "Ongoing";
              next();
            }
            // });

            // JobModel.findById(req.params.id, (err, job) => {
            //   if (job) {
            //     if (job.EmployerUserName == req.params.UserName) {
            //       const isProposed = job.Proposals.find((item) => {
            //         return item.toString() === talent._id.toString();
            //       });
            //       if (isProposed) {
            //         req.body.TalentUserName = req.params.TalentUserName;
            //         req.body.Status = "Ongoing"
            //         next();
            //       } else {
            //         res.status(401).json({
            //           message: "Talent isn't proposed to this job",
            //         });
            //       }
            //     } else {
            //       res.status(404).json({
            //         message: "This Job Doesn't belong to this Employer",
            //       });
            //     }
            //   }
            if (err || !job) {
              res.status(404).json({
                message: "Sorry your request can't processed!",
              });
            }
          }
        );
      }
      if (err || !talent) {
        res.status(404).json({
          message: "Talent Username is not correct!",
        });
      }
    }
  );
};

//Find by ID and remove job from DB
exports.findJobByIDAndRemove = (req, resp) => {
  JobModel.findById(req.params.id, (err, job) => {
    if (job) {
      if (req.params.UserName == job.EmployerUserName) {
        JobModel.findByIdAndRemove(
          req.params.id,
          {
            useFindAndModify: false,
          },
          (err, data) => {
            if (err || !data) {
              resp.status(404).json({
                message: "Job ID is not correct!",
              });
            } else {
              EmployerModel.findOne({
                UserName: data.EmployerUserName,
              }).then((employer) => {
                employer.removeFromJobs(data._id);
              });
              resp.status(200).json({
                message: "Job deleted successfully",
              });
            }
          }
        );
      } else {
        resp.status(401).json({
          message: "You Can't delete a job doesn't belong to you",
        });
      }
    }
    if (err || !job) {
      resp.status(404).json({
        message: "Job ID is not correct!",
      });
    }
  });
};
