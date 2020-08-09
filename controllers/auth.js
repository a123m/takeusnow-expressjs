const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailer = require('../middleware/mailer');

const User = require('../modals/user');

/**
 * Function handle aa signUp requests
 */
exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('E-Mail address already exists!');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 12);

    let gender = req.body.gender;
    if (gender.toUpperCase() === 'MALE') {
      gender = 'm';
    }
    if (gender.toUpperCase() === 'FEMALE') {
      gender = 'f';
    }
    const accountType = req.body.accountType;
    const accountTypeSub = req.body.accountTypeSub;
    const mobileNum = req.body.mobileNum;
    /**
     * always create new object with new data to store in DB
     */
    const user = new User(
      fname,
      lname,
      email,
      hashedPw,
      gender,
      accountType,
      accountTypeSub,
      mobileNum
    );
    const result = await user.save();
    res
      .status(200)
      .json({ message: 'User created!', user_id: result[0].insertId });
  } catch (err) {
    next(err);
  }
};

/**
 * This will handle all request regarding to login
 */
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByEmail(email);

    if (!user) {
      const error = new Error('User Not Found');
      error.statusCode = 401;
      throw error;
    }

    if (!user.status) {
      const error = new Error('Please verify your E-mail!');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password_hash);

    if (!isEqual) {
      const error = new Error('Wrong Password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: email,
      },
      'somesupersecretsecret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Welcome',
      token: token,
      userId: user.user_id,
      accountType: user.account_type,
    });
  } catch (err) {
    next(err);
  }
};

exports.passwordReset = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Enter valid e-mail!');
      error.statusCode = 422;
      throw error;
    }

    const email = req.body.email;

    const result = await User.findByEmail(email);

    if (!result) {
      const error = new Error('E-Mail address does not exists!');
      error.statusCode = 402;
      throw error;
    }

    const payload = {
      id: result.user_id, // User ID from database
      email: result.email,
    };

    const token = jwt.sign(payload, 'snaplancingresetpassworddecode');
    const messageSend = mailer.resetPassword(email, token, payload);

    if (!messageSend) {
      const error = new Error('Failed to send mail. Please try again!');
      error.statusCode = 500;
      throw error;
    }
    res.status(200).json({
      message: 'Reset password mail Sent Successfully',
      value: messageSend,
    });
  } catch (err) {
    next(err);
  }
};

exports.setResetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed');
      error.statusCode = 422;
      throw error;
    }

    const id = req.body.id;
    const email = req.body.email;
    const password = req.body.password;
    const jwtToken = req.body.token;

    const token = jwt.decode(jwtToken, 'snaplancingresetpassworddecode');
    const hashedPw = await bcrypt.hash(password, 12);

    if (token.id !== id && token.email !== email) {
      const error = new Error('You are not authorized to change password.');
      error.statusCode = 401;
      throw error;
    }
    const result = User.forgetPassword(id, hashedPw);
    res
      .status(200)
      .json({ message: 'Password changed Successfully', result: result });
  } catch (err) {
    next(err);
  }
};

// exports.getUserStatus = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) {
//       const error = new Error('User not found.');
//       error.statusCode = 404;
//       throw error;
//     }
//     res.status(200).json({ status: user.status });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.updateUserStatus = async (req, res, next) => {
//   const newStatus = req.body.status;
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) {
//       const error = new Error('User not found.');
//       error.statusCode = 404;
//       throw error;
//     }
//     user.status = newStatus;
//     await user.save();
//     res.status(200).json({ message: 'User updated.' });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };
