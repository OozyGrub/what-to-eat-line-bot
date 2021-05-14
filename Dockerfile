FROM node:12.19.0-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

CMD [ "yarn", "start" ]
