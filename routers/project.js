const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');

// const isAuth = require("../middleware/is-auth");
const projectController = require('../controllers/project');

const router = express.Router();

router.get('/:userId', isAuth, projectController.getMainData);

router.put(
  '/create',
  [
    body('userId').isNumeric(),
    body('title').isString(),
    body('detail').isString(),
    body('requireSkills').isArray(),
    body('state').isString(),
    body('status').isString(),
    body('city').isString(),
    body('budget').isFloat(),
    body('validity').isString(),
    body('category').isString(),
    body('createdAt').isString(),
  ],
  isAuth,
  projectController.createProject
);

router.get('/project/:projectId', isAuth, projectController.getProject);

router.patch(
  '/update',
  [body('projectId').isNumeric(), body('status').isString()],
  isAuth,
  projectController.updateProject
);

router.post(
  '/review',
  [
    body('userId').isNumeric(),
    body('reviewProviderId').isNumeric(),
    body('rating').isNumeric(),
    body('description').isString(),
  ],
  isAuth,
  projectController.createReview
);

module.exports = router;
