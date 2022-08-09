FROM node:16 as build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@8.16.0

RUN npm install --force

COPY . .

RUN npm run build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
