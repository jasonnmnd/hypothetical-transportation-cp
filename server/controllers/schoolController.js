const School = require("../models/school");

exports.school_list = function (req, res) {
  School.find().then((result) => {
    console.log(result);
  });
  // res.send();
  res.send("NOT (FULLY) IMPLEMENTED: School list");
};

exports.school_create = function (req, res) {
  const newSchool = new School({
    name: "Stevens High School",
    address: "Somewhere in SD",
  });
  newSchool.save();
  res.send("NOT (FULLY) IMPLEMENTED: School create");
};
