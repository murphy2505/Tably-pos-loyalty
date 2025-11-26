# Tably POS Loyalty Service

A minimal Express + TypeScript API for managing POS loyalty: customers, transactions (accruing points) and reward redemptions.

## Tech Stack
- Express
- TypeScript
- Zod for validation
- Jest + Supertest for testing

## Install
```bash
npm install
```

## Scripts
```bash
npm run dev     # Nodemon development server
npm run build   # TypeScript compile to dist/
npm start       # Run compiled server
npm test        # Jest tests
```

## Endpoints
### Health
GET /health -> `{ status: "ok" }`

### Customers
POST /customers `{ name: string }` -> 201 Customer
GET /customers -> 200 Customer[]

### Transactions
POST /transactions `{ customerId: uuid, amount: number }` -> 201 Transaction (pointsEarned)
GET /transactions?customerId=uuid -> 200 Transaction[]

### Rewards
POST /rewards/redeem `{ customerId: uuid, points: integer }` -> 201 RewardRedemption
GET /rewards?customerId=uuid -> 200 RewardRedemption[]

## Points Logic
- Earn: `points = floor(amount * POINT_RATE)` (`POINT_RATE=1` in memory store).
- Redeem subtracts points; cannot go below zero.

## Future Improvements
- Persistence (PostgreSQL + Prisma)
- Auth (API keys / OAuth)
- Configurable point rules & promotions
- Pagination & filtering
- OpenAPI spec

## Development
Start dev server:
```bash
npm run dev
```

Run tests:
```bash
npm test
```
