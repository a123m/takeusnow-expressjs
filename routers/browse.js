const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const browseController = require('../controllers/browse');

const router = express.Router();

router.post(
  '/:categoryId',
  // isAuth,
  browseController.getMainData
);

router.post(
  '/getproject',
  [body('projectId').isNumeric()],
  isAuth,
  browseController.getProject
);
router.post(
  '/getProposal',
  [body('proposalId').isNumeric()],
  isAuth,
  browseController.getProposal
);

router.post(
  '/updateProposal',
  [
    body('proposalId').isNumeric(),
    body('projectId').isNumeric(),
    body('status').isNumeric(),
  ],
  isAuth,
  browseController.updateProposal
);
router.post(
  '/createProposal',
  [
    body('projectId').isNumeric(),
    body('userId').isNumeric(),
    body('proposedPrice').isFloat(),
    body('description').isString(),
    body('status').isNumeric(),
  ],
  isAuth,
  browseController.createProposal
);

module.exports = router;
