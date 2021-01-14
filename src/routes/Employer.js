const express = require("express");
const router = express.Router();
const Service = require("../services/Services");

const EmployerController = require("../controllers/Employer");

// get All Employers
router.get("/", EmployerController.getAllEmployers);

//Get an employer by username
router.get("/:UserName", EmployerController.getAnEmployerByUsername);

// create new Employer and add it to the DB
router.post("/Add", Service.uploadImg, EmployerController.createNewEmployer);

// Find Employer by username and remove from DB
router.delete("/:UserName", EmployerController.findEmployerByUsernameAndRemove);

//login
router.post("/login", EmployerController.authenticateLogin);

module.exports = router;
