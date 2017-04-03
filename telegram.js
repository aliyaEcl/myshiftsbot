var TelegramBot = require('node-telegram-bot-api');
var fs=require('fs');
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

bot.onText(/\/period/, function (msg, match) {

    var chatId = msg.chat.id,
        text = 'Введите период в формате dd.MM.yyyy-dd.MM.yyyy, не более 31 дня.';

    bot.sendMessage(chatId, text);

    var sender_info = msg.from.first_name+' '+msg.from.last_name+' in ';
    sender_info = msg.chat.type == "group" ? sender_info + msg.chat.title : sender_info + 'private chat';

    console.log('command /period from '+sender_info);
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

bot.onText(/^\d{1,2}\.\d{1,2}\.\d{1,4}-\d{1,2}\.\d{1,2}\.\d{1,4}$/, function (msg, match) {
    var dates = match[0].split('-');
    var date1 = new Date(shift.convertDate(dates[0])),
        date2 = new Date(shift.convertDate(dates[1]));

    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Бригада Нурича', callback_data: match[0]+'-1' }],
                [{ text: 'Бригада папы', callback_data: match[0]+'-2' }]
            ]
        })
    };

    if ((date2 - date1)/86400000 > 31) {
        bot.sendMessage(msg.chat.id, 'Период должен быть не более 31 дня');
    } else
        if (date1>date2) {
            bot.sendMessage(msg.chat.id, 'Неверный период. Начальная дата должна быть раньше конечной');
        } else
            if ((date2 - date1)/86400000 < 2) {
                bot.sendMessage(msg.chat.id, 'Период должен быть более 1 дня. Чтобы узнать смену на конкретную дату, воспользуйтесь командой /date');
            } else
                if (date1 == 'Invalid Date' || date2 == 'Invalid Date') {
                    bot.sendMessage(msg.chat.id, 'Неверные даты');
                } else {
                        bot.sendMessage(msg.chat.id, 'Выберите бригаду', options);
                }
});

bot.on('callback_query', function (msg) {

    var chatId = msg.message.chat.id,
        data = msg.data.split('-'),
        file_name = 'shifts.txt',
        doc = `${__dirname}/`+file_name;

    var isNurich = (data[2]=='1') ? true : false;

    var name = isNurich ? 'Нурича' : 'папы';

    shift.createDoc(file_name, data[0], data[1], isNurich);

    bot.sendDocument(chatId,doc,{
        caption: 'график '+name+' на '+data[0]+'-'+data[1]
    });
});

bot.onText(/\/help/, function (msg, match) {

    var chatId = msg.chat.id,
    	text = 'Этот бот позволяет узнать смену Нурича и папы на сегодня или на конкретную дату.'+'\r\n'+
    			'/today - узнать смену на сегодня'+'\r\n'+
    			'/date - по сути позволяет узнать формат вводимой даты. Дату можно ввести и без этой команды. '
                +'Валидный формат dd.MM.yyyy'+'\r\n'+
                '/period - по сути позволяет узнать формат вводимого периода. Период можно ввести и без этой команды. '
    			+'Валидный формат dd.MM.yyyy-dd.MM.yyyy. Период должен быть не более 31 дня.';

    bot.sendMessage(chatId, text);

    var sender_info = msg.from.first_name+' '+msg.from.last_name+' in ';
    sender_info = msg.chat.type == "group" ? sender_info + msg.chat.title : sender_info + 'private chat';
    
    console.log('command /help from '+sender_info);
});

//console.log('nurich '+shift.nurich(new Date()));
//console.log('papa '+shift.papa(new Date()));