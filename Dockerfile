FROM node:20.11.1-slim AS build

WORKDIR /app
COPY . /app

RUN npm install && npm run build

FROM node:20.11.1-slim

COPY --from=build /app/build /usr/src/app/build
COPY --from=build /app/node_modules /usr/src/app/node_modules

WORKDIR /usr/src/app

EXPOSE 3000

CMD ["node", "build/server.js"]
