FROM node:19-alpine AS build

WORKDIR /app/

COPY package*.json /app/

RUN npm install ci --force

COPY . /app/

RUN npm run build

FROM nginx:1.23.2-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=build /_static/ /usr/share/nginx/html

EXPOSE 80