const express = require('express');
const { param } = require('express-validator');

const countryController = require('../controllers/worldCountry');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/country', isAuth, countryController.getCountryData);

router.get('/state', isAuth, countryController.getStateData);

router.get('/city/:state_id', [param('state_id')], isAuth, countryController.getCityData);

module.exports = router;
