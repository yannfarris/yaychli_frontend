FROM node:18.4.0-alpine

WORKDIR /app/
COPY package*.json /app/
RUN npm install
COPY . /app/
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/_static /usr/share/nginx/html

EXPOSE 80