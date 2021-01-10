const express = require("express");
const router = express.Router();
const EmployerController = require("../controllers/Employer");

// get All Employers
router.get("/", EmployerController.getAllEmployers);

//Get an employer by username
router.get("/:UserName", EmployerController.getAnEmployerByUsername);

// create new Employer and add it to the DB
router.post("/Add", EmployerController.createNewEmployer);

// Find Employer by username and remove from DB
router.delete("/:UserName", EmployerController.findEmployerByUsernameAndRemove);

module.exports = router;
