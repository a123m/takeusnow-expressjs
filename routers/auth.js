const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
// const isAuth = require('../middleware/is-auth');
const User = require("../modals/user");
const router = express.Router();

router.post(
  "/signup",
  [
    body("fname").trim(),
    body("lname").trim(),
    body("email")
      .trim()
      .isEmail()
      .custom((email) => {
        return User.findByEmail(email).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.login
);

router.post(
  "/forgetpassword",
  [
    body("email")
      .trim()
      .isEmail()
      .custom((email) => {
        return User.findByEmail(email).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject(
              "E-Mail address doesn't exists! Instead Want to signup ?"
            );
          }
        });
      })
      .normalizeEmail(),
  ],
  authController.passwordreset
);
router.post(
  "/setresetpassword",
  [
    body("id").isNumeric(),
    // body("password").isAlphanumeric(),
    // body("token").isAlphanumeric(),
  ],
  authController.setResetPassword
);

module.exports = router;
