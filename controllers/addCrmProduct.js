const axios = require("axios");

require("dotenv").config();

const apiUrl = "https://openapi.keycrm.app/v1/products";

const apiKey = process.env.apiKey;

const addCrmProduct = async (req, res) => {
  const data = req.body;

  try {
    // Відправлення POST-запиту на CRM сервіс з доданим API ключем
    const response = await axios.post(apiUrl, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // Відправляємо відповідь з CRM сервісу назад на фронтенд
    res.status(response.status).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка при відправці даних на CRM сервіс" });
  }
};

module.exports = addCrmProduct;
