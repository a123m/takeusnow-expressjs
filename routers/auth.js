const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
// const isAuth = require('../middleware/is-auth');
const User = require('../modals/user');
const router = express.Router();

router.use(express.static(__dirname + './assets/'));

/**
 * @swagger
 * definition:
 *  error:
 *    properties:
 *      statusCode:
 *        type: integer
 *        format: int32
 *        default: 400
 *      message:
 *        type: string
 *      error:
 *        type:string
 *  success:
 *    properties:
 *      statusCode:
 *        type: integer
 *        format: int32
 *        default: 200
 *      message:
 *        type: string
 *      error:
 *        type:string
 *  user:
 *    properties:
 *      fname:
 *        type: string
 *      lname:
 *        type: string
 *      email:
 *        type: string
 *        format: email
 * /auth/signup:
 *  post:
 *    tags:
 *    - Register User and Login
 *    description: Register a new user
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: "All fields need to be added"
 *      required: true
 *      schema:
 *        type: object
 *        required:
 *          - userName
 *        properties:
 *          fname:
 *            type: string
 *          lname:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *          password:
 *            type: string
 *          gender:
 *            type: string
 *            "enum": [
 *              "m,f,o"
 *             ]
 *          file:
 *            type: file
 *    response:
 *      400:
 *        description: invalid request
 *      200:
 *        description: User created succesfully
 */
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

/**
 * @swagger
 * definition:
 *  error:
 *    properties:
 *      statusCode:
 *        type: integer
 *        format: int32
 *        default: 400
 *      message:
 *        type: string
 *      error:
 *        type:string
 *  success:
 *    properties:
 *      statusCode:
 *        type: integer
 *        format: int32
 *        default: 200
 *      message:
 *        type: string
 *      error:
 *        type:string
 *  user:
 *    properties:
 *      fname:
 *        type: string
 *      lname:
 *        type: string
 *      email:
 *        type: string
 *        format: email
 * /auth/login:
 *  post:
 *    tags:
 *    - Register User and Login
 *    description: Login a new user
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: "All fields need to be added"
 *      required: true
 *      schema:
 *        type: object
 *        required:
 *          - userName
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *          password:
 *            type: string
 *    response:
 *      400:
 *        description: invalid request
 *      200:
 *        description: User created succesfully
 */
router.post(
  '/login',
  [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
  ],
  authController.login
);

/**
 * @swagger
 * definition:
 *  error:
 *    properties:
 *      statusCode:
 *        type: integer
 *        format: int32
 *        default: 400
 *      message:
 *        type: string
 *      error:
 *        type:string
 *  success:
 *    properties:
 *      statusCode:
 *        type: integer
 *        format: int32
 *        default: 200
 *      message:
 *        type: string
 *      error:
 *        type:string
 *  user:
 *    properties:
 *      fname:
 *        type: string
 *      lname:
 *        type: string
 *      email:
 *        type: string
 *        format: email
 * /auth/forgetpassword:
 *  post:
 *    tags:
 *    - Forget Password
 *    description: Reset password
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: "All fields need to be added"
 *      required: true
 *      schema:
 *        $ref: "#/forgetpassword"
 *    response:
 *      400:
 *        description: invalid request
 *      200:
 *        description: User created succesfully
 */
router.post(
  '/forgetpassword',
  [body('email').trim().isEmail().normalizeEmail()],
  authController.passwordReset
);

/**
 * @swagger
 * definition:
 *  error:
 *    properties:
 *      statusCode:
 *        type: integer
 *        format: int32
 *        default: 400
 *      message:
 *        type: string
 *      error:
 *        type:string
 *  success:
 *    properties:
 *      statusCode:
 *        type: integer
 *        format: int32
 *        default: 200
 *      message:
 *        type: string
 *      error:
 *        type:string
 *  user:
 *    properties:
 *      fname:
 *        type: string
 *      lname:
 *        type: string
 *      email:
 *        type: string
 *        format: email
 * /auth/setresetpassword:
 *  post:
 *    tags:
 *    - Forget Password
 *    description: Reset password
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: "All fields need to be added"
 *      required: true
 *      schema:
 *        $ref: "#/setresetpassword"
 *    response:
 *      400:
 *        description: invalid request
 *      200:
 *        description: User created succesfully
 */
router.post(
  '/setresetpassword',
  [
    body('id').isNumeric(),
    // body("password").isAlphanumeric(),
    // body("token").isAlphanumeric(),
  ],
  authController.setResetPassword
);

module.exports = router;
