FROM node:18

WORKDIR /app
COPY . .
RUN npm install

COPY . .

EXPOSE 8082
CMD ["npm", "start"]