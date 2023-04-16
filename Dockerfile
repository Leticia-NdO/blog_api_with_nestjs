FROM node:16

WORKDIR /usr/app/blog_nestjs

COPY ./ .

RUN yarn install --omit=dev