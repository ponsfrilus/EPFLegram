# docker build -t epflsti/epflegram .
# docker run -e "TELEGRAM_BOT_TOKEN=xxxxxxxxxxxxx" epflsti/epflegram

FROM node:4.1.1
MAINTAINER Nicolas Borboën <nicolas.borboen@epfl.ch>

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
