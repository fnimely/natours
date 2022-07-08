const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // logger: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define the email options
  const mailOptions = {
    from: "Facsimile Doh <dohfacsimile@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.text, // or html
  };

  // send the email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
