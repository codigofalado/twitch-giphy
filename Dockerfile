FROM node:16 as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:16 as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/.env ./
COPY --from=ts-compiler /usr/app/client ./client
COPY --from=ts-compiler /usr/app/dist ./
RUN npm install --only=production

FROM node:16
WORKDIR /usr/app
COPY --from=ts-remover /usr/app ./
EXPOSE 3000
CMD ["index.js"]
