const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");
const reviewController = require("../controllers/review");

const router = express.Router();

router.get("/:userId", reviewController.getMainData);

router.post(
  "/review",
  [body("id").isNumeric()],
  isAuth,
  reviewController.getMainData
);

module.exports = router;
