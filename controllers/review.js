const { validationResult } = require('express-validator');

const User = require('../modals/user');
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

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const offset = (page - 1) * limit;
    const reviews = await Review.getReviewsByUserId(userId, offset, limit);

    if (!req.query.page && !req.query.limit) {
      const user = await User.fetchAllById(userId);
      res.status(200).json({
        average_reviews: user.average_reviews,
        total_reviews: user.total_reviews,
        reviews: reviews,
        // [
        //   {
        //     fname: "mike",
        //     lname: "lulu",
        //     user_image:
        //       "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-forest-in-fog-russian-nature-forest-mist-dmitry-ilyshev.jpg",
        //     review_text: "well done bro!",
        //     rating: 4,
        //     createdAt: new Date().toISOString(),
        //   },
        // ],
      });
    } else {
      res.status(200).json(reviews);
    }
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
