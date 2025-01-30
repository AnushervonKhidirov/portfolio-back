FROM node:22.13.1
COPY . /usr/app
WORKDIR /usr/app
RUN npm install