const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const browseController = require('../controllers/browse');

const router = express.Router();

router.post('/:categoryId', browseController.getMainData);

router.get('/project/:projectId', isAuth, browseController.getProject);

router.get('/proposal/:proposalId', isAuth, browseController.getProposal);

router.post(
  '/proposal/send',
  [
    body('projectId').isNumeric(),
    body('proposedAmount').isNumeric(),
    body('proposalDescription').isString(),
  ],
  isAuth,
  browseController.createProposal
);

module.exports = router;
