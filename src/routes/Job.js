const express = require("express");
const router = express.Router();
const JobController = require("../controllers/Job");
const Authentication = require("../services/Authentication");
const authorization = require("../services/Authorization");

// get All Jobs
router.get("/", JobController.getAllJobs);

// get All Jobs by skill
router.get("/search/:skill", JobController.searchforJobsBySkill);

//Get a job by ID

router.get("/:id", JobController.getAJobById);

//Get all proposals for a job by ID
router.get("/:UserName/:id/proposals",
Authentication.checkAuth,
authorization.authorize, JobController.findAllProposalsForAJob); // need to authinticate

//Get specific propose for a job by ID
router.get("/:UserName/:id/proposals/:proposeID",
Authentication.checkAuth,
authorization.authorize, JobController.findAllProposalsForAJob, JobController.findAProposeForAJob); // need to authinticate

// create new job and add it to the DB
router.post(
  "/Add-job/:UserName",
  // Authentication.checkAuth,
  // authorization.authorize,
  JobController.createNewJob
);

//Find job by ID and Edit it
router.patch("/:UserName/:id", Authentication.checkAuth,
  authorization.authorize, JobController.findJobByIDAndUpdate);

//Find job and accept a proposal by Employer
router.patch(
  "/:UserName/:id/:TalentUserName",
  Authentication.checkAuth,
  authorization.authorize,
  JobController.findJobAndAcceptAProposalByEmployer,
  JobController.findJobByIDAndUpdate
);

// End Employer job using his username
router.patch(
  "/:UserName/:id/:HiredTalentID/end-job",
  // Authentication.checkAuth,
  // authorization.authorize,
  JobController.endEmployerJobByUserName,
  JobController.findJobByIDAndUpdate
);

//Find job by ID and make a proposal by talent username
router.post(
  "/:id/:UserName/propose",
  Authentication.checkAuth,
  authorization.authorize,
  JobController.findJobAndMakeAProposalByTalent
);

//Find job by username and remove from DB
router.delete(
  "/:UserName/:id",
  Authentication.checkAuth,
  authorization.authorize,
  JobController.findJobByIDAndRemove
);

module.exports = router;
