const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model(
  "UserModel",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
  })
);

module.exports = User;
