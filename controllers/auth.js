const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../middleware/mailer");

const User = require("../modals/user");

/**
 * Function handle aa signUp requests
 */
exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("E-Mail address already exists!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 12);
    const gender = req.body.gender;
    const file = req.file.file;

    /**
     * always create new object with new data to store in DB
     */
    // console.log(hashedPw);
    const user = new User(fname, lname, email, hashedPw, gender, file);
    // console.log(user);
    const result = await user.save();
    res
      .status(200)
      .json({ message: "User created!", user_id: result[0].insertId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
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
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByEmail(email);

    if (!user) {
      const error = new Error("User Not Found");
      error.statusCode = 401;
      throw error;
    }
    console.log(password);
    const isEqual = await bcrypt.compare(password, user.password_hash);

    if (!isEqual) {
      const error = new Error("Wrong Password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: email,
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Welcome", token: token, value: user });
  } catch (err) {
    next(err);
  }
};

exports.passwordreset = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        "E-Mail address doesn't exists! Instead Want to signup ?"
      );
      error.statusCode = 422;
      throw error;
    }

    const email = req.body.email;

    const result = await User.findByEmail(email);

    if (result) {
      var payload = {
        id: result.user_id, // User ID from database
        email: result.email,
      };

      var token = jwt.sign(payload, "snaplancingresetpassworddecode");
      let messageSend = mailer.resetPassword(email, token, payload);
      if (messageSend) {
        res.status(200).json({
          message: "Reset password mail Sent Successfully",
          value: messageSend,
        });
      } else {
        res.status(737).json({ message: "Failed" });
      }
    } else {
      res.status(402).json({
        message: "This E-mail is not found, Register yourself please",
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.setResetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation Failed");
      error.statusCode = 422;
      throw error;
    }

    let id = req.body.id;
    let email = req.body.email;
    let password = req.body.password;
    let jwtToken = req.body.token;

    let token = jwt.decode(jwtToken, "snaplancingresetpassworddecode");
    const hashedPw = await bcrypt.hash(password, 12);
    // console.log(hashedPw);
    // console.log(token.email);

    if (token.id == id && token.email == email) {
      let result = User.forgetpassword(id, hashedPw);
      res
        .status(200)
        .json({ message: "Password changed Successfully", result: result });
    } else {
      res
        .status(401)
        .json({ message: "You are Not authorized to change password" });
    }
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
