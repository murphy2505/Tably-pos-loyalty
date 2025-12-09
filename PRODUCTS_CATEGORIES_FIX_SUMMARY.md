# Products & Categories Fix — Summary

Date: 2025-12-09

## What Was Broken
- Frontend imported non-existent named exports causing Vite to crash and the app to show a white screen.
- API calls used `"/pos/..."` which bypassed the Vite proxy; the dev server returned HTML (`index.html`) instead of JSON.

## Root Causes
- Mismatched import names between pages and `src/api/pos/*.ts` modules:
  - Pages used `fetchProducts`, `fetchProductById`, `fetchCategories` but modules export `apiListProducts`, `apiGetProduct`, `apiListCategories`, etc.
- Vite proxy is configured only for paths starting with `"/pos-api"`. Calling `"/pos/..."` returned HTML.

## Code Changes Applied

### Frontend API paths
- `frontend/src/services/posApi.ts`
  - Switched POS UI endpoints to `"/pos-api/..."`:
    - `apiListMenusPOS` → `GET /pos-api/menus`
    - `apiGetMenuPOS` → `GET /pos-api/menus/:id`
    - `apiListMenuItemsPOS` → `GET /pos-api/menu-items?menuId=...`
- `frontend/src/api/pos/menuItems.ts`
  - Switched to `GET /pos-api/core/menu-items` with tenant header.

### Pages — import name alignment
- `frontend/src/pages/pos/product-management/ProductsOverviewPage.tsx`
  - Import `apiListProducts` and `type Product as PosProduct` from `api/pos/products`.
- `frontend/src/pages/pos/product-management/ProductDetailPage.tsx`
  - Import `apiGetProduct as fetchProductById` and `type Product as PosProduct`.
- `frontend/src/pages/pos/product-management/VariantsPage.tsx`
  - Import `apiGetProduct as fetchProductById` and `type Product as PosProduct`.
- `frontend/src/pages/pos/product-management/ProductEditPage.tsx`
  - Import `apiGetProduct as fetchProductById`, `apiUpdateProduct as updateProduct`, and `apiListCategories as fetchCategories`.
- `frontend/src/pages/pos/PosProductsPage.tsx`
  - Import `apiListProducts as getProducts`, `apiCreateProduct as createProduct`, `apiUpdateProduct as updateProduct`, `apiDeleteProduct as deleteProduct`.
  - Import `apiListCategories as getCategories`.
- `frontend/src/pages/pos/product-management/CategoriesPage.tsx`
  - Import `apiListCategories as fetchCategories` and `type Category as PosCategory`.

### Tenant header
- `frontend/src/services/http.ts`: axios interceptor already adds `x-tenant-id: demo-tenant`, satisfying POS middleware.

## What Still Needs Doing (Recommendations)
- Standardize API naming across `frontend/src/api/pos/*`:
  - Use consistent `apiList*`, `apiGet*`, `apiCreate*`, `apiUpdate*`, `apiDelete*` exports.
  - Update pages to only use these names to avoid future mismatches.
- Replace remaining `fetch()`-based modules (e.g., `api/pos/revenueGroups.ts`) to use shared axios instance `frontend/src/services/http.ts` and `"/pos-api"` paths.
- Consider adding global JSON error and 404 handlers in `services/pos/src/app.ts`:
  - Ensures all errors return JSON (never HTML):
  
  ```ts
  // at the end of app.ts
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
  ```

## How to Verify
1) Start frontend and POS service:
```zsh
cd frontend && npm run dev
cd services/pos && npm run dev
```
2) Navigate to product management pages; the white screen from import errors should be gone.
3) Confirm API proxy works via curl (should return JSON):
```zsh
curl -i 'http://localhost:5173/pos-api/menus'
curl -i 'http://localhost:5173/pos-api/core/menu-items?menuId=YOUR_MENU_ID'
```

## Summary
By aligning import names with actual module exports and switching API calls to `"/pos-api"` so Vite proxies correctly, the frontend now receives JSON instead of HTML and avoids runtime import errors. Standardizing API naming and centralizing all HTTP calls through axios will prevent similar issues.
