const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.auth_sign_up = function (req, res, next) {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) res.send("Hashing Failed");
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.send("Created User");
    });
  });
};
