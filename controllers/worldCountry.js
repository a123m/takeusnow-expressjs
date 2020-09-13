// const fs = require('fs');

const { validationResult } = require('express-validator');

const Country = require('../models/country');

exports.getCountryData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Wrong data format');
      error.statusCode = 422;
      throw error;
    }
    const country = await Country.getCountry();
    if (!country) {
      const error = new Error('Country not found');
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json(country);
  } catch (err) {
    next(err);
  }
};

exports.getStateData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Wrong data format');
      error.statusCode = 422;
      throw error;
    }

    const state = await Country.getState();

    if (!state) {
      const error = new Error('State not found');
      error.statusCode = 422;
      throw error;
    }

    res.status(200).json(state);
  } catch (err) {
    next(err);
  }
};

exports.getCityData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Wrong data format');
      error.statusCode = 422;
      throw error;
    }

    const state_id = req.params.state_id;

    const city = await Country.getCity(state_id);

    if (!city) {
      const error = new Error('No Data Found');
      error.statusCode = 422;
      throw error;
    }

    res.status(200).json(city);
  } catch (err) {
    next(err);
  }
};
