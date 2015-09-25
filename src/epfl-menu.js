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
            console.log('Converting from charset %s to utf-8', charset);
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


module.exports = function(done) {

    parser('http://menus.epfl.ch/cgi-bin/rssMenus', function (rss, err) {

        if (err) {
            done(null, err);
            return;
        }
        // console.log(rss);
        var MyMenu = {};
        rss.forEach(function (item) {
            var itemH = item.title.split(':');
            var restau = itemH[0].trim();
            var type = itemH[1].trim();
            if (typeof MyMenu[restau] == 'undefined') {
                MyMenu[restau] = {};
            }
            MyMenu[restau][type] = item.description;
        });
        //console.log(MyMenu);
        done(MyMenu);
    });

};