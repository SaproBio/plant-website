FROM node:16-alpine

WORKDIR /app

COPY . .

WORKDIR /app/website

RUN yarn

ENV NODE_ENV=production

RUN yarn build

WORKDIR /app/

RUN yarn

CMD ["yarn", "start"]