const express = require("express");
var EmployerModel = require("../models/Employer");
const router = express.Router();

// get All Employers
router.get("/", (req, resp) => {
  EmployerModel.find({}, (err, employers) => {
    if (err) resp.status(404).send("can not get any employers " + err);
    else {
      console.log("Worked.");
      resp.status(200).send(employers);
    }
  });
});

// create new Employer and add it to the DB
router.post("/Add", (req, resp) => {
  EmployerModel.create(
    {
      Email: req.body.Email,
      UserName: req.body.UserName,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Password: req.body.Password,
      ImageURL: req.body.ImageURL,
      Country: req.body.Country,
    },
    (err, employer) => {
      if (err) resp.status(404).send("One of your fields is wrong " + err);
      if (!err) {
        resp.status(200).send(employer);
      }
    }
  );
});

//Find by username and remove talent from DB
router.delete("/:UserName", (req, resp) => {
  EmployerModel.findOneAndDelete(
    { UserName: req.params.UserName },
    { useFindAndModify: false },
    (err, talent) => {
      if (err || !talent) {
        resp.status(404).send("Username is incorrect");
      } else {
        resp
          .status(200)
          .send("Employer " + req.params.UserName + " is deleted Successfully");
      }
    }
  );
});

module.exports = router;
