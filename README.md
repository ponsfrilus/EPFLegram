---
title: EPFLegram
author: Nicolas Borboën <nicolas.borboen@epfl.ch>
date: 2015-09-23
---

<!--
                              EPFLegram README

    pandoc -o README.pdf README.md && xpdf README.pdf
           _________________ _       _____ _____ ______  ___  ___  ___
          |  ___| ___ \  ___| |    _|  ___|  __ \| ___ \/ _ \ |  \/  |
          | |__ | |_/ / |_  | |   (_) |__ | |  \/| |_/ / /_\ \| .  . |
          |  __||  __/|  _| | |     |  __|| | __ |    /|  _  || |\/| |
          | |___| |   | |   | |_____| |___| |_\ \| |\ \| | | || |  | |
          \____/\_|   \_|   \_____(_)____/ \____/\_| \_\_| |_/\_|  |_/
                                                              Have fun.
-->

# EPFLegram
A project to integrate EPFL-API with Telegram, and more. It use Node.js and [yagop's telegram bot api](https://github.com/yagop/node-telegram-bot-api).

![EPFLegram Metro Demo](https://raw.githubusercontent.com/ponsfrilus/EPFLegram/master/media/EPFLegram_metro.gif "EPFLegram Metro Demo")


## Telegram
Telegram Messenger is a free and secure messaging for Android and iOS smartphones. You can send messages, photos, videos and documents to people who are in your phone contacts. The Telegram messaging app is cloud-based and cross-platform app which can be accessed via any device. Telegram messages are heavily encrypted and can self-destruct. The apps uses advance encryption technique and decentralized infrastructure which makes the app as one of the fastest messaging apps available in the market.

## Initialization
1. Install Telegram
1. Contact @BotFather
1. Create a new bot (/newbot)
1. Generate an authorization token (/token)
1. Check the others options with /help, e.g. /setuserpic, /setcommands, /setabouttext

## How To
### Docker way
Pass the authorization token as an environment variable to the docker container:
```
docker run -e "TELEGRAM_BOT_TOKEN=123456789:ABCDEFGHIJKLMOPKRSTUVWXYZ" --name='EPFLegram'  epflsti/epflegram
```
After an `npm install` the docker will execute the `npm start` and run `node index.js` - the telegram polling is up !

### Systemctl
You can run the unit with systemctl (the docker stuff will be done in it)
```
sudo systemctl start EPFLegram.service
```

### Fleetctl
Same with fleetctl :
```
fleetctl start EPFLegram.service
```
### OldTimer way
`node index.js` or `npm start`

## BotFather
* /setcommands  
  /menu - Choose between Parmentier, BC, Atlantide, Corbusier or Vinci menus  
  /menuAll - All EPFL menus  

## ToDo
* [] Logs more (i.e. Metro)
* [] Modulize EPFLFunc
* [] Tests

## EPFL1234
Subscribe to the bot to get alerts from http://blogs.epfl.ch/public/export?blog=1234

## Versions

### 0.0.3
Refactoring (menu, metro and people are now in seperate file). Generic menu call on behaviors. Thanks to [\@domq](https://github.com/domq)

### 0.0.2
Integration of [\@stefanonepa metro api](https://github.com/stefanonepa/nepabot) built on [transport.opendata.ch](http://transport.opendata.ch) 

### 0.0.1
First version with basics commands and tests