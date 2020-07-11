const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

// const isAuth = require("../middleware/is-auth");
const profileController = require("../controllers/profile");

const router = express.Router();

router.get(
  "/main/:id",
  // [body('id').isNumeric()],
  isAuth,
  profileController.getMainData
);

router.patch(
  "/update",
  [
    body("id").isNumeric(),
    body("about").isString(),
    body("state").isNumeric(),
    body("city").isNumeric(),
    body("my_skills").isArray(),
  ],
  // isAuth,
  profileController.updateProfileData
);

module.exports = router;
