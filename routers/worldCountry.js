const express = require('express');
const { body } = require('express-validator');

const countryController = require('../controllers/worldCountry');

const router = express.Router();

router.get('/country', countryController.getCountryData);

router.get('/state', countryController.getStateData);

router.post(
  '/city',
  [body('state_id').isNumeric()],
  countryController.getCityData
);

module.exports = router;
