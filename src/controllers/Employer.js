var EmployerModel = require("../models/Employer");

// get All Employers
exports.getAllEmployers = (req, resp) => {
  EmployerModel.find({}, { __v: 0 }, (err, data) => {
    if (err) resp.status(404).send("can not get any employers " + err);
    else {
      const employersCount = data.length;
      resp.status(200).send({
        employersCount,
        Employers: data.map((data) => {
          return {
            data,
            request: {
              type: "GET",
              url: "http://localhost:5000/employer/" + data.UserName,
            },
          };
        }),
      });
    }
  });
};

//Get an employer by username
exports.getAnEmployerByUsername = (req, resp) => {
  EmployerModel.findOne(
    { UserName: req.params.UserName },
    { __v: 0 },
    (err, data) => {
      if (err || !data) {
        resp.status(404).send("Wrong username entered");
      } else {
        resp.status(200).send(data);
      }
    }
  );
};

// create new Employer and add it to the DB
exports.createNewEmployer = (req, resp) => {
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
};

//Find by username and remove talent from DB
exports.findEmployerByUsernameAndRemove = (req, resp) => {
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
};
