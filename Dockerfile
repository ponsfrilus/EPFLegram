# docker build -t epflsti/epflegram .
# docker run -e "TELEGRAM_BOT_TOKEN=xxxxxxxxxxxxx" epflsti/epflegram

FROM node:5.3.0
MAINTAINER Nicolas Borboën <nicolas.borboen@epfl.ch>

# Swagg for test
COPY ./media/bot.gif /app/epflegram//media/bot.gif
COPY ./media/cat.gif /app/epflegram//media/cat.gif

# Bundle app source
COPY ./index.js /app/epflegram/index.js
COPY ./epfl-menu.js /app/epflegram/epfl-menu.js
COPY ./epfl-metro.js /app/epflegram/epfl-metro.js
COPY ./epfl-people.js /app/epflegram/epfl-people.js
COPY ./package.json /app/epflegram/package.json

# Install app dependencies
RUN cd /app/epflegram; npm install

WORKDIR /app/epflegram
CMD ["npm", "start"]
