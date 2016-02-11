/**
 * epfl-people.js
 *
 * Grabs data from people.epfl.ch (formally ldap.epfl.ch)
 **/

var request = require('request');
var moment = require('moment');


module.exports.chatCmds = {
    "/sciper": function (bot, chatId, msg, args) {
        console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for " + args[0]);
        if (typeof args[1] === 'undefined') {
            bot.sendMessage(chatId, 'Please specify the sciper number, e.g. /sciper 169419');
        }
        var sciper = parseInt(args[1]);
        if (isNaN(sciper) || args[1].length != 6) {
            //debug('Please provide a valid sciper number !');
            bot.sendMessage(chatId, 'Please specify a valid sciper number, e.g. /sciper 169419');
        } else {
            //debug('sciper is defined');
            console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for " + args[0]+ " " + args[1]);
            bot.sendMessage(chatId, 'WORK IN PROGRESS..... \nShowing infos for sciper ' + sciper + ':\nNicolas Borboen\nSciper: 169419');
        }
    },
    "/getimg":  function (bot, chatId, msg, args) {
        console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for " + args[0]);
        if (typeof args[1] === 'undefined') {
            bot.sendMessage(chatId, 'Please specify the sciper number, e.g. /sciper 169419');
        }

        var sciper = parseInt(args[1]);
        if (isNaN(sciper) || args[1].length != 6) {
            bot.sendMessage(chatId, 'Please specify a valid sciper number, e.g. /sciper 169419');
        } else {
            console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " ask for " + args[0] + " " + args[1]);
            bot.sendMessage(chatId, '⌛ Getting image for ' + sciper);

            var url = 'http://people.epfl.ch/cgi-bin/people/getPhoto?id=' + sciper;

            request({url: url, encoding: null}, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    //console.log(response.headers['content-type']); //'content-type': 'image/jpeg'

                    if (response.headers['content-type'] == 'image/jpeg') {
                        // TODO: stop calling private API. But then, how do we construct a stream
                        // that has the data, and is acccepted bz .sendPhoto?!
                        //                        bot.sendPhoto(chatId, body, {"caption": "I'm a cat!"}); return;
                        bot._request('sendPhoto', {
                            qs: {"caption": "This is not a cat!", "chat_id": chatId},
                            formData: {
                                photo: {
                                    value: body,
                                    options: {filename: args[1] + "_photo.jpg", "contentType": "image/jpeg"}
                                }
                            }
                        });

                    } else {

                        console.log(moment().format('YYYY-MM-DD hh:mm:ss') + " " + msg.from.username + " get no photo for " + sciper);
                        bot.sendMessage(chatId, '☹ sorry no photo found for ' + sciper);

                    }

                }
            });
        }
    }
};