const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: false });

const app = express();
app.use(express.json());

// Главная страница: отдаем index.html напрямую из папки public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// То же самое для явного пути /index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка запросов от Telegram бота
app.post(`/bot${token}`, (req, res) => {
    try {
        bot.processUpdate(req.body);
    } catch (err) {
        console.error('Ошибка обработки апдейта бота:', err);
    }
    res.sendStatus(200);
});

// Логика команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    // Ссылка на ваше Mini App, созданное в BotFather
    const appUrl = `https://t.me/BurmaldaPinballbot/myapp`; 

    bot.sendMessage(chatId, "🎮 Добро пожаловать в Critters Pinball! Нажмите кнопку ниже, чтобы запустить приложение:", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🎰 Играть в Пинбол",
                        url: appUrl // Ведёт на ваше Mini App
                    }
                ]
            ]
        }
    });
});

module.exports = app;
