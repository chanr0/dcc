# Base layer for the image
# FROM node:lts-alpine
from ubuntu:20.04

# ENV NODE_ENV=production
ARG DEBIAN_FRONTEND=noninteractive
RUN apt update
RUN apt-get install -y software-properties.common
RUN apt-get install -y curl build-essential
RUN apt-get install -y git

# Copy the rest of the files over
COPY . /usr/src/app

# Specify work directory within the image repository
# Future lines will run here
WORKDIR /usr/src/app

# Copy over dependencies
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install dependencies in image
# RUN npm install && mv node_modules ../
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt install -y nodejs

RUN npm install
RUN npm install -g serve

RUN npm run build

CMD ["serve", "-s", "build", "-l", "3000"]

# RUN npm install

# # Determine connection port
# EXPOSE 3000
# CMD ["npm", "start"]
