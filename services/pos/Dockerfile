# ===============================
# 1. BUILDER STAGE
# ===============================
FROM node:20-alpine AS builder

WORKDIR /app

# Installeer build dependencies
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

# Prisma client genereren
RUN npx prisma generate

# TypeScript build (maakt /dist)
RUN npm run build



# ===============================
# 2. PRODUCTION STAGE
# ===============================
FROM node:20-alpine AS production

WORKDIR /app

# Copy package.json voor production install
COPY package*.json ./

# Production dependencies installeren
RUN npm install --omit=dev

# Prisma schema + client
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma

# Copy compiled backend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4002

# Gebruik de production server start (dus niet ts-node/nodemon)
CMD ["node", "dist/index.js"]
