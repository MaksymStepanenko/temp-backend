const WayForPay = require("../decorators/wayforpay");
require("dotenv").config();
const wayforpay_merchant_account = process.env.wayforpay_account_gots;
const wayforpay_merchant_password = process.env.wayforpay_password_gots;

const wayforpay = new WayForPay(
  wayforpay_merchant_account,
  wayforpay_merchant_password
);

const wayforpayController = async (req, res) => {
  // console.log("controller");
  const data = req.body;
  // console.log("data-pref", data);
  const params = {
    merchantDomainName: "gotslabel.com",
    merchantTransactionSecureType: "AUTO",
    serviceUrl: data.server_url,
    orderReference: data.orderReference,
    orderDate: data.orderDate,
    amount: data.amount,
    currency: data.currency,
    productName: data.productName,
    productPrice: data.productPrice,
    productCount: data.productCount,
    language: data.language,
  };
  // console.log("data-after", params);
  const generatePurchaseUrl = wayforpay.generatePurchaseUrl(params);

  res.send(generatePurchaseUrl);
};

module.exports = wayforpayController;
