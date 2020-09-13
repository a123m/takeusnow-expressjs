const express = require('express');

const paymentController = require('../controllers/payment');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/paytm', isAuth, paymentController.getRequest);
router.post('/paytm/response', isAuth, paymentController.response);

module.exports = router;
