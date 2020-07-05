const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const homeController = require('../controllers/home');

const router = express.Router();

router.post(
    '/review',
    [body('id').isNumeric(), ],
    isAuth,
    homeController.getMainData
  );