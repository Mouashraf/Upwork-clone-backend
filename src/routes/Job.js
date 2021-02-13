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
router.get("/:id/proposals", JobController.findAllProposalsForAJob);

//Get specific propose for a job by ID
router.get("/:id/proposals/:porposeID", JobController.findAllProposalsForAJob, JobController.findAProposeForAJob);

// create new job and add it to the DB
router.post(
  "/Add-job/:UserName",
  // Authentication.checkAuth,
  // authorization.authorize,
  JobController.createNewJob
);

//Find job by ID and Edit it

// ISSUE!!!!
router.patch("/:UserName/:id", JobController.findJobByIDAndUpdate);

//Find job and accept a proposal by Employer
router.patch(
  "/:UserName/:id/:TalentUserName",
  Authentication.checkAuth,
  authorization.authorize,
  JobController.findJobAndAcceptAProposalByEmployer,
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
