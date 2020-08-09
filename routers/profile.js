const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const profileController = require("../controllers/profile");

const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "portfolioImage") {
      cb(null, "public/images/portfolio");
    }
    if (file.fieldname === "userImage") {
      cb(null, "public/images/user");
    }
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
}

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: 1024 * 1024 * 1,
});

router.get("/:userId", isAuth, profileController.getMainData);

router.post(
  "/portfolio",
  upload.single("portfolioImage"),
  isAuth,
  profileController.portfolioUpload
);

router.delete(
  "/portfolio/:portfolioId",
  isAuth,
  profileController.portfolioDelete
);

router.post(
  "/userimage/:userId",
  upload.single("userImage"),
  isAuth,
  profileController.userImageUpload
);

router.patch(
  "/:userId",
  isAuth,
  [body("about").isString()],
  profileController.updateProfileData
);

module.exports = router;
