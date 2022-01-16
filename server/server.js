require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const systemRouter = require("./routes/systemRoutes");
const bcrypt = require("bcryptjs");

// Authentication
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", systemRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/good",
    failureRedirect: "/bad",
  })
);

app.get("/current-user", (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

app.get("/log-out", (req, res) => {
  req.logout();
  res.send("logged out?");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
