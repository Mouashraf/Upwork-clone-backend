const express = require("express");
const router = express.Router();
const Service = require("../services/Services");
const Authentication = require("../services/Authentication");
const EmployerController = require("../controllers/Employer");
const authorization = require("../services/Authorization");

// get All Employers
router.get("/", EmployerController.getAllEmployers);

//Get an employer details by username "Public"
router.get("/:UserName", EmployerController.getAnEmployerByUsername);

//Get an employer details by username "Auth"
router.get("/auth/:UserName", Authentication.checkAuth,
  authorization.authorize, EmployerController.getAnEmployerByUsernameAuth);

//Find Employer jobs by username "Public"
router.get("/:UserName/jobs", EmployerController.findAllEmployerJobsByUsername);

//Find Employer jobs by username "Auth"
router.get("/auth/:UserName/jobs", Authentication.checkAuth,
  authorization.authorize, EmployerController.findAllEmployerJobsByUsernameAuth);

//Find Employer jobs by his username and job status "Auth"
router.get("/:UserName/:Status", Authentication.checkAuth,
  authorization.authorize, EmployerController.findAllEmployerJobsByUsernameAndStatus);

//Find Employer finished jobs by his username and job status "Public"
router.get("/Public/:UserName/:Status", EmployerController.findAllEmployerFinishedJobsByUsernameAndStatus,
  EmployerController.findAllEmployerJobsByUsernameAndStatus);

// create new Employer and add it to the DB
router.post("/signup", Service.uploadImg, EmployerController.createNewEmployer);

//Find Employer by username and Edit it
router.patch(
  "/:UserName",
  Authentication.checkAuth,
  authorization.authorize,
  EmployerController.findEmployerByUsernameAndUpdate
);

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