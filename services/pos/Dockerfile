FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4002

# Gebruik het bestaande script (in dit repo 'dev' bestaat al: nodemon/ts-node)
CMD ["npm", "run", "dev"]
