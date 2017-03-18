'use strict';
var nodemailer = require('nodemailer');
var user = require('../models/user.js');
var token = require('../models/token.js');
var config = require('../config.json');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: config.CustomerServiceEmail.service,
  auth: {
    user: config.CustomerServiceEmail.account,
    pass: config.CustomerServiceEmail.password
  }
});

exports.buildResetRequest = function (req, res) {
  var email = req.body.email;
  var clientId = req.body.clientId;
  user.findOne({
    where: {
      email: email
    }
  })
    .then(function (users) {
      if (users) {
        var code = sendEmail(users.email, users.username);
        token.create({
          value: code,
          clientId: clientId,
          userId: users.id
        })
          .then(function (tokens) {
            res.status(200).json({
              status: 'success',
              message: 'Email Sent'
            });

            setTimeout(function () {
              tokens.destroy();
            }, 600000);
          })
          .catch(function (err) {
            if (err) {
              console.log(err);
            }
          });
      } else {
        res.status(404).json({
          status: 'fail',
          message: 'Email Not Found'
        });
      }
    });

};

/**
 * Send Verification Code to the specified email
 */
function sendEmail(email, username, code) {
  var verificationCode = uid(5);
  // var text = getText(verificationCode, users.username);
  var text = getText(verificationCode, username);
  // setup email data with unicode symbols
  var mailOptions = {
    from: '"Movie Pigeon Customer Service" <cs@movie-pigeon.com>', // sender address
    to: email, // list of receivers
    subject: '[Movie Pigeon] Reset Password', // Subject line
    text: text, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  return verificationCode;
}

/**
 *  Generate the text body in the email with given verificationCode
 */
function getText(code, username) {
  var text = 'Hi ' + username + ',\r\n\r\n' +
    'You are receiving this email because you requested a password reset for your MoviePigeon account.\r\n\r\n' +
    'If you did not request this change, you can safely ignore this email. \r\n\r\n' +
    'To choose a new password and complete your request, please copy the following verification code to your app\r\n\r\n' +
    code + '\r\n\r\n' +
    'Cheers, \r\n' +
    'The MoviePigeon Team';
  return text;
}

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
function uid(len) {
  var buf = [];
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
}

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
