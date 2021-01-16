const express = require("express");
const router = express.Router();
const JobController = require("../controllers/Job");
const Authentication = require("../services/Authentication");
const authorization = require("../services/Authorization");

// get All Jobs
router.get("/", JobController.getAllJobs);

//Get a job by ID
router.get("/:id", JobController.getAJobById);

// create new job and add it to the DB
router.post(
  "/Add-job/:UserName",
  Authentication.checkAuth,
  authorization.authorize,
  JobController.createNewJob
);

//Find job by ID and Edit it
router.patch("/:UserName/:id", JobController.findJobByIDAndUpdate);

//Find job by username and remove from DB
router.delete(
  "/:UserName/:id",
  Authentication.checkAuth,
  authorization.authorize,
  JobController.findJobByIDAndRemove
);

module.exports = router;
