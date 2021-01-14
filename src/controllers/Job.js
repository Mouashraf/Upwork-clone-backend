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
      EmployerRating: req.body.EmployerRating,
      EmployerReview: req.body.EmployerReview,
      TalentID: req.body.TalentID,
      TalentRating: req.body.TalentRating,
      TalentReview: req.body.TalentReview,
      Proposals: req.body.Proposals,
      ConnectsNeeded: req.body.ConnectsNeeded,
      Status: req.body.Status
    },
    (err, job) => {
      if (err)
        resp.status(404).json({ message: "One of your fields is wrong " });
      if (!err) {
        job.EmployerID.addToJobs(job);
        resp.status(200).send(job);
      }
    }
  );
};

//Find job by ID and edit 
exports.findJobByIDAndUpdate = (req, resp) => {
	JobModel.findByIdAndUpdate(
		req.params.id, {
			$set: req.body
		},
		(err, job) => {
			if (err) resp.status(404).send("Please be sure you're updating an existing job " + err);
			if (!err) {
				resp.status(200).send(job);
			}
		}
	)
}


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
        data.EmployerID.removeFromJobs(data._id);
        resp.status(200).json({
          message: "Job deleted successfully",
        });
      }
    }
  );
};
