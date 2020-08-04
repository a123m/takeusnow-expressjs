const nodemailer = require('nodemailer');

module.exports = class Mailer {
  static async resetPassword(email, token, payload) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'mail.sourcesoftsolutions.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'developers@sourcesoftsolutions.com', // generated ethereal user
        pass: 'developers!pass@345', // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: '"Do not reply" <support@snaplancing.com>', // sender address
      to: email, // list of receivers
      subject: 'Re-set your password', // Subject line
      // text: "Hi this is your reset password link", // plain text body
      html:
        'This is your password reset link, Click here to reset your password :<a href="http://snaplancing/resetpassword/' +
        payload.id +
        '/' +
        token +
        '">Reset password</a>', // html body
    });

    return info;
  }
};
