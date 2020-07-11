const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const path = require("path");

const authController = require("../controllers/auth");
// const isAuth = require('../middleware/is-auth');
const User = require("../modals/user");
const router = express.Router();

router.use(express.static(__dirname + "./assets/"));

var fileStorage = multer.diskStorage({
  destination: "./assets/images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
var upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("image"); // file is name ="filename" in field

router.post(
  "/signup",
  upload,
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
