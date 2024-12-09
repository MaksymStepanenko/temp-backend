const admin = require("firebase-admin");
const serviceAccount = require("./config/gots-label-firebase-adminsdk-qh6u0-e99d58b75e.json"); // Шлях до твого JSON-файлу

// Ініціалізація Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "gots-label.firebaseapp.com", // URL твоєї бази даних
});

const db = admin.firestore();
module.exports = { db };
