const { validationResult } = require('express-validator');
const mailer = require('../middleware/mailer');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.emailValidation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered data has incorrect type');
      error.statusCode = 422;
      throw error;
    }
    const userId = req.body.userId;
    const email = req.body.email;
    const isEmail = await User.findByEmail(email);

    if (!isEmail) {
      const error = new Error('E-Mail address does not exists!');
      error.statusCode = 550;
      throw error;
    }

    const payload = {
      userId: userId,
    };

    const token = jwt.sign(payload, 'snaplancingresetpassworddecode');

    const result = await mailer.emailValidation(email, token, payload);

    if (!result) {
      const error = new Error('Unable to send email!');
      error.statusCode = 402;
      throw error;
    }
    res.status(200).json(result);
  } catch (error) {
    error.statusCode = 550;
    throw error;
  }
};

exports.emailValidationConfirm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered data has incorrect type');
      error.statusCode = 422;
      throw error;
    }
    const token = req.query.t;

    const decodeVal = jwt.decode(token, 'snaplancingresetpassworddecode');

    if (decodeVal) {
      const result = await User.validateEmail(decodeVal.userId);
      if (result) {
        res.status(200).json({ result: 'Email verified Successfully' });
      } else {
        res.status(400).json({ result: 'Verification Failed try again!' });
      }
    }
  } catch (error) {
    error.statusCode = 550;
    throw error;
  }
};
