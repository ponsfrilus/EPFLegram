/**
 * epfl-metro.js
 *
 * Grabs JSON data from transport.opendata.ch
 **/

var moment = require('moment');
var request = require('request');
var debug = require('debug')("epfl-metro.js");

var EPFLMetro = {};
EPFLMetro.msg = '';

function getMetro(url, callback) {
    debug("sendTimeTable " + url);
    request(url, function (error, response, body) {
        debug("request " + url);
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            debug(result);
            EPFLMetro.msg = '';
            for (var i = 1; i <= 4; i++) {
                var nextMetro = result.connections[i - 1].from.departure;
                EPFLMetro.msg += i + ': ' + moment(nextMetro).fromNow() + '\n';
            }
            debug(EPFLMetro.msg);
        } else {
            //bot.sendMessage(msg.chat.id, 'Error getting timetable', opts);
            EPFLMetro.msg = 'Error getting timetable'
        }
        callback(EPFLMetro.msg);
    });
}
var Opts = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['Metro_from_EPFL_to_Lausanne'],
            ['Metro_from_Lausanne_to_EPFL'],
            ['Metro_from_EPFL_to_Renens'],
            ['Metro_from_Renens_to_EPFL']],
        one_time_keyboard: true
    }),
    ForceReply: true
};

function metroMenu(bot, chatId) {
    bot.sendMessage(chatId, 'Where do you want to go?', Opts);
}

module.exports.chatCmds = {
    "/metro": metroMenu,
    "/next": metroMenu,
    'Metro_from_EPFL_to_Lausanne': function (bot, chatId, msg) {
        console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for Metro_from_EPFL_to_Lausanne");
        getMetro('http://transport.opendata.ch/v1/connections?from=EPFL&to=Lausanne', msg.reply);
    },
    'Metro_from_Lausanne_to_EPFL': function (bot, chatId, msg) {
        console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for Metro_from_Lausanne_to_EPFL");
        getMetro('http://transport.opendata.ch/v1/connections?from=Lausanne&to=EPFL', msg.reply);
    },
    'Metro_from_EPFL_to_Renens': function (bot, chatId, msg) {
        console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for Metro_from_EPFL_to_Renens");
        getMetro('http://transport.opendata.ch/v1/connections?from=EPFL&to=Renens', msg.reply);
    },
    'Metro_from_Renens_to_EPFL': function (bot, chatId, msg) {
        console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for Metro_from_Renens_to_EPFL");
        getMetro('http://transport.opendata.ch/v1/connections?from=Renens&to=EPFL', msg.reply);
    }
};