const JobModel = require("../models/Job");
const EmployerModel = require("../models/Employer");

// get All Jobs
exports.getAllJobs = (req, resp) => {
  JobModel.find({}, { __v: 0 }, (err, data) => {
    if (err) resp.status(404).json({ message: "Can't get the jobs " });
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
  });
};

//Get a job by ID
exports.getAJobById = (req, resp) => {
  JobModel.findById(req.params.jobID, { __v: 0 }, (err, data) => {
    if (err || !data) {
      resp.status(404).json({ message: "Wrong ID entered" });
    } else {
      resp.status(200).send(data);
    }
  });
};

// create new job and add it to the DB
exports.createNewJob = (req, resp) => {
  // Add Employer ID

  JobModel.create(
    {
      EmployerID: req.params.EmployerID,
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
      isFixedPrice: req.body.isFixedPrice,
      Duration: req.body.Duration,
      WeeklyHoursRequired: req.body.WeeklyHoursRequired,
    },
    (err, employer) => {
      if (err)
        resp.status(404).json({ message: "One of your fields is wrong " });
      if (!err) {
        resp.status(200).send(employer);
      }
    }
  );
};

//Find by ID and remove job from DB
exports.findJobByIDAndRemove = (req, resp) => {
  JobModel.findByIdAndRemove(
    req.params.id,
    { useFindAndModify: false },
    (err, data) => {
      if (err || !data) {
        resp.status(404).json({
          message: "Job ID is not correct!",
        });
      } else {
        resp.status(200).json({
          message: "Job deleted successfully",
        });
      }
    }
  );
};
