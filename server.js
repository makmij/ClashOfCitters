const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

// Безопасно получаем токен из переменных окружения Vercel
const token = process.env.TELEGRAM_TOKEN;

// Для Vercel мы выключаем polling (polling: false)
const bot = new TelegramBot(token, { polling: false });

const app = express();
app.use(express.json()); // Обязательно для парсинга запросов от Telegram

// Раздача папки с игрой (index.html должен лежать в папке public)
app.use(express.static(path.join(__dirname, 'public')));

// URL вашей игры (Vercel сам подставит домен вашего сайта в переменную VERCEL_URL)
const GAME_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/index.html` 
  : 'https://your-domain.com'; // Запасной вариант

// Секретный маршрут, куда Telegram будет присылать сообщения пользователей
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Логика команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🎮 Добро пожаловать в Critters Pinball! Нажмите кнопку ниже для запуска:", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🎰 Играть в Пинбол",
                        web_app: { url: GAME_URL }
                    }
                ]
            ]
        }
    });
});

// Экспортируем приложение для работы в режиме Serverless на Vercel
module.exports = app;
