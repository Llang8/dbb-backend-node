const Bot = require('./bot');
const firebase = require('firebase');
const express = require('express');
const config = require('../config');
const app = express();
const port = 8000;

var botList = [];

firebase.initializeApp(config.firebase);

app.get('/startBot/:userId/:botName', function(req, res) {
    firebase.database().ref('/users/' + req.params.userId + '/bots/' + req.params.botName).once('value').then(function(snapshot) {
        var newBot = new Bot(snapshot.val());
        botList.push({bot: newBot, userId: req.params.userId, botName: req.params.botName});
        newBot.login();
        res.send = 'Bot logged in'
    });
});

app.get('/stopBot/:userId/:botName', function(req, res) {
    // Get the bot with passed attributes
    var bot = botList.filter(function(bot) {
        return (bot.userId === req.params.userId) && (bot.botName === req.params.botName) 
    });
    if ( bot.length == 0) {
        res.send = 'The bot you are looking for was not found'
    } else {
        // Log out each bot that matches the passed attributes (In case of duplicates??)
        bot.forEach((element) => {
            element.bot.logout();
        });
        res.send = 'Bot(s) logged out.'
    }
})

app.listen(port, () => {
    console.log('Server running on port: ' + port);
});