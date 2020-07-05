const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const homeController = require('../controllers/home');

const router = express.Router();

router.post(
  '/main',
  [body('id').isNumeric()],
  isAuth, // commented for testing
  homeController.getMainData
);

// router.post("/messenger", homeController.createMessage);

// router.post(
//   "/projects",
//   [
//     body("id").isNumeric(),
//     body("project_name").trim(),
//     body("description").isLength({ max: 500 }),
//     body("status").notEmpty()
//   ],
//   isAuth,
//   homeController.getProjectdata
// );

// router.post(
//   "/profile",
//   [
//     body("id").isNumeric(),
//     body("project_completed").isFloat(),
//     body("about").isLength({ max: 250 }),
//     body("repeat_hire").isFloat(),
//     body("work_on_time").isFloat(),
//     body("work_knowledge").isFloat(),
//     body("overall_review").isFloat(),
//     body("location").notEmpty()
//   ],
//   isAuth,
//   homeController.getProfileDetails
// );

module.exports = router;
