const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 3001;

var SomeModel = require("./models/example");

var mongoDB = "mongodb://localhost:27017/test";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  // var awesome_instance = new SomeModel({ name: "awesome" });
  // // Save the new model instance, passing a callback
  // awesome_instance.save(function (err) {
  //   if (err) console.log("fail to save");
  //   console.log("saved!");
  // });
  const kittySchema = new mongoose.Schema({
    name: String,
  });

  const Kitten = mongoose.model("Kitten", kittySchema);
  const silence = new Kitten({ name: "Silence" });
  console.log(silence.name); // 'Silence'
  const fluffy = new Kitten({ name: "fluffy" });
  fluffy.save(function (err) {
    Kitten.find().then((res) => console.log(res));
  });

  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
