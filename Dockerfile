FROM node:18-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY main.mjs .
CMD ["node","./main.mjs"]