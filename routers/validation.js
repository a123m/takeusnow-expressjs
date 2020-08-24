const express = require('express');
const { body } = require('express-validator');

const validationController = require('../controllers/validation');

const router = express.Router();

router.post(
  '/emailval',
  [body('email').isEmail()],
  validationController.emailValidation
);

router.get('/confirm', validationController.emailValidationConfirm);

module.exports = router;
