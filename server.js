const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Отдаем игру index.html из папки public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Роут для бота, переписанный на чистые запросы к API Telegram
app.post(`/bot${process.env.TELEGRAM_TOKEN}`, async (req, res) => {
    const token = process.env.TELEGRAM_TOKEN;
    const update = req.body;

    // Если пользователь прислал текст /start
    if (update.message && update.message.text === '/start') {
        const chatId = update.message.chat.id;
        
        // Ваша ссылка на Mini App от BotFather
        const appUrl = `https://t.me/BurmaldaPinballbot/game`; 

        const messageData = {
            chat_id: chatId,
            text: "🎮 Добро пожаловать в Critters Pinball! Нажмите кнопку ниже, чтобы запустить приложение:",
            reply_markup: {
                inline_keyboard: [[
                    { text: "🎰 Играть в Пинбол", url: appUrl }
                ]]
            }
        };

        // Отправляем сообщение обратно в Telegram через обычный fetch-запрос
        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });
        } catch (e) {
            console.error('Ошибка отправки сообщения:', e);
        }
    }

    res.sendStatus(200);
});

module.exports = app;
