var FeedParser = require('feedparser');
var request = require('request');
var Iconv = require('iconv').Iconv;

function getParams(str) {
    var params = str.split(';').reduce(function (params, param) {
        var parts = param.split('=').map(function (part) { return part.trim(); });
        if (parts.length === 2) {
            params[parts[0]] = parts[1];
        }
        return params;
    }, {});
    return params;
}

function maybeTranslate (res, charset) {
    var iconv;
    // Use iconv if its not utf8 already.
    if (!iconv && charset && !/utf-*8/i.test(charset)) {
        try {
            iconv = new Iconv(charset, 'utf-8');
            //console.log('Converting from charset %s to utf-8', charset);
            iconv.on('error', function (err) {
                res.emit('error', err);
            });
            // If we're using iconv, stream will be the output of iconv
            // otherwise it will remain the output of request
            res = res.pipe(iconv);
        } catch(err) {
            res.emit('error', err);
        }
    }
    return res;
}

var parser = function(url, callback) {
    var options = {
        normalize: false,
        addmeta: true,
        feedurl: url
    };
    var rss = [];

    /* Module Initialize */
    var feedParser, req;
    req = request(url);
    feedParser = new FeedParser([options]);

    /* REQUEST */
    req.on('error', function(err) {
        return callback(null, err);
    });
    req.on('response', function(res) {

        if (res.statusCode !== 200) {
            return this.emit('error', new Error('Bad status code'));
        }
        var charset = getParams(res.headers['content-type'] || '').charset;
        res = maybeTranslate(res, charset);
        return res.pipe(feedParser);
    });

    /* FEEDPARSER */
    feedParser.on('error', function(err) {
        return callback(null, err);
    });
    feedParser.on('readable', function() {
        var item, stream;
        stream = this;
        if (item = stream.read()) {
            return rss.push(item);
        }
    });
    return feedParser.on('end', function() {
        if (rss.length === 0) {
            return callback(null,'no articles');
        }
        return callback(rss);
    });

};


var getMenu = exports.getMenuAsync = function getMenu (done) {

    parser('http://menus.epfl.ch/cgi-bin/rssMenus', function (rss, err) {

        if (err) {
            done(null, err);
            return;
        }
        // console.log(rss);
        var EPFLMenu = {};
        //EPFLMenu.Opts = {};
        EPFLMenu.Opts = {        
            reply_markup: JSON.stringify({
                keyboard: [['/menu']],
                "one_time_keyboard": true
            })
        };
        rss.forEach(function (item) {
            var itemH = item.title.split(':');
            var restau = itemH[0].trim();
            var type = itemH[1].trim();
            if (typeof EPFLMenu[restau] == 'undefined') {
                EPFLMenu[restau] = {};
            }
            EPFLMenu[restau][type] = item.description;
        });
        //console.log(EPFLMenu);
        done(EPFLMenu);
    });

};

var restauOpts = {
    //reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
        keyboard: [['Parmentier', 'BC', "Atlantide", 'Corbusier', 'Vinci']],
        "one_time_keyboard": true
    })
};
var commonRestaurants = {
    'Parmentier': 'Le Parmentier',
    'BC': 'Cafétéria BC', 
    'Atlantide': "L'Atlantide",
    'Corbusier': 'Le Corbusier',
    'Vinci': 'Le Vinci'
};
    

function restoMenu(bot, chatId, msg, args) {
    if (args.length == 1) {
        bot.sendMessage(chatId, 'Name it!', restauOpts);
    } else if (args.length > 1) {
        console.log(msg.from.username + " ask for " + args[1]);
        var currentRestaurant = commonRestaurants[args[1]];
        getMenu(function (menu) {
            var shortMenuEntry = "\n\n# " + currentRestaurant + "\n";
            for (var plats in menu[currentRestaurant]) {
                shortMenuEntry += "\t\t* " + plats + "\n\t\t\t\t* " + menu[currentRestaurant][plats] + "\n";
            }
            bot.sendMessage(chatId, shortMenuEntry, restauOpts);
        });
    }
}

function addRestauShortcut(Cmds, restauName) {
    Cmds[restauName] = Cmds["/" + restauName] =function (bot, chatId, msg, args) {
        restoMenu(bot, chatId, msg, ['', restauName]);
    }
}
module.exports.chatCmds = {
    "/menu": restoMenu,
    "/menuAll": function (bot, chatId, msg, args) {
        console.log(msg.from.username + " ask for " + args[0]);
        getMenu(function (menu) {
            for (var restaurant in menu) {
                // All menus are too long for telegram, set a msg / restaurant
                var shortMenuEntry = "";
                shortMenuEntry += "\n\n# " + restaurant + "\n";
                for (var plats in menu[restaurant]) {
                    shortMenuEntry += "\t\t* " + plats + "\n\t\t\t\t* " + menu[restaurant][plats] + "\n";
                }
                bot.sendMessage(chatId, shortMenuEntry, menu.Opts);
            }
        });
    }
};

Object.keys(commonRestaurants).forEach(function(shortcut) {
    addRestauShortcut(module.exports.chatCmds, shortcut);
});