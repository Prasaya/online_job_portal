# syntax=docker/dockerfile:1
FROM node:current
WORKDIR /
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
CMD ["yarn", "run", "start"]
EXPOSE 3000

