var TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TELEGRAM_TOKEN || '361031563:AAFln9GZdpowS9yQEdbYwQVZUGu-wug9aYA';
const options = {
  webHook: {
    port: process.env.PORT
  }
};
const url = process.env.APP_URL || 'https://myshiftsbot.herokuapp.com/:443';
const bot = new TelegramBot(TOKEN, options);
bot.setWebHook(`${url}/bot${TOKEN}`);
var shift = require('./shifts');

bot.onText(/\/today/, function (msg, match) {

    var chatId = msg.chat.id,
        msg_date = new Date(msg.date*1000+18000000),
    	text = 'Сегодня Нурич '+shift.nurich(new Date(msg_date))+', а папа '+shift.papa(new Date(msg_date));

    bot.sendMessage(chatId, text);

    var sender_info = msg.from.first_name+' '+msg.from.last_name+' in ';
    sender_info = msg.chat.type == "group" ? sender_info + msg.chat.title : sender_info + 'private chat';

    console.log('command /today from '+sender_info+' at '+msg_date);
});

bot.onText(/\/date/, function (msg, match) {

    var chatId = msg.chat.id,
    	text = 'Введите дату в формате dd.MM.yyyy';

    bot.sendMessage(chatId, text);

    var sender_info = msg.from.first_name+' '+msg.from.last_name+' in ';
    sender_info = msg.chat.type == "group" ? sender_info + msg.chat.title : sender_info + 'private chat';

    console.log('command /date from '+sender_info);
});

bot.onText(/^\d{1,2}\.\d{1,2}\.\d{1,4}$/, function (msg, match) {

    var chatId = msg.chat.id,
    	date = match[0],
    	nurich = shift.nurich(date),
    	papa = shift.papa(date),
    	text = (typeof nurich != 'undefined') ? date+' Нурич '+nurich+', а папа '+papa : 'Неверная дата';

    bot.sendMessage(chatId, text);

    var sender_info = msg.from.first_name+' '+msg.from.last_name+' in ';
    sender_info = msg.chat.type == "group" ? sender_info + msg.chat.title : sender_info + 'private chat';

    console.log('command '+date+' from '+sender_info);
});

bot.onText(/\/help/, function (msg, match) {

    var chatId = msg.chat.id,
    	text = 'Этот бот позволяет узнать смену Нурича и папы на сегодня или на конкретную дату.'+'\r\n'+
    			'/today - узнать смену на сегодня'+'\r\n'+
    			'/date - по сути позволяет узнать формат вводимой даты. Дату можно ввести и без этой команды.'+'\r\n'
    			+'Валидный формат dd.MM.yyyy';

    bot.sendMessage(chatId, text);

    var sender_info = msg.from.first_name+' '+msg.from.last_name+' in ';
    sender_info = msg.chat.type == "group" ? sender_info + msg.chat.title : sender_info + 'private chat';
    
    console.log('command /help from '+sender_info);
});

//console.log('nurich '+shift.nurich(new Date()));
//console.log('papa '+shift.papa(new Date()));