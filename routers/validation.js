const express = require('express');
const { body } = require('express-validator');

const validationController = require('../controllers/validation');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post(
  '/emailval',
  [body('email').isEmail()],
  isAuth,
  validationController.emailValidation
);

router.get('/confirm', isAuth, validationController.emailValidationConfirm);

module.exports = router;
