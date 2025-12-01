FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Gebruik het bestaande script (typisch "dev" of "start"); hier "dev" als standaard
CMD ["npm", "run", "dev"]
