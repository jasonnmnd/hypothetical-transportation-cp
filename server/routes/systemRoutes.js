const express = require("express");
const router = express.Router();

const SchoolController = require("../controllers/schoolController");
const AuthenticationController = require("../controllers/authenticationController");

// School routes
router.get("/schools", SchoolController.school_list);
router.get("/school/create", SchoolController.school_create_test);
router.post("/school/create", SchoolController.school_create_post);

// Authentication routes
router.post("/signup", AuthenticationController.auth_sign_up);

module.exports = router;
