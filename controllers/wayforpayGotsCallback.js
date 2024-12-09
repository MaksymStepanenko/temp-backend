require("dotenv").config();
const crypto = require("crypto");
const axios = require("axios");
const createBotInstance = require("../decorators/bot");

// const filePath = path.join(__dirname, "../decorators/emailOnline.ejs");
// const filePathPL = path.join(__dirname, "../decorators/emailOnlinePL.ejs");
// const filePathEN = path.join(__dirname, "../decorators/emailOnlineEN.ejs");

const secretKey = process.env.wayforpay_password_gots;
const token = process.env.tokenGots;
const chatId = process.env.chatIdGots;
const apiKey = process.env.apiKey;

const bot = createBotInstance(token);

const wayforpayCallbackController = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const decodedData = JSON.parse(body);
    const { orderReference, transactionStatus, amount, currency, email } =
      decodedData;

    const statusTranslations = {
      InProcessing:
        "Замовлення все ще знаходиться в процесі обробки платіжним шлюзом",
      WaitingAuthComplete: "Успішний Hold",
      Approved: "Успішний платіж",
      Pending: "На перевірці Antifraud",
      Expired: "Закінчився термін оплати",
      Refunded: "Повернення",
      Voided: "Повернення",
      Declined: "Відхилений",
      RefundInProcessing: "Повернення в обробці",
    };

    const translatedStatus =
      statusTranslations[transactionStatus] || transactionStatus;

    const telegramPostData = {
      "Номер замовлення": orderReference,
      "Cтатус оплати": translatedStatus,
      Сума: amount,
    };
    const data = telegramPostData;
    function formatJson(jsonData, indent = 0) {
      const indentString = " ".repeat(indent);
      return Object.entries(jsonData)
        .map(([key, value]) => {
          if (typeof value === "object") {
            const nestedObject = formatJson(value, indent + 2);
            return `${indentString}${key}:\n${nestedObject}`;
          } else if (value !== "") {
            return `${indentString}${key}: ${value}`;
          }
          return "";
        })
        .filter(Boolean)
        .join("\n");
    }

    const formattedData = formatJson(data);
    // КОМУ ВІДПРАВЛЯТИ СТАТУС ПЛАТЕЖУ
    // const sendEmailTo = "gotslabel.cooperation@gmail.com";
    const sendEmailTo = "gotslabel.cooperation@gmail.com";

    try {
      // nodemailerSender(formattedData, sendEmailTo);
      bot.sendMessage(chatId, formattedData);
    } catch (error) {
      console.log(error);
    }

    // Робимо запит на KeyCRM API
    // if (transactionStatus === "Approved") {
    //   console.log("зайшли в умову апрувед");
    //   try {
    //     // Отримай посилання на документ по ID (orderId має бути доступним)
    //     const orderRef = db.collection("orders").doc(orderReference);
    //     const orderData = await orderRef.get(); // Отримай дані документа
    //     if (orderData.exists) {
    //       console.log("отримали з фаербейса");
    //       // Отримай всі дані документа
    //       const data = orderData.data();

    //       // Звернися до поля isPaymentAndEmailCompleted
    //       const isPaymentAndEmailCompleted = data.isPaymentAndEmailCompleted;
    //       const personalData = data.personalData;
    //       const productData = data.productData;
    //       const language = data.language;

    //       if (!isPaymentAndEmailCompleted) {
    //         const emailData = {
    //           items: productData, // список товарів
    //           user: personalData,
    //         };
    //         // send email
    //         // HTML вміст для листа з інлайн-стилями
    //         let htmlContent;
    //         let titleMail;
    //         if (language === "uk") {
    //           htmlContent = await ejs.renderFile(filePath, emailData);
    //           titleMail = "Замовлення від GOT'S label";
    //         } else if (language === "pl") {
    //           htmlContent = await ejs.renderFile(filePathPL, emailData);
    //           titleMail = "Zamówienie od GOT'S label";
    //         } else {
    //           htmlContent = await ejs.renderFile(filePathEN, emailData);
    //           titleMail = "Order from GOT'S label";
    //         }

    //         const emailList = [personalData.email];

    //         await nodemailerSender(titleMail, htmlContent, emailList.join(","));
    //         console.log("відправили емейл");
    //         // Оновлюємо документ, додаючи нові дані
    //         await orderRef.set(
    //           { isPaymentAndEmailCompleted: true },
    //           { merge: true }
    //         );

    //         try {
    //           const response = await axios.get(
    //             "https://openapi.keycrm.app/v1/order",
    //             {
    //               headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${apiKey}`,
    //               },
    //               params: {
    //                 limit: 25,
    //               },
    //             }
    //           );

    //           const orders = response.data.data;
    //           const matchingOrder = orders.find(
    //             (order) => order.source_uuid === orderReference
    //           );

    //           if (matchingOrder) {
    //             // Виконати логіку з matchingOrder, наприклад, додати його в telegramPostData
    //             // telegramPostData["Деталі замовлення"] = matchingOrder;

    //             // Виконати POST запит до /order/{id}/payment
    //             const paymentData = {
    //               payment_method: "wayforpay",
    //               amount: amount,
    //               status: "paid",
    //               description: "wayforpay платіж",
    //             };

    //             try {
    //               const paymentResponse = await axios.post(
    //                 `https://openapi.keycrm.app/v1/order/${matchingOrder.id}/payment`,
    //                 paymentData,
    //                 {
    //                   headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${apiKey}`,
    //                   },
    //                 }
    //               );
    //               console.log(
    //                 "Платіж успішно відправлено:",
    //                 paymentResponse.data
    //               );
    //             } catch (paymentError) {
    //               console.error(
    //                 "Помилка при відправці платежу:",
    //                 paymentError.response.data
    //               );
    //             }
    //           } else {
    //             console.log("Замовлення не знайдено.");
    //           }
    //         } catch (error) {
    //           console.error("Помилка при запиті до KeyCRM API:", error);
    //         }
    //       } else {
    //         console.log("Документ не знайдено!");
    //       }
    //     } else {
    //       console.log("данних з фаербейса немає");
    //     }
    //   } catch (error) {
    //     console.log("помилка з фаербейса");
    //     console.error("Помилка оновлення замовлення:", error.message);
    //   }
    // }

    const answer = prepareSignedWebhookResponse(secretKey, orderReference);
    console.log(answer);
    res.send(answer);
  });
};

const prepareSignedWebhookResponse = (merchantSecretKey, orderReference) => {
  const answer = {
    orderReference: orderReference,
    status: "accept",
    time: Date.now(),
    signature: "",
  };
  const forHash = [orderReference, answer.status, answer.time].join(";");
  const hash = crypto
    .createHmac("md5", merchantSecretKey)
    .update(forHash)
    .digest("hex");
  answer.signature = hash;
  return answer;
};

module.exports = wayforpayCallbackController;
