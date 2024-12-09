const TelegramBot = require("node-telegram-bot-api");

require("dotenv").config();

const createBotInstance = (token) => {
  return new TelegramBot(token);
};

module.exports = createBotInstance;
