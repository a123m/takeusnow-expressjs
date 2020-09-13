const nodemailer = require('nodemailer');

module.exports = class Mailer {
  static async resetPassword(email, token, payload) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'email-smtp.ap-south-1.amazonaws.com',
      port: 465,
      secure: false, // true for 465, false for other ports
      auth: {
        // user: "developers@sourcesoftsolutions.com", // generated ethereal user
        user: 'AKIA53PQ7GZKV3HHUU5D',
        // pass: "developers!pass@345", // generated ethereal password
        pass: 'BJl5tToARVJ5aFsWYHppAXvS746dIKsLfNjLez4U/51I',
      },
    });

    const info = await transporter.sendMail({
      from: '"Do not reply" <support@snaplancing.com>', // sender address
      to: email, // list of receivers
      subject: 'Re-set your password', // Subject line
      // text: "Hi this is your reset password link", // plain text body
      html:
        'This is your password reset link, Click here to reset your password :<a href="http://takeusnow-env.eba-t6vpmtr3.ap-south-1.elasticbeanstalk.com/auth/forget' +
        payload.id +
        '/' +
        token +
        '">Reset password</a>', // html body
    });

    return info;
  }

  static async emailValidation(email, token /*payload*/) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'email-smtp.ap-south-1.amazonaws.com',
      port: 25,
      secure: false, // true for 465, false for other ports
      auth: {
        // user: "developers@sourcesoftsolutions.com", // generated ethereal user
        user: 'AKIA53PQ7GZKV3HHUU5D',
        // pass: "developers!pass@345", // generated ethereal password
        pass: 'BJl5tToARVJ5aFsWYHppAXvS746dIKsLfNjLez4U/51I',
      },
    });
    const info = await transporter.sendMail({
      from: '<snaplancing@gmail.com>', // sender address
      to: 'snaplancing@gmail.com', // list of receivers
      subject: 'Validate your account', // Subject line
      // text: "Hi this is your reset password link", // plain text body
      html:
        'This is your validation link, Click here to validate your account :<a href="http://takeusnow-env.eba-t6vpmtr3.ap-south-1.elasticbeanstalk.com/validation/confirm?' +
        't=' +
        token +
        '">Reset password</a>', // html body
    });
    return info;
  }
};

/*
for kaushalendra
SMTP Username:
AKIA53PQ7GZK2MOV3B7P
SMTP Password:
BNhU3UKUHQnM9NHCKW+C1odc1wBdSRlAkn/an/vhZ8B+
*/
