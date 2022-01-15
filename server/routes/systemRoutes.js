const express = require("express");
const router = express.Router();

const SchoolController = require("../controllers/schoolController");

router.get("/schools", SchoolController.school_list);

router.get("/school/create", SchoolController.school_create_test);

router.post("/school/create", SchoolController.school_create_post);

module.exports = router;
