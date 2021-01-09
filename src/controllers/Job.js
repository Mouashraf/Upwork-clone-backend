const JobModel = require("../models/Job");
const EmployerModel = require("../models/Employer");

// get All Jobs
exports.getAllJobs = (req, resp) => {
  JobModel.find({}, { __v: 0 }, (err, data) => {
    if (err) resp.status(404).send("Can't get jobs " + err);
    else {
      const jobsCount = data.length;
      console.log("Worked.");
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
      resp.status(404).send("Wrong ID entered");
    } else {
      resp.status(200).send(data);
    }
  });
};

// create new job and add it to the DB
exports.createNewJob = (req, resp) => {
  // Add Employer ID
  EmployerModel.findById("5ff8e51e139b8e81d22d013a").then((employer) => {
    req.EmployerID = employer;
    JobModel.create(
      {
        EmployerEmail: req.body.EmployerEmail,
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
        Earning: req.body.Earning,
        Duration: req.body.Duration,
        WeeklyHoursRequired: req.body.WeeklyHoursRequired,
      },
      (err, employer) => {
        if (err) resp.status(404).send("One of your fields is wrong " + err);
        if (!err) {
          resp.status(200).send(employer);
        }
      }
    );
  });
};

//Find by username and remove talent from DB
exports.findJobByUsernameAndRemove = (req, resp) => {
  JobModel.findByIdAndRemove(
    req.params.id,
    { useFindAndModify: false },
    (err, talent) => {
      if (err || !talent) {
        resp.status(404).send("ID is not correct!");
      } else {
        resp
          .status(200)
          .send(`Job number ${req.params.id} is deleted Successfully`);
      }
    }
  );
};
