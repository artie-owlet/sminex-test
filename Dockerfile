FROM node:18-alpine AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig-base.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build

FROM node:18-alpine as run
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY --from=build /app/build ./build
RUN npm ci --omit=dev
CMD npm run start
