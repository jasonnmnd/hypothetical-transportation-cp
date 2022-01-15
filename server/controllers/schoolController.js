const School = require("../models/school");
const { body, validationResult } = require("express-validator");
const { isLength } = require("validator");

exports.school_list = function (req, res) {
  School.find().then((result) => {
    console.log(result);
  });
  // res.send();
  res.send("NOT (FULLY) IMPLEMENTED: School list");
};

exports.school_create_test = function (req, res) {
  const newSchool = new School({
    name: "Stevens High School",
    address: "Somewhere in SD",
  });
  newSchool.save();
  res.send(
    "NOT (FULLY) IMPLEMENTED: Example Mongoose ODM for inserting into database"
  );
};

exports.school_create_post = [
  body("name").isLength({ min: 5 }),
  body("address").isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors.array());
    } else {
      const newSchool = new School({
        name: req.body.name,
        address: req.body.address,
      });
      newSchool.save();
      res.send("School Validation Successful");
    }
  },
];
