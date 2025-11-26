# Tably POS Loyalty Monorepo

A Multi-Tenant SaaS monorepo for the Tably POS system, containing multiple backend services and a frontend application.

## Structure

```
├── services/
│   ├── loyalty/      # Loyalty service - Express + TypeScript API for managing POS loyalty
│   ├── identity/     # Identity service - (placeholder for future development)
│   └── pos/          # POS service - (placeholder for future development)
├── frontend/         # Frontend application - (placeholder for Vite/React)
└── package.json      # Root monorepo configuration
```

## Services

### Loyalty Service (`services/loyalty`)

A minimal Express + TypeScript API for managing POS loyalty: customers, transactions (accruing points) and reward redemptions.

**Tech Stack:**
- Express
- TypeScript
- Zod for validation
- Jest + Supertest for testing

**Endpoints:**
- `GET /health` → `{ status: "ok" }`
- `POST /customers` `{ name: string }` → 201 Customer
- `GET /customers` → 200 Customer[]
- `POST /transactions` `{ customerId: uuid, amount: number }` → 201 Transaction (pointsEarned)
- `GET /transactions?customerId=uuid` → 200 Transaction[]
- `POST /rewards/redeem` `{ customerId: uuid, points: integer }` → 201 RewardRedemption
- `GET /rewards?customerId=uuid` → 200 RewardRedemption[]

**Points Logic:**
- Earn: `points = floor(amount * POINT_RATE)` (`POINT_RATE=1` in memory store).
- Redeem subtracts points; cannot go below zero.

### Identity Service (`services/identity`)

Placeholder for future identity/authentication service.

### POS Service (`services/pos`)

Placeholder for future POS service.

## Frontend (`frontend`)

Placeholder for future Vite/React frontend application.

## Getting Started

### Install Dependencies

For the loyalty service:
```bash
cd services/loyalty
npm install
```

### Development

Start the loyalty service in development mode:
```bash
# From root
npm run dev:loyalty

# Or from services/loyalty
cd services/loyalty
npm run dev
```

### Testing

Run tests for the loyalty service:
```bash
# From root
npm run test:loyalty

# Or from services/loyalty
cd services/loyalty
npm test
```

### Building

Build the loyalty service:
```bash
# From root
npm run build:loyalty

# Or from services/loyalty
cd services/loyalty
npm run build
```

### Start Production Server

Start the loyalty service in production mode:
```bash
# From root
npm run start:loyalty

# Or from services/loyalty
cd services/loyalty
npm start
```

## Future Improvements

- Persistence (PostgreSQL + Prisma)
- Auth (API keys / OAuth)
- Configurable point rules & promotions
- Pagination & filtering
- OpenAPI spec
