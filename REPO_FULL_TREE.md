Tably-pos-loyalty/
├─ docker-compose.yml
├─ REPO_TREE_AND_ROUTES.md
├─ REPO_FULL_TREE.md
├─ frontend/
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ vite.config.ts
│  └─ src/
│     ├─ App.tsx
│     ├─ main.tsx
│     ├─ dashboard.css
│     ├─ styles/
│     │  └─ pos/
│     │     └─ pos.css
│     ├─ css/
│     │  └─ layouts/
│     │     └─ DashboardLayout.tsx
│     ├─ layouts/
│     │  └─ MainShell.tsx
│     ├─ components/
│     │  └─ pos/
│     │     ├─ POSMenuButton.tsx
│     │     ├─ POSSidebar.tsx
│     │     ├─ POSSidebarOverlay.tsx
│     │     └─ PosLayout.tsx
│     ├─ pages/
│     │  ├─ dashboard/
│     │  │  ├─ DashboardPage.tsx
│     │  │  ├─ DashboardPage.css
│     │  │  └─ products/
│     │  │     ├─ ProductsPage.tsx
│     │  │     ├─ EditProductModal.tsx
│     │  │     ├─ CategoriesPage.tsx
│     │  │     ├─ StockPage.tsx
│     │  │     └─ StockMovementModal.tsx
│     │  ├─ customers/
│     │  │  ├─ CustomersPage.tsx
│     │  │  └─ CustomerDetailPage.tsx
│     │  ├─ loyalty/
│     │  │  └─ LoyaltyPage.tsx
│     │  ├─ kds/
│     │  │  └─ KdsPage.tsx
│     │  └─ pos/
│     │     ├─ PosPage.tsx
│     │     ├─ PosMainScreen.tsx
│     │     ├─ PosProductsPage.tsx
│     │     ├─ PosCategoriesPage.tsx
│     │     ├─ PosStockPage.tsx
│     │     ├─ PosReportsPage.tsx
│     │     ├─ PosCustomersPage.tsx
│     │     ├─ PosGiftcardsPage.tsx
│     │     └─ PosPlanningPage.tsx
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
│  │  ├─ Dockerfile
│  │  ├─ package.json
│  │  ├─ prisma/
│  │  │  └─ schema.prisma
│  │  └─ src/
│  │     ├─ index.ts
│  │     ├─ app.ts
│  │     ├─ middleware/
│  │     │  └─ auth.ts
│  │     ├─ routes/
│  │     │  ├─ health.ts
│  │     │  ├─ kdsRoutes.ts
│  │     │  ├─ orders.ts              # ordersRoutes (entrypoint /pos/orders)
│  │     │  ├─ categories.ts
│  │     │  ├─ products.ts
│  │     │  ├─ variants.ts
│  │     │  ├─ stock.ts
│  │     │  └─ tables.ts
│  │     ├─ controllers/
│  │     │  ├─ ordersController.ts    # (aanbevolen structuur)
│  │     │  ├─ categoriesController.ts
│  │     │  ├─ productsController.ts
│  │     │  ├─ variantsController.ts
│  │     │  └─ stockController.ts
│  │     ├─ services/
│  │     │  ├─ categoryService.ts
│  │     │  ├─ stockService.ts
│  │     │  ├─ tableService.ts
│  │     │  └─ ordersService.ts       # (aanbevolen structuur)
│  │     └─ db/
│  │        └─ memory.ts
│  │
│  └─ loyalty/
│     ├─ Dockerfile
│     ├─ package.json
│     └─ src/
│        ├─ index.ts
│        ├─ routes/
│        │  └─ customers.ts           # /loyalty/customers endpoints
│        └─ services/
│           └─ customersService.ts
