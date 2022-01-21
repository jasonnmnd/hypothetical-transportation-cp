const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
  name: String,
  address: String,
});

module.exports = mongoose.model("SchoolModel", SchoolSchema);
