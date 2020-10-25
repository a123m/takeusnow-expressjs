const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

const notificationController = require('../controllers/notifications');

router.post(
  '/send',
  isAuth,
  [
    body('userId').isNumeric(),
    body('title').trim().isString(),
    body('body').trim().isString(),
  ],
  notificationController.sendToUser
);

router.post(
  '/sendToAll',
  isAuth,
  [body('title').trim().isString(), body('body').trim().isString()],
  notificationController.sendToAll
);

module.exports = router;
