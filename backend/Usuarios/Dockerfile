FROM node:latest

WORKDIR /src/app

COPY package*.json /src/app/
RUN npm install

COPY . /src/app/

EXPOSE 3000
CMD ["node", "src/index.js"]
