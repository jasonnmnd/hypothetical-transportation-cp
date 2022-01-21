const routes = require("../routes/systemRoutes");

const request = require("supertest");
const assert = require("assert");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("hello world!");
});

test("index route works", (done) => {
  request(app).get("/").expect(200, done);
});
