const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

const myprofileController = require("../controllers/myprofile");

router.post(
  "/main",
  [body("id").isNumeric()],
  isAuth, // commented for testing
  myprofileController.getMainData
);

module.exports = router;
