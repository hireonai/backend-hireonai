const nodemailer = require("nodemailer");
const env = require("../configs/env.config");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    type: "login",
    user: env.smptUser,
    pass: env.smptPass,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `${env.appName} <${env.smptUser}>`,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
};
