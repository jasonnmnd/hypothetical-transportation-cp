require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const systemRouter = require("./routes/systemRoutes");

// Authentication
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", systemRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
