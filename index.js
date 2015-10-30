var TelegramBot = require('node-telegram-bot-api');
var getMenuAsync = require('./epfl-menu.js');
var request = require('request');
var stream = require('stream');
var http = require("http");
var fs = require('fs');
//debug = require("debug")("polling.js"),
//util = require('util'),
var options = {
    polling: true
};
// THIS IS HOW TO GET ENV VAR i.e. THE DOCKER -e OPTIONS :)
// console.log(process.env['HOME']);
var token = process.env.TELEGRAM_BOT_TOKEN || 'SETYOURKEYHERE';
var bot = new TelegramBot(token, options);

var restaurantOpts = {
    reply_markup: JSON.stringify({
        keyboard: [['/menu']],
        "one_time_keyboard": true
    })
};

bot.getMe().then(function (me) {
    console.log('Hello on %s! Please have fun!', me.username);
});
bot.on('text', function (msg) {
    var chatId = msg.chat.id;
    var args = msg.text.split(' ');

    switch (args[0]) {
        case '/sciper':
            console.log(msg.from.username+" ask for "+args[0]);
            if (typeof args[1] === 'undefined') {
                bot.sendMessage(chatId, 'Please specify the sciper number, e.g. /sciper 169419');
            }
            var sciper = parseInt(args[1]);
            if (isNaN(sciper) || args[1].length != 6) {
                //debug('Please provide a valid sciper number !');
                bot.sendMessage(chatId, 'Please specify a valid sciper number, e.g. /sciper 169419');
            } else {
                //debug('sciper is defined');
                bot.sendMessage(chatId, 'Showing infos for sciper ' + sciper + ':\nNicolas Borboen\nSciper: 169419');
            }
            break;
        case '/getimg':
            console.log(msg.from.username+" ask for "+args[0]);
            //debug(args[1]);
            if (typeof args[1] === 'undefined') {
                bot.sendMessage(chatId, 'Please specify the sciper number, e.g. /sciper 169419');
            }

            var sciper = parseInt(args[1]);
            if (isNaN(sciper) || args[1].length != 6) {
                //debug('Please provide a valid sciper number !');
                bot.sendMessage(chatId, 'Please specify a valid sciper number, e.g. /sciper 169419');
            } else {
                console.log(msg.from.username+" ask for "+args[0]+" "+args[1]);
                //debug('sciper is defined');
                bot.sendMessage(chatId, '⌛ Getting image for '+ sciper);

                var url = 'http://people.epfl.ch/cgi-bin/people/getPhoto?id='+sciper;
                request({url: url, encoding: null}, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // TODO: stop calling private API. But then, how do we construct a stream
                        // that has the data, and is acccepted bz .sendPhoto?!
//                        bot.sendPhoto(chatId, body, {"caption": "I'm a cat!"}); return;
                        bot._request('sendPhoto', {qs: {"caption": "This is not a cat!", "chat_id": chatId},
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
        case '/menu':
            console.log(msg.from.username+" ask for "+args[0]);
            // To limit the list, only (my) common restaurant are listed
            // in the same time a "roulottes" menu can be done
            // Full list:
            /*
             La Table de Vallotton
             Maharaja
             Roulotte pizza
             Obeirut Lebanese Cuisine
             Le Parmentier
             Cafétéria MX
             Cafétéria BC
             L'Atlantide
             Hong Thaï Rung
             L'Ornithorynque
             Le Corbusier
             Le Vinci
             Le Copernic
             L'Esplanade
             Kebab
             Le Puur Innovation
             Eurest Neuchâtel
             L'Epicure
             */

            var commonRestaurants = ['Le Parmentier', 'Cafétéria BC', "L'Atlantide", 'Le Corbusier', 'Le Vinci'];
            var opts = {
                //reply_to_message_id: msg.message_id,
                reply_markup: JSON.stringify({
                    keyboard: [['Parmentier', 'BC', "Atlantide", 'Corbusier', 'Vinci']],
                    "one_time_keyboard": true
                })
            };
            bot.sendMessage(chatId, 'Name it!', opts);
            break;
        case 'Parmentier':
        case '/menu Parmentier':
            console.log(msg.from.username+" ask for "+args[0]);
            getMenuAsync(function (menu) {
                var shortMenuEntry = "\n\n# Parmentier\n";
                for (var plats in menu['Le Parmentier']) {
                    shortMenuEntry += "\t\t* " + plats + "\n\t\t\t\t* " + menu['Le Parmentier'][plats] + "\n";
                }
                bot.sendMessage(chatId, shortMenuEntry, restaurantOpts);
            });
            break;
        case 'BC':
        case '/menu BC':
            console.log(msg.from.username+" ask for "+args[0]);
            getMenuAsync(function (menu) {
                var shortMenuEntry = "\n\n# Cafétéria BC\n";
                for (var plats in menu['Cafétéria BC']) {
                    shortMenuEntry += "\t\t* " + plats + "\n\t\t\t\t* " + menu['Cafétéria BC'][plats] + "\n";
                }
                bot.sendMessage(chatId, shortMenuEntry, restaurantOpts);
            });
            break;
        case 'Atlantide':
        case '/menu Atlantide':
            console.log(msg.from.username+" ask for "+args[0]);
            getMenuAsync(function (menu) {
                var shortMenuEntry = "\n\n# L'Atlantide\n";
                for (var plats in menu["L'Atlantide"]) {
                    shortMenuEntry += "\t\t* " + plats + "\n\t\t\t\t* " + menu["L'Atlantide"][plats] + "\n";
                }
                bot.sendMessage(chatId, shortMenuEntry, restaurantOpts);
            });
            break;
        case 'Corbusier':
        case '/menu Corbusier':
            console.log(msg.from.username+" ask for "+args[0]);
            getMenuAsync(function (menu) {
                var shortMenuEntry = "\n\n# Le Corbusier\n";
                for (var plats in menu['Le Corbusier']) {
                    shortMenuEntry += "\t\t* " + plats + "\n\t\t\t\t* " + menu['Le Corbusier'][plats] + "\n";
                }
                bot.sendMessage(chatId, shortMenuEntry, restaurantOpts);
            });
            break;
        case 'Vinci':
        case '/menu Vinci':
            console.log(msg.from.username+" ask for "+args[0]);
            getMenuAsync(function (menu) {
                var shortMenuEntry = "\n\n# Le Vinci\n";
                for (var plats in menu['Le Vinci']) {
                    shortMenuEntry += "\t\t* " + plats + "\n\t\t\t\t* " + menu['Le Vinci'][plats] + "\n";
                }
                bot.sendMessage(chatId, shortMenuEntry, restaurantOpts);
            });
            break;
        case '/menuAll':
            console.log(msg.from.username+" ask for "+args[0]);
            getMenuAsync(function (menu) {
                for (var restaurant in menu) {
                    // All menus are too long for telegram, set a msg / restaurant
                    var shortMenuEntry = "";
                    shortMenuEntry += "\n\n# "+restaurant+"\n";
                    for (var plats in menu[restaurant]) {
                        shortMenuEntry += "\t\t* " + plats + "\n\t\t\t\t* " + menu[restaurant][plats] + "\n";
                    }
                    bot.sendMessage(chatId, shortMenuEntry, restaurantOpts);
                }
            });
            break;
        case '/audio':
            console.log(msg.from.username+" ask for "+args[0]);
            var url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
            // From HTTP request!
            var audio = request(url);
            bot.sendAudio(chatId, audio);
            break;
        case '/pic':
            console.log(msg.from.username+" ask for "+args[0]);
            var photo = __dirname+'/../media/bot.gif';
            bot.sendPhoto(chatId, photo, {caption: "I'm a cool bot!"});
            break;
        case '/cat':
            console.log(msg.from.username+" ask for "+args[0]);
            // var url = 'http://www.catgifpage.com/gifs/266.gif';
            // var cat = request(url);
            bot.sendDocument(chatId, request('http://www.catgifpage.com/gifs/266.gif'), {caption: "I'm a [LOL] cat!"});
            break;
        case '/start':
            console.log(msg.from.username+" ask for "+args[0]);
            bot.sendMessage(chatId, 'Welcome 😎! Please have fun!\nAs starter, try the /help command...!');
            break;
        case 'help':
        case '/help':
        default:
            console.log(msg.from.username+" ask for "+args[0]);
            var usage = 'Usage:\n' +
                '\t\t- /help This output\n' +
                '\t\t- /menu\n' +
                '\t\t- /menuAll\n' +
                '\t\t- /getimg 123345\n' +
                '\t\t- /sciper 123456\n\n' +
                'Test:\n' +
                '\t\t- /cat\n' +
                '\t\t- /pic\n' +
                '\t\t- /audio\n' +
                '\t\t- /love\n\n';
            bot.sendMessage(chatId, usage);
            break;
    }
    if (msg.text == '/test') {
        console.log(msg.from.username+" ask for "+args[0]);
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
});
