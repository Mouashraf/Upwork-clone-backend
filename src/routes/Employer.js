const express = require("express");
const router = express.Router();
const Service = require("../services/Services");
const Authentication = require("../services/Authentication");
const EmployerController = require("../controllers/Employer");
const authorization = require("../services/Authorization");

// get All Employers
router.get("/", EmployerController.getAllEmployers);

//Get an employer by username
router.get("/:UserName", EmployerController.getAnEmployerByUsername);

// create new Employer and add it to the DB
router.post("/signup", Service.uploadImg, EmployerController.createNewEmployer);

//Find Employer by username and Edit it
router.patch(
  "/:UserName",
  Authentication.checkAuth,
  authorization.authorize,
  EmployerController.findEmployerByUsernameAndUpdate
);

//Find Employer jobs by username
router.get("/:UserName/jobs", EmployerController.findAllEmployerJobsByUsername);

// Find Employer by username and remove from DB // AUTHORIZE
router.delete(
  "/:UserName",
  Authentication.checkAuth,
  authorization.authorize,
  EmployerController.findEmployerByUsernameAndRemove
);

//login
router.post("/login", EmployerController.authenticateLogin);

//logout
router.post("/logout", EmployerController.logout);

module.exports = router;
