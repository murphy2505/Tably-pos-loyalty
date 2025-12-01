# Tably POS Loyalty — Project tree & routes (huidige stand)

Dit document geeft een beknopt overzicht van de monorepo-structuur, de belangrijkste routes (backend) en de frontend (React Router) navigatie + Vite proxies.

## Monorepo tree (relevant voor POS + Frontend + Loyalty)

```
Tably-pos-loyalty/
├─ frontend/
│  ├─ vite.config.ts
│  └─ src/
│     ├─ App.tsx
│     ├─ dashboard.css
│     ├─ css/
│     │  └─ layouts/
│     │     └─ DashboardLayout.tsx
│     ├─ styles/
│     │  └─ pos/
│     │     └─ pos.css
│     ├─ components/
│     │  └─ pos/
│     │     ├─ POSMenuButton.tsx
│     │     ├─ POSSidebar.tsx
│     │     ├─ POSSidebarOverlay.tsx
│     │     └─ PosLayout.tsx
│     ├─ pages/
│     │  ├─ pos/
│     │  │  ├─ PosPage.tsx                 # (bestaande kassascherm implementatie)
│     │  │  ├─ PosMainScreen.tsx
│     │  │  ├─ PosProductsPage.tsx
│     │  │  ├─ PosReservationsPage.tsx
│     │  │  └─ PosKdsPage.tsx
│     │  ├─ kds/
│     │  │  └─ KdsPage.tsx
│     │  ├─ customers/
│     │  │  ├─ CustomersPage.tsx
│     │  │  └─ CustomerDetailPage.tsx
│     │  └─ dashboard/
│     │     └─ products/
│     │        ├─ ProductsPage.tsx
│     │        ├─ EditProductModal.tsx
│     │        ├─ CategoriesPage.tsx
│     │        ├─ StockPage.tsx
│     │        └─ StockMovementModal.tsx
│     ├─ services/
│     │  ├─ loyaltyClient.ts
│     │  ├─ ordersService.ts
│     │  ├─ kdsService.ts
│     │  └─ posService.ts
│     └─ api/
│        └─ pos/
│           ├─ products.ts
│           ├─ categories.ts
│           └─ stock.ts
│
├─ services/
│  ├─ pos/
│  │  ├─ prisma/
│  │  │  └─ schema.prisma
│  │  └─ src/
│  │     ├─ index.ts
│  │     ├─ app.ts
│  │     ├─ routes/
│  │     │  ├─ ordersRoutes.ts        # /pos/orders
│  │     │  ├─ kdsRoutes.ts           # /pos/kds
│  │     │  ├─ categories.ts          # /pos/core/categories
│  │     │  ├─ stock.ts               # /pos/core/stock
│  │     │  ├─ tables.ts              # /pos/tables (protected placeholder)
│  │     │  └─ health.ts              # /pos/health
│  │     ├─ services/
│  │     │  ├─ categoryService.ts
│  │     │  ├─ stockService.ts
│  │     │  └─ tableService.ts
│  │     └─ db/
│  │        └─ memory.ts
│  │
│  └─ loyalty/
│     └─ src/
│        ├─ routes/
│        │  └─ customers.ts           # /customers (+ /loyalty-api/customers aliassen)
│        └─ services/
│           └─ customersService.ts
│
└─ REPO_TREE_AND_ROUTES.md            # dit bestand
```

## Backend — POS service (port 4002)

Express app: `services/pos/src/app.ts`, geluisterd door `src/index.ts` op `http://localhost:4002`.

Gemonteerde routers:
- GET /pos/health
- /pos/orders
  - POST /pos/orders                   → order aanmaken (ticket)
  - GET  /pos/orders                   → lijst (optioneel, aanwezig indien geïmplementeerd)
  - GET  /pos/orders/:id               → detail (optioneel)
- /pos/kds
  - GET    /pos/kds                    → alle KDS tickets
  - POST   /pos/kds                    → ticket aanmaken (status: queued)
  - PATCH  /pos/kds/:id/status         → status: queued|preparing|ready
  - DELETE /pos/kds/:id                → ticket verwijderen
- /pos/core/categories
  - GET    /pos/core/categories
  - POST   /pos/core/categories
  - PUT    /pos/core/categories/:id
  - DELETE /pos/core/categories/:id
  - Headers: x-tenant-id (vereist), x-location-id (optioneel)
- /pos/core/stock
  - GET  /pos/core/stock
  - POST /pos/core/stock               → PURCHASE
  - POST /pos/core/stock/waste         → WASTE
  - POST /pos/core/stock/adjust        → ADJUSTMENT
  - GET  /pos/core/stock/history
- /pos/tables (protected placeholder)
  - GET  /pos/tables
  - POST /pos/tables
  - PUT  /pos/tables/:id/state

Prisma schema (samenvatting): Category, Product, ProductVariant, StockItem, ProductIngredient, StockMovement, Table, Order, OrderItem, Payment.

## Backend — Loyalty service (port 3000)

`services/loyalty/src/routes/customers.ts`:
- POST /customers
- GET  /customers
- GET  /customers/:id
- Aliassen (proxy-compat):
  - POST /loyalty-api/customers
  - GET  /loyalty-api/customers
  - GET  /loyalty-api/customers/:id

## Frontend — Vite proxy

`frontend/vite.config.ts`:
- Proxy:
  - "/pos"          → http://localhost:4002 (changeOrigin: true)
  - "/loyalty-api"  → http://localhost:3000 (changeOrigin: true, rewrite: "^/loyalty-api" → "")

## Frontend — React Router (hoofdpunten)

`frontend/src/App.tsx`:
- Redirect root → "/dashboard/customers" (of vergelijkbaar)
- Dashboard shell: `<DashboardLayout />` op `/dashboard`
  - Nested routes (huidige):
    - /dashboard/customers
    - /dashboard/customers/:id
    - /dashboard/pos
    - /dashboard/kds
    - /dashboard/loyalty
    - /dashboard/settings
    - /dashboard/products
    - /dashboard/categories
    - /dashboard/stock
- POS layout groep: `/pos`
  - `<PosLayout />`
  - Nested:
    - index               → `/pos` (PosMainScreen)
    - `/pos/products`     → productbeheer (POS-context)
    - `/pos/reservations` → reserveringen (placeholder)
    - `/pos/kds`          → KDS (POS-context)

## POS — UI modules (overzicht)

- POS hamburger + sidebar (tablet/mobiel):
  - POSMenuButton.tsx, POSSidebar.tsx, POSSidebarOverlay.tsx (slide-in links)
  - Menu-items (role-based): Kassa, Producten, Categorieën, Voorraad, KDS, Rapportage, Klanten, Giftcards, Planning, Instellingen
- Kassascherm:
  - PosPage.tsx + pos.css (mint glass look)
  - Productgrid + orderpaneel + payment overlay
- KDS:
  - pages/kds/KdsPage.tsx (polling op /pos/kds)
- Dashboard beheer:
  - ProductsPage.tsx, CategoriesPage.tsx, StockPage.tsx, StockMovementModal.tsx

## End-to-end keten (samenvatting)

- POS UI → POST /pos/orders (order aanmaken)
- POS UI → POST /pos/kds (ticket in KDS)
- KDS UI → GET /pos/kds (lijst), PATCH status, DELETE ticket
- Customers UI (dashboard) → GET /loyalty-api/customers (via proxy → /customers @3000)

