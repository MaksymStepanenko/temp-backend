const nodemailer = require("nodemailer");
require("dotenv").config();

const gmailAc = process.env.gmailAc;
const gmailPas = process.env.gmailPas;

const nodemailerSender = async (titleMail, htmlContent, email) => {
  let transporter = nodemailer.createTransport({
    service: "gmail", // або інший сервіс
    auth: {
      user: gmailAc, // твій email
      pass: gmailPas, // пароль додатку або API-key
    },
  });
  let mailOptions = {
    from: gmailPas, // від кого (твій email)
    to: email, // кому (email з об'єкта)
    subject: titleMail, // тема листа
    html: htmlContent, // HTML-контент для листа
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("помилка відправки емейж", error.message);
  }
};

module.exports = { nodemailerSender };
