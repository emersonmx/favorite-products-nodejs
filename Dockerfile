FROM node:20.11.1-slim AS build

WORKDIR /app
COPY . /app

RUN npm install && npm run build

FROM node:20.11.1-slim

COPY --from=build /app/build /usr/src/app

WORKDIR /usr/src/app
CMD ["node", "server.js"]
