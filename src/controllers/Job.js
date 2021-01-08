const express = require("express");
var JobModel = require("../models/Job");
const router = express.Router();

// get All Jobs
router.get("/", (req, resp) => {
  JobModel.find({}, (err, jobs) => {
    if (err) resp.status(404).send("Can't get jobs " + err);
    else {
      console.log("Worked.");
      resp.status(200).send(jobs);
    }
  });
});

// create new job and add it to the DB
router.post("/Add", (req, resp) => {
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

//Find by username and remove talent from DB
router.delete("/:id", (req, resp) => {
  JobModel.findByIdAndRemove(
    req.params.id,
    { useFindAndModify: false },
    (err, talent) => {
      if (err) {
        resp.status(500).send("Username is not correct!");
      } else {
        resp
          .status(200)
          .send("Job number " + req.params.id + " is deleted Successfully");
      }
    }
  );
});

module.exports = router;
