// frontend/src/services/posService.ts
import api from "./http";

// Typen kun je later uitbreiden / aanpassen
export interface Category {
  id: string;
  name: string;
  color?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  sku?: string | null;
  categoryId: string;
  priceIncl: string; // Prisma Decimal → string
  vatRate: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

// ========== CATEGORIES ==========

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get("/pos-api/core/categories");
  return res.data;
}

export async function createCategory(payload: {
  name: string;
  color?: string | null;
}): Promise<Category> {
  const res = await api.post("/pos-api/core/categories", payload);
  return res.data;
}

export async function updateCategory(
  id: string,
  payload: { name?: string; color?: string | null }
): Promise<Category> {
  const res = await api.put(`/pos-api/core/categories/${id}`, payload);
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/pos-api/core/categories/${id}`);
}

// ========== PRODUCTS ==========

export async function fetchProducts(): Promise<Product[]> {
  const res = await api.get("/pos-api/core/products");
  return res.data;
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await api.get(`/pos-api/core/products/${id}`);
  return res.data;
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const res = await api.post("/pos-api/core/products", payload);
  return res.data;
}

export async function updateProduct(
  id: string,
  payload: Partial<Product>
): Promise<Product> {
  const res = await api.put(`/pos-api/core/products/${id}`, payload);
  return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/pos-api/core/products/${id}`);
}

// ========== STOCK ==========

export async function fetchStock(): Promise<StockItem[]> {
  const res = await api.get("/pos-api/core/stock");
  return res.data;
}

export async function createStockPurchase(payload: {
  stockItemId: string;
  quantity: number;
  unitPriceIncl?: string;
}): Promise<void> {
  await api.post("/pos-api/core/stock", payload);
}

export async function createStockWaste(payload: {
  stockItemId: string;
  quantity: number;
}): Promise<void> {
  await api.post("/pos-api/core/stock/waste", payload);
}

export async function createStockAdjust(payload: {
  stockItemId: string;
  quantity: number;
  reason?: string;
}): Promise<void> {
  await api.post("/pos-api/core/stock/adjust", payload);
}

export async function fetchStockHistory(): Promise<any[]> {
  const res = await api.get("/pos-api/core/stock/history");
  return res.data;
}
