var TelegramBot = require('node-telegram-bot-api');
var people = require('./epfl-people.js');
var restau = require('./epfl-menu.js');
var metro = require('./epfl-metro.js');
var stream = require('stream');
var merge = require("merge");
var http = require("http");
var fs = require('fs');

/* Preparing the telegram bot */
var token = process.env.TELEGRAM_BOT_TOKEN || 'SET_YOUR_KEY';
var bot = new TelegramBot(token, {polling: true});

/* Merging all included epfl-* file */
var allFuncs = merge(people.chatCmds, metro.chatCmds, restau.chatCmds);

bot.getMe().then(function (me) {
    console.log('Hello on %s! Please have fun!', me.username);
});
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

        switch (args[0]) {
            case '/getimg':
                console.log(msg.from.username + " ask for " + args[0]);
                //debug(args[1]);
                if (typeof args[1] === 'undefined') {
                    bot.sendMessage(chatId, 'Please specify the sciper number, e.g. /sciper 169419');
                }

                var sciper = parseInt(args[1]);
                if (isNaN(sciper) || args[1].length != 6) {
                    //debug('Please provide a valid sciper number !');
                    bot.sendMessage(chatId, 'Please specify a valid sciper number, e.g. /sciper 169419');
                } else {
                    console.log(msg.from.username + " ask for " + args[0] + " " + args[1]);
                    //debug('sciper is defined');
                    bot.sendMessage(chatId, '⌛ Getting image for ' + sciper);

                    var url = 'http://people.epfl.ch/cgi-bin/people/getPhoto?id=' + sciper;
                    request({url: url, encoding: null}, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            // TODO: stop calling private API. But then, how do we construct a stream
                            // that has the data, and is acccepted bz .sendPhoto?!
                            //                        bot.sendPhoto(chatId, body, {"caption": "I'm a cat!"}); return;
                            bot._request('sendPhoto', {
                                qs: {"caption": "This is not a cat!", "chat_id": chatId},
                                formData: {
                                    photo: {
                                        value: body,
                                        options: {filename: "Male_Burmilla_cat.jpeg", "contentType": "image/jpeg"}
                                    }
                                }
                            });
                        }
                    });
                }
                break;

            case '/audio':
                console.log(msg.from.username + " ask for " + args[0]);
                var url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
                // From HTTP request!
                var audio = request(url);
                bot.sendAudio(chatId, audio);
                break;
            case '/pic':
                console.log(msg.from.username + " ask for " + args[0]);
                var photo = __dirname + '/../media/bot.gif';
                bot.sendPhoto(chatId, photo, {caption: "I'm a cool bot!"});
                break;
            case '/cat':
                console.log(msg.from.username + " ask for " + args[0]);
                // var url = 'http://www.catgifpage.com/gifs/266.gif';
                // var cat = request(url);
                bot.sendDocument(chatId, request('http://www.catgifpage.com/gifs/266.gif'), {caption: "I'm a [LOL] cat!"});
                break;
            case '/start':
                console.log(msg.from.username + " ask for " + args[0]);
                bot.sendMessage(chatId, 'Welcome 😎! Please have fun!\nAs starter, try the /help command...!');
                break;

            // METRO
            case 'help':
            case '/help':
            default:
                console.log(msg.from.username + " ask for " + args[0]);
                var usage = 'Usage:\n' +
                    '\t\t- /help This output\n' +
                    '\t\t- /menu\n' +
                    '\t\t- /menuAll\n' +
                    '\t\t- /getimg 123345\n' +
                    '\t\t- /sciper 123456\n\n' +
                    'Metro:\n' +
                    '\t\t- /metro\n' +
                    '\t\t- /next\n\n' +
                    'Test:\n' +
                    '\t\t- /cat\n' +
                    '\t\t- /pic\n' +
                    '\t\t- /audio\n' +
                    '\t\t- /love\n\n';
                bot.sendMessage(chatId, usage);
                break;
        }
        if (msg.text == '/test') {
            console.log(msg.from.username + " ask for " + args[0]);
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
    }
});
