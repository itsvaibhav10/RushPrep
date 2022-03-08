// ---------------   Models  ---------------
const User = require('../models/user');

// ---------------   Module Imports  ---------------
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const fetch = require('node-fetch');
const { stringify } = require('querystring');

// ---------------   Global Functions  ---------------
const fileHelper = require('../util/file');

// ---------------   Notify User  ---------------
exports.getNotify = (req, res, next) => {
  res.render('auth/notify', {
    path: '/notify',
    pageTitle: 'Notification',
  });
};

// ---------------   User Signup Operations  ---------------

exports.getSignup = async (req, res, next) => {
  try {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput: {
        name: '',
        email: '',
        mobno: '',
        password: '',
        confirmPassword: '',
      },
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const name = req.body.name.toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = req.body.password.toLowerCase();
    const errors = validationResult(req);
    let token;
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: true,
        dataEntered: false,
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name: name,
          email: email,
          password: password,
          confirmPassword: req.body.confirmPassword,
        },
      });
    }

    // Token Generation
    crypto.randomBytes(32, (err, buffer) => {
      token = buffer.toString('hex');
    });
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      // cart: { items: [] },
      activationToken: token,
    });
    const user = await newUser.save();
    res.status(200).json({
      success: true,
      dataEntered: true,
      activationToken: user.activationToken,
    });
    const from = 'GradePrime.com<info@gradeprime.com>',
      to = user.email,
      subject = 'Verify Email !',
      content = `<!DOCTYPE html>
    <html>
    <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style type="text/css">
        /* FONTS */
        @import url('https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i');
    
        /* CLIENT-SPECIFIC STYLES */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
    
        /* RESET STYLES */
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
    
        /* MOBILE STYLES */
        @media screen and (max-width:600px){
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }
    
        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] { margin: 0 !important; }
    </style>
    </head>
    <body style="background-color: #f3f5f7; margin: 0 !important; padding: 0 !important;">
    
    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Poppins', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        We're thrilled to have you here! Get ready to dive into your new account.
    </div>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td align="center">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 0px 10px;">
                            <a href="#" target="_blank" style="text-decoration: none;">
                  <span style="display: block; font-family: 'Poppins', sans-serif; color: #69cce0; font-size: 36px;" border="0"><b>GradePrime</b></span>
                            </a>
                        </td>
                    </tr>
            <tr>
                        <td align="center" valign="middle" style="padding: 10px 10px 40px 10px;">
                            <p style="margin: 0;font-family: 'Poppins', sans-serif;">
                  <a href="#" target="_blank" style="color: #3b5998; font-weight: 700; text-decoration: none;">Facebook</a> -
                  <a href="#" target="_blank" style="color: #1da1f2; font-weight: 700; text-decoration: none;">Twitter</a> -
                  <a href="#" target="_blank" style="color: #dd4b39; font-weight: 700; text-decoration: none;">Google+</a>
                </p>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- HERO -->
        <tr>
            <td align="center" style="padding: 0px 10px 0px 10px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Poppins', sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 2px; line-height: 48px;">
                          <h1 style="font-size: 36px; font-weight: 600; margin: 0;">Hi! ${user.name}</h1>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- COPY BLOCK -->
        <tr>
            <td align="center" style="padding: 0px 10px 0px 10px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <!-- COPY -->
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                    </td>
                  </tr>
                  <!-- BULLETPROOF BUTTON -->
                  <tr>
                    <td bgcolor="#ffffff" align="left">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 30px 30px;">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                  <td align="center" style="border-radius: 3px;" bgcolor="#05b085"><a href="https://gradeprime.com/verify/${user.activationToken}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 12px 50px; border-radius: 2px; border: 1px solid #05b085; display: inline-block;">Confirm Account</a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>                          
                  <!-- COPY -->
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: &apos;Lato&apos;, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                    </td>
                  </tr>
                  <!-- COPY -->
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 0px 0px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">Cheers,<br>Team</p>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- SUPPORT CALLOUT -->
        <tr>
            <td align="center" style="padding: 10px 10px 0px 10px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <!-- HEADLINE -->
                    <tr>
                      <td bgcolor="#05b085" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                        <h2 style="font-size: 16px; font-weight: 400; color: #ffffff; margin: 0;">Need more help?</h2>
                        <p style="margin: 0; font-size: 14px;"><a href="#" target="_blank" style="color: #ffffff;">We&rsquo;re here, ready to talk</a></p>
                      </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>   
    </table>
    </body>
    </html>
    `;
    // Mailing ActivationToken to User
    fileHelper.sendMail(from, to, subject, content);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// ---------------   User Login Operations  ---------------
exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    },
    activationToken: '',
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password.toLowerCase();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
        },
        activationToken: '',
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'User Not Found Please Check Entered Email',
        oldInput: {
          email: email,
          password: password,
        },
        activationToken: '',
      });
    } else {
      if (user.emailVerify !== true) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Email Not Verifed Check Ur Inbox ',
          oldInput: {
            email: email,
            password: password,
          },
          activationToken: user.activationToken,
        });
      } else {
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            if (user.isAdmin) return res.redirect('/admin');
            return res.redirect('/home');
          });
        }
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          activationToken: '',
          errorMessage: 'Invalid Password.',
          oldInput: {
            email: email,
            password: password,
          },
        });
      }
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.EmailResend = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ activationToken: token });  
    if (!user) return res.redirect('/home');
    const from = 'GradePrime.com<info@gradeprime.com>',
      to = user.email,
      subject = 'Verify Email !',
      content = `<!DOCTYPE html>
    <html>
    <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style type="text/css">
        /* FONTS */
        @import url('https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i');
    
        /* CLIENT-SPECIFIC STYLES */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
    
        /* RESET STYLES */
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
    
        /* MOBILE STYLES */
        @media screen and (max-width:600px){
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }
    
        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] { margin: 0 !important; }
    </style>
    </head>
    <body style="background-color: #f3f5f7; margin: 0 !important; padding: 0 !important;">
    
    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Poppins', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        We're thrilled to have you here! Get ready to dive into your new account.
    </div>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td align="center">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 0px 10px;">
                            <a href="#" target="_blank" style="text-decoration: none;">
                  <span style="display: block; font-family: 'Poppins', sans-serif; color: #69cce0; font-size: 36px;" border="0"><b>GradePrime</b></span>
                            </a>
                        </td>
                    </tr>
            <tr>
                        <td align="center" valign="middle" style="padding: 10px 10px 40px 10px;">
                            <p style="margin: 0;font-family: 'Poppins', sans-serif;">
                  <a href="#" target="_blank" style="color: #3b5998; font-weight: 700; text-decoration: none;">Facebook</a> -
                  <a href="#" target="_blank" style="color: #1da1f2; font-weight: 700; text-decoration: none;">Twitter</a> -
                  <a href="#" target="_blank" style="color: #dd4b39; font-weight: 700; text-decoration: none;">Google+</a>
                </p>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- HERO -->
        <tr>
            <td align="center" style="padding: 0px 10px 0px 10px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Poppins', sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 2px; line-height: 48px;">
                          <h1 style="font-size: 36px; font-weight: 600; margin: 0;">Hi! ${user.name}</h1>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- COPY BLOCK -->
        <tr>
            <td align="center" style="padding: 0px 10px 0px 10px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <!-- COPY -->
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                    </td>
                  </tr>
                  <!-- BULLETPROOF BUTTON -->
                  <tr>
                    <td bgcolor="#ffffff" align="left">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 30px 30px;">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                  <td align="center" style="border-radius: 3px;" bgcolor="#05b085"><a href="https://gradeprime.com/verify/${user.activationToken}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 12px 50px; border-radius: 2px; border: 1px solid #05b085; display: inline-block;">Confirm Account</a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>                          
                  <!-- COPY -->
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: &apos;Lato&apos;, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                    </td>
                  </tr>
                  <!-- COPY -->
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 0px 0px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">Cheers,<br>Team</p>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- SUPPORT CALLOUT -->
        <tr>
            <td align="center" style="padding: 10px 10px 0px 10px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <!-- HEADLINE -->
                    <tr>
                      <td bgcolor="#05b085" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                        <h2 style="font-size: 16px; font-weight: 400; color: #ffffff; margin: 0;">Need more help?</h2>
                        <p style="margin: 0; font-size: 14px;"><a href="#" target="_blank" style="color: #ffffff;">We&rsquo;re here, ready to talk</a></p>
                      </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>   
    </table>
    </body>
    </html>
    `;

    // Mailing ActivationToken to User
    fileHelper.sendMail(from, to, subject, content);
    res.redirect('/notify');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// ---------------   Logout User Function  ---------------
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/home');
  });
};

// ---------------   Verify User Email  ---------------
exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ activationToken: token });    
    if (!user) {
      res.redirect('/home');
    }
    user.activationToken = undefined;
    user.emailVerify = true;
    await user.save();
    res.redirect('/login');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// ---------------   User Password Resetting  ---------------
exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    let token = null;
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        return res.redirect('/reset');
      }
      token = buffer.toString('hex');
    });
    const user = await User.findOne({
      email: email,
      activationToken: { $exists: false },
    });
    if (!user) {
      req.flash('error', 'No account with that email found.');
      return res.redirect('/reset');
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    const result = await user.save();
    res.redirect('/home');
    const content = `<!DOCTYPE html>
<html>
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<style type="text/css">
/* FONTS */
@import url('https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i');

/* CLIENT-SPECIFIC STYLES */
body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
img { -ms-interpolation-mode: bicubic; }

/* RESET STYLES */
img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
table { border-collapse: collapse !important; }
body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

/* iOS BLUE LINKS */
a[x-apple-data-detectors] {
    color: inherit !important;
    text-decoration: none !important;
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
}

/* MOBILE STYLES */
@media screen and (max-width:600px){
    h1 {
        font-size: 32px !important;
        line-height: 32px !important;
    }
}

/* ANDROID CENTER FIX */
div[style*="margin: 16px 0;"] { margin: 0 !important; }
</style>
</head>
<body style="background-color: #f3f5f7; margin: 0 !important; padding: 0 !important;">

<!-- HIDDEN PREHEADER TEXT -->
<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Poppins', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
We're thrilled to have you here! Get ready to dive into your new account.
</div>

<table border="0" cellpadding="0" cellspacing="0" width="100%">
<!-- LOGO -->
<tr>
    <td align="center">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
                <td align="center" valign="top" style="padding: 40px 10px 0px 10px;">
                    <a href="#" target="_blank" style="text-decoration: none;">
          <span style="display: block; font-family: 'Poppins', sans-serif; color: #69cce0; font-size: 36px;" border="0"><b>Gradeprime</b></span>
                    </a>
                </td>
            </tr>
    <tr>
                <td align="center" valign="middle" style="padding: 10px 10px 40px 10px;">
                    <p style="margin: 0;font-family: 'Poppins', sans-serif;">
          <a href="#" target="_blank" style="color: #3b5998; font-weight: 700; text-decoration: none;">Facebook</a> -
          <a href="#" target="_blank" style="color: #1da1f2; font-weight: 700; text-decoration: none;">Twitter</a> -
          <a href="#" target="_blank" style="color: #dd4b39; font-weight: 700; text-decoration: none;">Google+</a>
        </p>
                </td>
            </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
    </td>
</tr>
<!-- HERO -->
<tr>
    <td align="center" style="padding: 0px 10px 0px 10px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #ef483e; font-family: 'Poppins', sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 2px; line-height: 48px;">
                  <h1 style="font-size: 36px; font-weight: 600; margin: 0;">Trouble signing in?</h1>
                </td>
            </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
    </td>
</tr>
<!-- COPY BLOCK -->
<tr>
    <td align="center" style="padding: 0px 10px 0px 10px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <!-- COPY -->
          <tr>
            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">There is a request to change your password. Resetting your password is easy. Just press the button below and follow the instructions. We'll have you up and running in no time.</p>
            </td>
          </tr>
          <!-- BULLETPROOF BUTTON -->
          <tr>
            <td bgcolor="#ffffff" align="left">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                          <td align="center" style="border-radius: 3px;" bgcolor="#ef483e"><a href="https://gradeprime.com/reset/${token}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 12px 50px; border-radius: 2px; border: 1px solid #ef483e; display: inline-block;">Reset Password</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- COPY -->
          <tr>
            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #aaaaaa; font-family: &apos;Lato&apos;, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0; text-align: center;">If you did not make this request, just ignore this email. Otherwise, pleas click button above to change your password.</p>
            </td>
          </tr>
          <!-- COPY -->
          <tr>
            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 0px 0px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">Cheers,<br>Team</p>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
    </td>
</tr>
<!-- SUPPORT CALLOUT -->
<tr>
    <td align="center" style="padding: 10px 10px 0px 10px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <!-- HEADLINE -->
            <tr>
              <td bgcolor="#05b085" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                <h2 style="font-size: 16px; font-weight: 400; color: #ffffff; margin: 0;">Need more help?</h2>
                <p style="margin: 0; font-size: 14px;"><a href="#" target="_blank" style="color: #ffffff;">We&rsquo;re here, ready to talk</a></p>
              </td>
            </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
    </td>
</tr>    
</table>

</body>
</html>`,
      from = 'GradePrime.com<info@gradeprime.com>',
      to = req.body.email,
      subject = 'Password reset';

    fileHelper.sendMail(from, to, subject, content);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getNewPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const newPassword = req.body.password.toLowerCase();
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    const result = await user.save();
    res.redirect('/login');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
