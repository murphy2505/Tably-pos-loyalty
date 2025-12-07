// frontend/src/api/pos/products.ts

export interface PosProductVariant {
  id: string;
  name: string;
  price: number;
  active?: boolean;
}

export interface PosProduct {
  id: string;
  name: string;
  categoryId?: string | null;
  revenueGroupId?: string | null;
  isActive?: boolean;
  price?: number;
  variants?: PosProductVariant[];
}

export interface CreateProductInput {
  name: string;
  price: number;
  categoryId?: string | null;
  revenueGroupId?: string | null;
  isActive?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
  categoryId?: string | null;
  revenueGroupId?: string | null;
  isActive?: boolean;
}

const headers = {
  "Content-Type": "application/json",
  "x-tenant-id": "demo",
};

// Lijst producten
export async function fetchProducts(): Promise<PosProduct[]> {
  const res = await fetch("/pos/core/products", { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Detail product (fallback als backend geen detail-endpoint heeft)
export async function fetchProductById(id: string): Promise<PosProduct | null> {
  // Probeer een hypothetisch detail-pad; als niet aanwezig → fallback
  const detail = await fetch(`/pos/core/products/${encodeURIComponent(id)}`, { headers });
  if (detail.ok) return detail.json();

  // Fallback: filter uit lijst
  const list = await fetchProducts();
  return list.find((p) => p.id === id) ?? null;
}

// Aanmaken product (optioneel voor volgende stap)
export async function createProduct(input: CreateProductInput): Promise<PosProduct> {
  const res = await fetch("/pos/core/products", {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Bijwerken product
export async function updateProduct(id: string, input: UpdateProductInput): Promise<PosProduct> {
  const res = await fetch(`/pos/core/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// 🔹 Product verwijderen
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/pos/core/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) throw new Error(await res.text());
}

// =====================================================================
// Variants – via aparte endpoints /pos/core/variants
// =====================================================================

export async function createVariant(payload: any): Promise<ProductVariant> {
  const res = await fetch("/pos/core/variants", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function updateVariant(
  id: string,
  payload: any
): Promise<ProductVariant> {
  const res = await fetch(`/pos/core/variants/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function deleteVariant(id: string): Promise<void> {
  const res = await fetch(`/pos/core/variants/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
}
