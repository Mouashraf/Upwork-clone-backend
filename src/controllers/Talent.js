// import Talent Model from our models folder;
const express = require("express");
const router = express.Router();
const TalentModel = require("../models/talent");

// get All Talents
router.get("/", (req, resp) => {
  TalentModel.find({}, (err, talents) => {
    if (err) resp.status(404).send("can not get any talents " + err);
    resp.status(200).send(talents);
  });
});

// create new Talent and add it to the DB
router.post("/Add", (req, resp) => {
  TalentModel.create(
    {
      Email: req.body.Email,
      UserName: req.body.UserName,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Password: req.body.Password,
      MainService: req.body.MainService,
      Skills: req.body.Skills,
      ExpertiseLevel: req.body.ExpertiseLevel,
      Languages: req.body.Languages,
      HourlyRate: req.body.HourlyRate,
      Title: req.body.Title,
      ProfessionalOverview: req.body.ProfessionalOverview,
      ImageURL: req.body.ImageURL,
      Country: req.body.Country,
      PhoneNumber: req.body.PhoneNumber,
      Availability: req.body.Availability,
    },
    (err, talent) => {
      if (err) resp.status(500).send("can not create new talent: " + err);
      resp.status(200).send(talent);
    }
  );
});

//Find by username and remove talent from DB
router.delete("/:UserName", (req, resp) => {
  TalentModel.findOneAndDelete(
    { UserName: req.params.UserName },
    { useFindAndModify: false },
    (err, talent) => {
      if (err || !talent) {
        resp.status(404).send("Username is not correct!");
      } else {
        resp
          .status(200)
          .send("Talent " + req.params.UserName + " is deleted Successfully");
      }
    }
  );
});

module.exports = router;
