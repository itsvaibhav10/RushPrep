// ---------------   Models  ---------------
const User = require('../models/user');

// ---------------   Module Imports  ---------------
const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const auth = require('../middleware/is-auth');

// Initializing Router
const router = express.Router();


// ---------------  Sign UP  ---------------
router.get('/signup', auth.isNotAuth, authController.getSignup);
router.post(
  '/signup',
  auth.isNotAuth,
  [
    body('name', `Name Can't Be Empty`).not().isEmpty().trim(),
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value, emailVerify: true }).then(
          (userDoc) => {
            if (userDoc) {
              return Promise.reject(
                'E-Mail exists already, please pick a different one.'
              );
            }
          }
        );
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      // .matches('(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}')
      .isLength({ min: 8 })
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      }),
  ],
  authController.postSignup
);

// ---------------  Verify Email  ---------------
router.get('/verify/:token', auth.isNotAuth, authController.verifyEmail);
router.get('/EmailResend/:token', auth.isNotAuth, authController.EmailResend);

// ---------------  Login  ---------------
router.get('/login', auth.isNotAuth, authController.getLogin);
router.post(
  '/login',
  auth.isNotAuth,
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.').isLength({ min: 5 }).trim(),
  ],
  authController.postLogin
);

// ---------------  Logout  ---------------
router.post('/logout', authController.postLogout);
// router.get('/logout', authController.postLogout);

// ---------------  Notify  ---------------
router.get('/notify', auth.isNotAuth, authController.getNotify);

// ---------------  Reset Password  ---------------
router.get('/reset', auth.isNotAuth, authController.getReset);
router.post('/reset', auth.isNotAuth, authController.postReset);
router.get('/reset/:token', auth.isNotAuth, authController.getNewPassword);
router.post('/new-password', auth.isNotAuth, authController.postNewPassword);

module.exports = router;
