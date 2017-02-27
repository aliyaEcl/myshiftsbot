var TelegramBot = require('node-telegram-bot-api');
var token = '361031563:AAFln9GZdpowS9yQEdbYwQVZUGu-wug9aYA';
var bot = new TelegramBot(token, {polling: true});
var shift = require('./shifts');

bot.onText(/\/today/, function (msg, match) {

    var chatId = msg.chat.id,
    	text = 'Сегодня Нурич '+shift.nurich(new Date())+', а папа '+shift.papa(new Date());

    bot.sendMessage(chatId, text);

    var sender_info = msg.from.first_name+' '+msg.from.last_name+' in ';
    sender_info = msg.chat.type == "group" ? sender_info + msg.chat.title : sender_info + 'private chat';

    console.log('command /today from '+sender_info);
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