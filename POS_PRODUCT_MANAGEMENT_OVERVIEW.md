# Tably POS — Productbeheer (Frontend) overzicht

Dit document bundelt alle relevante frontend onderdelen voor:
- Omzetgroepen
- Categorieën
- Producten
- Varianten
- POS productbeheer (kassastijl)

Inhoud:
1) Types (shared)
2) API clients (fetch met x-tenant-id header)
3) Dashboard pages (beheer)
4) POS pages (kassastijl)
5) Routes (AppRoutes.tsx)
6) Styles referenties

---

## 1) Types

```typescript
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/types/pos.ts
export interface RevenueGroup { id: string; name: string; color?: string; }
export interface Category {
  id: string; name: string; color?: string; sortOrder: number; isActive: boolean;
  revenueGroupId?: string; revenueGroup?: RevenueGroup;
}
export interface ProductVariant {
  id: string; name: string; priceInclVat: number; vatRate: number; sortOrder: number; isActive: boolean;
}
export interface Product {
  id: string; name: string; description?: string;
  isActive: boolean; isPopular: boolean; isBestSeller: boolean; isNew: boolean;
  allowDiscount: boolean; printGroup?: string;
  categoryId: string; category?: Category;
  revenueGroupId?: string; revenueGroup?: RevenueGroup;
  variants: ProductVariant[];
}
```

---

## 2) API clients

Alle calls sturen x-tenant-id: "demo" mee via Vite-proxy pad /pos-api/core/*.

```typescript
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/api/pos/revenueGroups.ts
import type { RevenueGroup } from "@/types/pos";
const headers = { "Content-Type": "application/json", "x-tenant-id": "demo" };
export async function fetchRevenueGroups(): Promise<RevenueGroup[]> {
  const res = await fetch("/pos-api/core/revenue-groups", { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function createRevenueGroup(payload: { name: string; color?: string }) {
  const res = await fetch("/pos-api/core/revenue-groups", { method: "POST", headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

```typescript
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/api/pos/categories.ts
import type { Category } from "@/types/pos";
const headers = { "Content-Type": "application/json", "x-tenant-id": "demo" };
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/pos-api/core/categories", { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function createCategory(payload: { name: string; color?: string; sortOrder?: number; isActive?: boolean; revenueGroupId: string }) {
  const res = await fetch("/pos-api/core/categories", { method: "POST", headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function updateCategory(id: string, payload: Partial<{ name: string; color?: string; sortOrder?: number; isActive?: boolean; revenueGroupId?: string }>) {
  const res = await fetch(`/pos-api/core/categories/${id}`, { method: "PUT", headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

```typescript
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/api/pos/products.ts
import type { Product } from "@/types/pos";
const headers = { "Content-Type": "application/json", "x-tenant-id": "demo" };
export type CreateProductInput = {
  name: string; description?: string; categoryId: string; revenueGroupId?: string | null;
  isActive?: boolean; isPopular?: boolean; isBestSeller?: boolean; isNew?: boolean; allowDiscount?: boolean; printGroup?: string;
  variants: { name: string; priceInclVat: number; vatRate: number; sortOrder?: number }[];
};
export type UpdateProductInput = Partial<CreateProductInput>;
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/pos-api/core/products", { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`/pos-api/core/products/${id}`, { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function createProduct(payload: CreateProductInput): Promise<Product> {
  const res = await fetch("/pos-api/core/products", { method: "POST", headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function updateProduct(id: string, payload: UpdateProductInput): Promise<Product> {
  const res = await fetch(`/pos-api/core/products/${id}`, { method: "PUT", headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/pos-api/core/products/${id}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error(await res.text());
}
```

```typescript
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/api/pos/variants.ts
import type { ProductVariant } from "@/types/pos";
const headers = { "Content-Type": "application/json", "x-tenant-id": "demo" };
export async function updateVariant(id: string, payload: Partial<ProductVariant>) {
  const res = await fetch(`/pos-api/core/variants/${id}`, { method: "PUT", headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function deleteVariant(id: string) {
  const res = await fetch(`/pos-api/core/variants/${id}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error(await res.text());
}
export async function fetchVariantsByProduct(productId: string): Promise<ProductVariant[]> {
  const res = await fetch(`/pos-api/core/products/${productId}`, { headers });
  if (!res.ok) throw new Error(await res.text());
  const product = await res.json();
  return Array.isArray(product.variants) ? product.variants : [];
}
```

---

## 3) Dashboard pages (beheer)

```tsx
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/pages/dashboard/products/RevenueGroupsPage.tsx
// …existing imports…
export default function RevenueGroupsPage() {
  // …existing code…
  // fetchRevenueGroups, createRevenueGroup + loading/error states
}
```

```tsx
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/pages/dashboard/products/CategoriesPage.tsx
// …existing imports…
export default function CategoriesPage() {
  // …existing code…
  // fetchCategories + fetchRevenueGroups; createCategory; sort on sortOrder; error states
}
```

```tsx
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/pages/dashboard/products/ProductsPage.tsx
// …existing imports…
export default function ProductsPage() {
  // …existing code…
  // fetchProducts; show min variant price; open detail
}
```

```tsx
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/pages/dashboard/products/ProductCreatePage.tsx
// …existing imports…
export default function ProductCreatePage() {
  // …existing code…
  // createProduct with variants editor; dropdowns via fetchCategories/fetchRevenueGroups
}
```

```tsx
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/pages/dashboard/products/ProductDetailPage.tsx
// …existing imports…
export default function ProductDetailPage() {
  // …existing code…
  // tabs: basis/varianten/ingrediënten; updateVariant, deleteVariant
}
```

---

## 4) POS pages (kassastijl)

```tsx
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/pages/pos/products/PosProductsListPage.tsx
// …existing imports…
export default function PosProductsListPage() {
  // …existing code…
  // fetchProducts; list in kassastijl; link to detail/new
}
```

```tsx
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/pages/pos/products/PosProductCreatePage.tsx
// …existing imports…
export default function PosProductCreatePage() {
  // …existing code…
  // createProduct with minimal variant form; kassastijl UI
}
```

```tsx
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/pages/pos/products/PosProductDetailPage.tsx
// …existing imports…
export default function PosProductDetailPage() {
  // …existing code…
  // fetchProduct; kassastijl detail
}
```

---

## 5) Routes (AppRoutes.tsx)

Onder /pos en /dashboard zijn de productbeheer routes toegevoegd. Bestaande structuur blijft intact.

```tsx
// filepath: /Users/mervynhendriks/Documents/GitHub/Tably-pos-loyalty/frontend/src/AppRoutes.tsx
// src/AppRoutes.tsx
// …existing imports…
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/pos" element={<PosLayout />}>
        {/* …existing pos routes… */}
        {/* Productbeheer (POS kassastijl) */}
        <Route path="products" element={<PosProductsListPage />} />
        <Route path="products/new" element={<PosProductCreatePage />} />
        <Route path="products/:id" element={<PosProductDetailPage />} />
        {/* …existing pos routes… */}
      </Route>
      <Route element={<MainShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Dashboard productbeheer */}
        <Route path="/dashboard/products" element={<ProductsPage />} />
        <Route path="/dashboard/products/new" element={<ProductCreatePage />} />
        <Route path="/dashboard/products/:id" element={<ProductDetailPage />} />
        <Route path="/dashboard/categories" element={<CategoriesPage />} />
        <Route path="/dashboard/revenue-groups" element={<RevenueGroupsPage />} />
        {/* …existing dashboard routes… */}
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
```

---

## 6) Styles referenties

- POS admin/kassastijl: frontend/src/styles/pos/pos.css
- Mint Glass beheer: frontend/src/styles/pos/pos-management.css

Gebruikten classes:
- pos-admin-page, pos-admin-card, pos-admin-title, pos-admin-list, pos-admin-row, pos-admin-row-actions, pos-admin-chip
- pm-wrapper, pm-header, pm-title, pm-table, pm-list, pm-item, pm-btn-green

---

Samenvatting:
- Alle productbeheer UI is nu opgezet met TypeScript types, fetch-clients met x-tenant-id header, dashboard- en POS-kassastijl pagina’s, en routes onder /dashboard en /pos. Gebruik dit document om snel paden en koppelingen te vinden.
