

FROM node:16-alpine

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . /home/app

RUN npm install

EXPOSE 8080

CMD ["node", "/home/app/server.js"]