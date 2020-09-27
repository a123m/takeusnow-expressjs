const express = require('express');
const { body, query } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const projectController = require('../controllers/project');

const router = express.Router();

router.get('/:userId', isAuth, projectController.getMainData);

router.get('/categories/all', isAuth, projectController.catAndSubCat);

router.get('/update/:projectId', isAuth, projectController.updateProject);

router.post(
  '/create',
  [
    body('categoryId').isNumeric(),
    body('projectTitle').isString(),
    body('projectDescription').isString(),
    body('projectStatus').isString(),
    body('ownerId').isNumeric(),
    body('reqSkills').isArray(),
    body('reqOn').isString(),
    body('state').isNumeric(),
    body('city').isNumeric(),
    body('budget').isNumeric(),
  ],
  isAuth,
  projectController.createProject
);

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
