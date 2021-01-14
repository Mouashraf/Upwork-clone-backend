// import Talent Model from our models folder
const express = require("express");
const router = express.Router();
const TalentController = require("../controllers/Talent");
const Service = require("../services/Services");

// get All Talents
router.get("/", TalentController.getAllTalents);

//Get a talent by username
router.get("/:UserName", TalentController.getATalentByUsername);

// create new Talent and add it to the DB
router.post("/Add", Service.uploadImg, TalentController.createNewTalent);

//Find by username and remove talent from DB
router.delete("/:UserName", TalentController.findTalentByUsernameAndDelete);

//login
router.post("/login", TalentController.authenticateLogin);

module.exports = router;
