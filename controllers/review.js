const { validationResult } = require('express-validator');
const Review = require('../modals/review');

exports.getMainData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered data has incorrect type');
      error.statusCode = 422;
      throw error;
    }
    const userId = req.params.userId;
    const result = Review.getReviewsByUserId(userId);
    if (!result) {
      const error = new Error('Unable to get review!');
      error.statusCode = 402;
      throw error;
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered data has incorrect type');
      error.statusCode = 422;
      throw error;
    }
    const userId = req.params.userId;
    const result = Review.getReviewsByUserId(userId);
    if (!result) {
      const error = new Error('Unable to get review!');
      error.statusCode = 402;
      throw error;
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
