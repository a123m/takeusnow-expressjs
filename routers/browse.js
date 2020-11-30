const express = require('express');
const { body, param } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const browseController = require('../controllers/browse');

const router = express.Router();

router.post('/:categoryId', isAuth, browseController.getMainData);

router.get('/project/:projectId', isAuth, browseController.getProject);

router.get(
  '/project/proposal/:userId',
  [param('userId')],
  isAuth,
  browseController.getBids
);

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
