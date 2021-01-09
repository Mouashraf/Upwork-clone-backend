// import Talent Model from our models folder;
const express = require("express");
const router = express.Router();
const TalentController = require("../controllers/Talent");

// get All Talents
router.get("/", TalentController.getAllTalents);

// create new Talent and add it to the DB
router.post("/Add", TalentController.createNewTalent);

//Find by username and remove talent from DB
router.delete("/:UserName", TalentController.findTalentByUsernameAndDelete);

module.exports = router;
