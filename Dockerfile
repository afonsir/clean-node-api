FROM node:14

WORKDIR /app/src/clean-node-api

COPY ./package.json ./yarn.lock ./

RUN yarn install --production
