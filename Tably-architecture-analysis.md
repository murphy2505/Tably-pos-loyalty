# Tably POS + Loyalty — Comprehensive Analysis

Date: 2025-12-09

## Overview
- Monorepo with `frontend` (Vite + React + TypeScript) and three backend services under `services/`: `pos` (Express + Prisma), `identity` (auth), and `loyalty` (customer loyalty APIs).
- Local development via Vite dev server with HTTP proxy to backends; Dockerfiles provided per service; a top-level `docker-compose.yml` orchestrates services for containerized runs.

## Frontend
- Tooling: Vite, React, TypeScript, ESLint. Entry in `frontend/src/main.tsx`, routes in `AppRoutes.tsx`, feature modules under `pages/pos`, `pages/dashboard`, etc.
- API layer: `frontend/src/services/posApi.ts` centralizes calls to POS. It uses an axios instance with `baseURL: '/'` and relies on Vite proxy.
- Proxy config: `frontend/vite.config.ts` rewrites:
  - `/pos-api` → `http://localhost:4002/pos` (POS backend)
  - `/loyalty-api` → `http://localhost:3000` (loyalty)
  - `/identity-api` → `http://localhost:3001` (identity)

### Finding: POS UI endpoints must use `/pos-api/...`
- Prior to fix, POS UI functions `apiListMenusPOS`, `apiGetMenuPOS`, `apiListMenuItemsPOS` called `/pos/...` directly. Vite proxy is only set for `/pos-api`, so `/pos/...` hit the dev server and returned `index.html` (HTML), causing the error “Expected JSON response but got non-JSON/HTML”.
- Fix applied: Updated `frontend/src/services/posApi.ts` to use `/pos-api/...` for POS UI endpoints.

### Headers and Multi-tenant Context
- POS backend requires tenant scoping. `services/pos/src/middleware/auth.ts` enforces presence of `x-tenant-id` (and optional `x-location-id`), returning JSON 400 when missing.
- Some controllers (e.g., `menuItemsController.ts`) fall back to `demo-tenant` if header absent; others might strictly require headers. Ensure axios adds `x-tenant-id` for authenticated routes.

## POS Backend
- Tech: Express + Prisma + PostgreSQL. Entry `src/index.ts` starts app on `POS_PORT` (default 4002). App setup in `src/app.ts`.
- Routes:
  - Public: `/pos/health`, `/pos/kds`, `/pos/orders` (POS/Kassa).
  - Protected core: `/pos/core/...` for categories, products, variants, stock, revenue-groups, modifiers, menus, menu-items.
  - POS UI aliases: `/pos/menus`, `/pos/menu-items` mapped to same routers; currently guarded by `authMiddleware` (requires `x-tenant-id`).
- Prisma schema: `services/pos/prisma/schema.prisma` models for `Category`, `Product`, `ProductVariant`, stock/ingredients, and Menu system (`Menu`, `MenuSection`, `MenuItem`). Decimal fields used for prices/VAT.
- Controllers pattern: Return JSON consistently with proper status codes; errors are JSON. Example `menuItemsController.ts` supports `GET /pos/core/menu-items?menuId=...` with tenant filter.

### Findings & Recommendations
- JSON-only API discipline: Add a global JSON error handler and JSON 404 handler at the end of `app.ts` to guarantee non-HTML responses in all error cases.
- POS UI auth: If POS UI should be publicly accessible (read-only), consider removing `authMiddleware` from `/pos/menus` and `/pos/menu-items`, or ensure the frontend always sends `x-tenant-id`.
- Consistent tenant handling: Standardize controllers to use `withTenant` without fallbacks (or document/demo fallback clearly). Provide middleware that injects default demo tenant only in dev.

## Identity Service
- Location: `services/identity`. Provides authentication endpoints; tests under `services/identity/tests`. Not fully reviewed here due to scope, but Vite proxy expects it at `localhost:3001` under `/identity-api`.
- Recommendation: Document auth token/header requirements that the POS backend expects, and ensure frontend adds them via axios interceptors.

## Loyalty Service
- Location: `services/loyalty`. Exposes customer endpoints used by POS UI (`/pos/customers` in POS app proxies to loyalty). Proxy configured at `/loyalty-api` → `localhost:3000`.
- Recommendation: Validate CORS and tenant scoping consistent with POS.

## Docker & Dev Setup
- Top-level `docker-compose.yml`: defines containers for services (not fully expanded here). Each service has a Dockerfile.
- Dev commands: `npm run dev` in each service folder runs nodemon/ts-node; frontend runs Vite dev server.

## Concrete Fixes Implemented
1. Frontend proxy usage corrected:
   - Updated `frontend/src/services/posApi.ts` to use `/pos-api/...` for POS UI calls, ensuring Vite proxies to POS backend at `:4002` and responses are JSON.

## Suggested Next Changes (Optional)
- Add global error/404 JSON handlers to `services/pos/src/app.ts`:
  ```ts
  // at the bottom of app.ts
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
  ```
- Axios headers: add `x-tenant-id` and optional `x-location-id` via interceptor:
  ```ts
  // frontend/src/services/http.ts
  import axios from 'axios';
  const api = axios.create({ baseURL: '/' });
  api.interceptors.request.use((config) => {
    config.headers['x-tenant-id'] = 'demo-tenant'; // or from app state
    return config;
    });
  export default api;
  ```
- Decide access policy for `/pos/menus` and `/pos/menu-items`: keep `authMiddleware` or relax to public read-only.

## Verification Steps
- Run frontend and POS:
  ```zsh
  cd frontend && npm run dev
  cd services/pos && npm run dev
  ```
- Test endpoints from frontend (now using `/pos-api/...`):
  ```zsh
  curl -i 'http://localhost:5173/pos-api/menus'
  curl -i 'http://localhost:5173/pos-api/menu-items?menuId=...'
  ```
- Direct backend check:
  ```zsh
  curl -i 'http://localhost:4002/pos/menus' -H 'x-tenant-id: demo-tenant'
  ```

## Conclusion
The HTML response issue stemmed from calling `/pos/...` directly from the frontend while the proxy only rewrites `/pos-api/...`. Updating the frontend to use `/pos-api` fixes the mismatch and yields JSON responses. To harden the system, add JSON error/404 handlers in POS, standardize tenant headers, and ensure proxy paths are used consistently across all frontend API clients.
