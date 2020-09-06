// const fs = require('fs');

const { validationResult } = require('express-validator');

const Country = require('../modals/country');

exports.getCountryData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Wrong data format');
      error.statusCode = 422;
      throw error;
    }
    let country = await Country.getCountry();
    if (country) {
      res.status(200).json(country);
    }
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
    let state = await Country.getState();
    if (state) {
      res.status(200).json(state);
    }
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
    let state_id = req.body.state_id;

    let city = await Country.getCity(state_id);
    if (city) {
      res.status(200).json(city);
    } else {
      const error = new Error('No Data Found');
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
