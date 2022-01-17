const express = require("express");
const router = express.Router();

const SchoolController = require("../controllers/schoolController");
const RouteController = require("../controllers/routeController");
const AuthenticationController = require("../controllers/authenticationController");
const route = require("../models/route");

// School routes
router.get("/schools", SchoolController.school_list);
router.get("/school/create", SchoolController.school_create_test);
router.post("/school/create", SchoolController.school_create_post);

// Route routes
router.get("/routes", RouteController.route_list);
router.get("/route/create", RouteController.route_create_test);
router.post("/route/create", RouteController.route_create_post);

// Authentication routes
router.post("/signup", AuthenticationController.auth_sign_up);

module.exports = router;
