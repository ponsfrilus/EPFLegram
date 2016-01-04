/**
 * epfl-people.js
 *
 * Grabs data from people.epfl.ch (formally ldap.epfl.ch)
 **/

module.exports.chatCmds = {
    "/sciper": function (bot, chatId, msg, args) {
        
        if (typeof args[1] === 'undefined') {
            console.log(msg.from.username + " ask for " + args[0]);
            bot.sendMessage(chatId, 'Please specify the sciper number, e.g. /sciper 169419');
        }
        var sciper = parseInt(args[1]);
        if (isNaN(sciper) || args[1].length != 6) {
            //debug('Please provide a valid sciper number !');
            bot.sendMessage(chatId, 'Please specify a valid sciper number, e.g. /sciper 169419');
        } else {
            console.log(msg.from.username + " ask for " + args[0] + " " + args[1]);
            //debug('sciper is defined');
            bot.sendMessage(chatId, 'Showing infos for sciper ' + sciper + ':\nNicolas Borboen\nSciper: 169419');
        }
    }
};
