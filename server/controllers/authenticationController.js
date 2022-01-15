const User = require("../models/user");
exports.auth_sign_up = function (req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.send("Created User");
  });
};
