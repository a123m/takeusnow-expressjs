const express = require('express');

const isAuth = require('../middleware/is-auth');
const homeController = require('../controllers/home');

const router = express.Router();

router.get('/:id', isAuth, homeController.getMainData);

module.exports = router;
