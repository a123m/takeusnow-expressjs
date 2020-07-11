const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const path = require("path");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

const portfolio = require("../controllers/portfolio");

router.use(express.static(__dirname + "./assets/"));

var fileStorage = multer.diskStorage({
  destination: "./assets/portfolio",
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
}).single("portfolio_image"); // file is name ="filename" in field

router.post(
  "/main",
  upload,
  [body("id").isNumeric()],
  isAuth, // commented for testing
  portfolio.getMainData
);

module.exports = router;
