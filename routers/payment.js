const express = require('express');

const paymentController = require('../controllers/payment');

const router = express.Router();

router.post('/paytm', paymentController.getRequest);
router.post('/paytm/response', paymentController.response);

module.exports = router;
