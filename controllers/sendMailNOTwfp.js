const ejs = require("ejs");
const { nodemailerSender } = require("../decorators/nodemailerSender");
const path = require("path");
const filePath = path.join(__dirname, "../decorators/emailOnline.ejs");
const filePathPL = path.join(__dirname, "../decorators/emailOnlinePL.ejs");
const filePathEN = path.join(__dirname, "../decorators/emailOnlineEN.ejs");

const sendMailNOTwfp = async (req, res) => {
  const data = req.body;
  const personalData = data.personalData;
  const productData = data.productData;
  const language = data.language;

  const emailData = {
    items: productData, // список товарів
    user: personalData,
  };
  // send email
  // HTML вміст для листа з інлайн-стилями
  let htmlContent;
  let titleMail;
  if (language === "uk") {
    htmlContent = await ejs.renderFile(filePath, emailData);
    titleMail = "Замовлення від GOT'S label";
  } else if (language === "pl") {
    htmlContent = await ejs.renderFile(filePathPL, emailData);
    titleMail = "Zamówienie od GOT'S label";
  } else {
    htmlContent = await ejs.renderFile(filePathEN, emailData);
    titleMail = "Order from GOT'S label";
  }

  const emailList = [personalData.email];

  console.log("email send", emailList);

  // await nodemailerSender(titleMail, htmlContent, emailList.join(", "));

  res.status(200).json({
    message: "OK",
  });
};

module.exports = sendMailNOTwfp;
