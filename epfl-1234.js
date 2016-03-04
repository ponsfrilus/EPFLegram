/**
 * New module.
 */

var moment = require('moment');
var FeedParser = require('feedparser');
var request = require('request');


function getNewNews(done) {

    var parser = require('rss-parser');

    parser.parseURL('http://blogs.epfl.ch/public/export?blog=1234 ', function(err, parsed) {
        console.log(parsed.feed.title);
        parsed.feed.entries.forEach(function(entry) {
            console.log(entry.title + ':' + entry.link);
            done(entry.title);
        })
    });
}

exports.poll = function(broadcastNews) {

    setInterval(function() {
        getNewNews(function (news) {
            broadcastNews(news);
        });
    }, 1000);
};