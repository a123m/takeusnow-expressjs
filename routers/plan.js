const express = require('express');
const { body, param } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const planController = require('../controllers/plan');

const router = express.Router();

router.get('/get', isAuth, planController.getPlanData);

router.get('/:planId', isAuth, planController.getPlanById);

router.get(
  '/get/:user_id',
  isAuth,
  param('user_id').isNumeric(),
  planController.getPlanByUserId
);

router.patch(
  '/update',
  isAuth,
  [body('plan_id').isNumeric(), body('user_id').isNumeric()],
  planController.updatePlan
);

module.exports = router;
