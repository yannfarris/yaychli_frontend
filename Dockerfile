### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /app/
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app/
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/_static /usr/share/nginx/html

EXPOSE 8080