const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
// const isAuth = require('../middleware/is-auth');
const User = require('../modals/user');
const router = express.Router();

router.use(express.static(__dirname + './assets/'));

router.post(
  '/signup',
  [
    body('fname').trim(),
    body('lname').trim(),
    body('email')
      .trim()
      .isEmail()
      .custom((email) => {
        return User.findByEmail(email).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),

    body('password').trim().isLength({ min: 5 }),
    body('gender').trim().isString(),
    body('accountType').trim().isString(),
    body('accountTypeSub').trim().isString(),
    body('mobileNum').trim().isString(),
  ],
  authController.signup
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
  ],
  authController.login
);

router.post(
  '/forgetpassword',
  [body('email').trim().isEmail().normalizeEmail()],
  authController.passwordReset
);

router.post(
  '/setresetpassword',
  [
    body('id').isNumeric(),
    // body("password").isAlphanumeric(),
    // body("token").isAlphanumeric(),
  ],
  authController.setResetPassword
);

router.get('/forget', (req, res) => {
  res
    .status(200, { 'Content-Type': 'application/json' })
    .send(
      '<form method= "post" action="/validation/emailval"> <label> Enter new password </label> <input class="form-control" id="email" name="email" placeholder="email" type="text" > <label> Confirm new password </label> <input class="form-control" id="userID" name="userID" placeholder="email" type="text" > <button type="submit" >register</button> </form>'
    );
});

module.exports = router;
