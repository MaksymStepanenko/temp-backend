// readData.js
const { db } = require("../firebase"); // Імпорт Firestore з firebase.js

// Функція для читання всіх даних з колекції orders
const getAllOrders = async (req, res) => {
  try {
    const ordersCollection = await db.collection("orders").get(); // Отримуємо всю колекцію

    if (ordersCollection.empty) {
      return res.status(404).send("Колекція замовлень порожня!");
    } else {
      const orders = [];
      ordersCollection.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return res.status(200).json(orders); // Повертаємо дані у вигляді JSON
    }
  } catch (error) {
    console.error("Помилка читання даних:", error.message);
    return res.status(500).send("Помилка серверу");
  }
};

// Експорт функції
module.exports = { getAllOrders };
