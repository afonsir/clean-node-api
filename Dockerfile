FROM node:14

WORKDIR /app/src/clean-node-api

COPY ./package.json ./yarn.lock ./

RUN yarn install --production

COPY ./dist ./dist

EXPOSE 5000

CMD ["yarn", "start"]
