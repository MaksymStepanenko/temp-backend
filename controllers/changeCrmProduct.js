const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.apiKey;

const addCrmProduct = async (req, res) => {
  const data = req.body;
  const getAll = "https://openapi.keycrm.app/v1/products";

  try {
    // Отримуємо всі продукти з CRM
    const response = await axios.get(getAll, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      params: {
        limit: 500,
      },
    });

    const myId = data.sku; // значення SKU з тіла запиту
    const myData = response.data.data; // масив продуктів з CRM

    // Шукаємо продукт за SKU
    const foundItem = myData.find((item) => item.sku === myId);

    if (!foundItem) {
      // Якщо продукт не знайдено
      return res.status(404).json({ message: "Продукт не знайдено" });
    }

    // Якщо продукт знайдено, оновлюємо його за допомогою PUT-запиту
    const apiID = foundItem.id;
    const apiUrl = `https://openapi.keycrm.app/v1/products/${apiID}`;

    try {
      const updateResponse = await axios.put(apiUrl, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      // Відправляємо відповідь з оновленими даними
      return res.status(updateResponse.status).json(updateResponse.data);
    } catch (error) {
      console.error("Помилка при оновленні продукту:", error.message);
      return res
        .status(500)
        .json({ message: "Помилка при оновленні продукту" });
    }
  } catch (error) {
    console.error("Помилка при отриманні продуктів з CRM:", error.message);
    return res
      .status(500)
      .json({ message: "Помилка при отриманні продуктів з CRM" });
  }
};

module.exports = addCrmProduct;
