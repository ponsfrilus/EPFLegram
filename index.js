var TelegramBot = require('node-telegram-bot-api');
var people = require('./epfl-people.js');
var restau = require('./epfl-menu.js');
var metro = require('./epfl-metro.js');
var onetwothreefour = require('./epfl-1234.js');
var heredoc = require('heredoc');
var request = require('request');
var moment = require('moment');
var stream = require('stream');
var merge = require("merge");
var http = require("http");
var fs = require('fs');

/* Preparing the telegram bot */
var token = process.env.TELEGRAM_BOT_TOKEN || 'Set your TOKEN HERE';

var bot = new TelegramBot(token, {polling: true});
/* Merging all included epfl-* file */
var clients1234 = [];

var chatId =  process.env["TARGET_GROUP_CHAT_ID"];


var allFuncs = merge(people.chatCmds, metro.chatCmds, restau.chatCmds);
bot.getMe().then(function (me) {
    var EPFLegramAscii = heredoc(function () {/*
     -------------------------------------------------------------
      _________________ _
     |  ___| ___ \  ___| |
     | |__ | |_/ / |_  | |     ___  __ _ _ __ __ _ _ __ ___
     |  __||  __/|  _| | |    / _ \/ _` | '__/ _` | '_ ` _ \
     | |___| |   | |   | |___|  __/ (_| | | | (_| | | | | | |
     \____/\_|   \_|   \_____/\___|\__, |_|  \__,_|_| |_| |_|
        a Telegram bot for EPFL     __/ |
      http://go.epfl.ch/EPFLegram  |___/
     -------------------------------------------------------------
     */});
    console.log(EPFLegramAscii);
    console.log('Hello on %s! Please have fun!', me.username);
});


function broadcastNews(news) {
    bot.sendMessage(chatId, news);
}
// onetwothreefour.poll(broadcastNews);
var nombresADeviner = {};
function choisirUnNouveauNombre(user) {
    nombresADeviner[user] = Math.floor((Math.random() * 100) + 1);
    console.log(nombresADeviner[user]);
}

bot.on('text', function (msg) {
    var chatId = msg.chat.id;
    var args = msg.text.split(' ');
    
    msg.reply = function sendReply(msgcontent) {
        bot.sendMessage(chatId, msgcontent, {reply_to_message_id: msg.message_id});
    };

    var behavior = allFuncs[args[0]];
    if (behavior) {
        behavior(bot, chatId, msg, args);
    } else {

        console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for " + args[0]);
        switch (args[0]) {
            case '/audio':
                var url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
                // From HTTP request!
                var audio = request(url);
                bot.sendAudio(chatId, audio);
                break;
            case '/pic':
                var photo = __dirname + '/media/bot.gif';
                bot.sendPhoto(chatId, photo, {caption: "I'm a cool bot!"});
                break;
            case '/cat':
                bot.sendDocument(chatId, request('http://www.catgifpage.com/gifs/318.gif'), {caption: "I'm a [LOL] cat!"});
                break;
            case '/start':
                bot.sendMessage(chatId, 'Welcome 😎! Please have fun!\nAs starter, try the /help command...!');
                break;
            case '/subscribe':
                clients1234.push(chatId);
                break;
            case "/game":
                    var user = msg.from.username;
                    var nombreADeviner = nombresADeviner[user];
                    var unNombre = Number(args[1]);
                function reply(msg) {
                    bot.sendMessage(chatId, "@" + user + ": " + msg);

                }
                    if (unNombre > nombreADeviner) {
                        reply("Trop grand !");
                    } else if (unNombre < nombreADeviner) {
                        reply("Trop petit");
                    } else if (unNombre === nombreADeviner) {
                        reply("Bravo "+user+" ! Gagné ! J'en prepare un autre pour toi ...");
                        choisirUnNouveauNombre(user);
                    } else {
                        reply("Bienvenue dans notre petit jeu ! Choisissez un nombre...");
                        choisirUnNouveauNombre(user);
                    }
                break;
            // METRO
            case 'help':
            case '/help':
                var usage = 'Usage:\n' +
                    '\t\t- /help This output\n' +
                    '\t\t- /menu\n' +
                    '\t\t- /menuAll\n' +
                    '\t\t- /getimg 169419\n' +
                    '\t\t- /sciper 169419\n\n' +
                    'Metro:\n' +
                    '\t\t- /metro\n' +
                    '\t\t- /next\n\n' +
                    'Test:\n' +
                    '\t\t- /cat\n' +
                    '\t\t- /pic\n' +
                    '\t\t- /audio\n' +
                    '\t\t- /subscribe\n' +
                    '\t\t- /love\n\n';
                bot.sendMessage(chatId, usage);
                break;
        }
        if (msg.text == '/test') {
            console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for " + args[0]);
            var download = function (uri, filename, callback) {
                request.head(uri, function (err, res, body) {
                    console.log('content-type:', res.headers['content-type']);
                    console.log('content-length:', res.headers['content-length']);

                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };
            download('http://people.epfl.ch/cgi-bin/people/getPhoto?id=169419', '169419.jpg', function () {
                console.log('done');
            });
        }
        if (msg.text == '/imc') {
            console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for " + args[0]);
            bot.sendMessage(chatId, "What's weight ?");

        } else if (msg.text.startsWith("/imc ")) {
            var elements = msg.text.split(" ");
            var weight = Number(elements[1]);
            var height = Number(elements[2]);
            var age = Number(elements[3]);
            var imc = weight/Math.pow(height/100, 2);    // XXXXXXXXXXXX TODOFIXIT !!11!1!
            bot.sendMessage(chatId, "Your IMC is " + imc);
        }
    }
});
