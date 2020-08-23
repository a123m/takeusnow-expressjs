const express = require('express');
const { body, query } = require('express-validator');
const isAuth = require('../middleware/is-auth');

// const isAuth = require("../middleware/is-auth");
const projectController = require('../controllers/project');

const router = express.Router();

router.get('/:userId', isAuth, projectController.getMainData);

router.post(
  '/create',
  [
    body('categoryId').isNumeric(),
    body('projectTitle').isString(),
    body('projectDescription').isString(),
    body('projectStatus').isString(),
    body('ownerId').isNumeric(),
    body('reqSkills').isArray(),
    // body('reqOn').isArray(),
    body('state').isString(),
    body('city').isString(),
    body('budget').isNumeric(),
  ],
  isAuth,
  projectController.createProject
);

router.get('/update/:projectId', isAuth, projectController.updateProject);

router.post(
  '/review',
  [
    query('accountType').isString(),
    body('projectId').isNumeric(),
    body('reviewerUserId').isNumeric(),
    body('description').isString(),
    body('rating').isNumeric(),
  ],
  isAuth,
  projectController.createReview
);

module.exports = router;
