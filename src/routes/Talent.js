// import Talent Model from our models folder
const express = require("express");
const router = express.Router();
const TalentController = require("../controllers/Talent");
const Authentication = require("../services/Authentication");
const Service = require("../services/Services");
const authorization = require("../services/Authorization");

// get All Talents
router.get("/", TalentController.getAllTalents);

//Get a talent by username
router.get("/:UserName", TalentController.getATalentByUsername);

// signup Talent and add it to the DB
router.post("/signup", Service.uploadImg, TalentController.createNewTalent);

//Find Talent jobs by username
router.get("/:UserName/jobs", TalentController.findAllTalentJobsByUsername);

//Find Talent saved jobs by username
router.get("/:UserName/saved-jobs", TalentController.findAllTalentSavedJobsByUsername);

//Find Talent by username and Edit it
router.patch(
  "/:UserName",
  Authentication.checkAuth,
  authorization.authorize,
  Service.uploadImg,
  TalentController.findTalentByUsernameAndUpdate
);

//Add job to talent's saved collection
router.post(
  "/:UserName/:id/save",
  Authentication.checkAuth,
  authorization.authorize,
  TalentController.AddToTalentSavedJobsByUsername
);

//REmove job from talent's saved collection
router.delete(
  "/:UserName/:id/save",
  Authentication.checkAuth,
  authorization.authorize,
  TalentController.RemoveFromTalentSavedJobsByUsername
);

//Find by username and remove talent from DB
router.delete(
  "/:UserName",
  Authentication.checkAuth,
  authorization.authorize,
  TalentController.findTalentByUsernameAndDelete
);

//login
router.post("/login", TalentController.authenticateLogin);

//logout
router.post("/logout", TalentController.logout);

module.exports = router;