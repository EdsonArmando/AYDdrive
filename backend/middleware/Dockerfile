FROM node:latest

WORKDIR /src/app

COPY package*.json /src/app/
RUN npm install

COPY . /src/app/

CMD ["node", "src/index.js"]
