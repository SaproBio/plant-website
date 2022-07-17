FROM node:16-alpine

WORKDIR /app

COPY . .

RUN yarn

WORKDIR /app/website

RUN yarn

ENV NODE_ENV=production

RUN yarn build

WORKDIR /app/

CMD ["yarn", "start"]