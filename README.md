<!--
                              EPEFegram README

  * simple pandoc:
    pandoc -o README.pdf README.md && xpdf README.pdf
  * pandoc with margin and section:
    pandoc -s -V geometry:margin=1cm --number-sections -o README.pdf README.md && xpdf README.pdf

           _________________ _       _____ _____ ______  ___  ___  ___
          |  ___| ___ \  ___| |    _|  ___|  __ \| ___ \/ _ \ |  \/  |
          | |__ | |_/ / |_  | |   (_) |__ | |  \/| |_/ / /_\ \| .  . |
          |  __||  __/|  _| | |     |  __|| | __ |    /|  _  || |\/| |
          | |___| |   | |   | |_____| |___| |_\ \| |\ \| | | || |  | |
          \____/\_|   \_|   \_____(_)____/ \____/\_| \_\_| |_/\_|  |_/
                                                              Have fun.

-->
---
title: EPFLegram
author: Nicolas Borboën <nicolas.borboen@epfl.ch>
date: 2015-09-23
---

# EPFLegram
A project to integrate EPFL-API with Telegram, and more. It use Node.js and [yagop's telegram bot api](https://github.com/yagop/node-telegram-bot-api).

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

## Ideas
### Metro API
* /metro  
    Gives the next departure to Lausanne from EPFL
* /leave in 20  
    Send a notification 5 minutes before the metro who leave in around 20 minutes.

## BotFather
* /setcommands  
  /menu - Choose between Parmentier, BC, Atlantide, Corbusier or Vinci menus  
  /menuAll - All EPFL menus  

## ToDo
* Tests