// frontend/src/api/pos/products.ts

export type ProductVariant = {
  id?: string;
  name: string;
  price: number;
  costPrice?: number | null;
  sku?: string | null;
  pluCode?: string | null;
  active: boolean;
};

export type Product = {
  id: string;
  tenantId: string;
  categoryId: string;
  revenueGroupId?: string | null;
  name: string;
  shortLabel?: string | null;
  description?: string | null;
  vatRate: number;
  tileColor?: string | null;
  tileIcon?: string | null;
  imageUrl?: string | null;
  active: boolean;
  variants: ProductVariant[];
};

const TENANT_ID = "demo-tenant";
const DEV_TOKEN = "DUMMY_DEV_TOKEN";

async function parseJson(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
  return res.json();
}

// 🔹 Overzicht producten
export async function getProducts(): Promise<Product[]> {
  const res = await fetch("/pos/products", {
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
  });
  return parseJson(res);
}

// 🔹 Nieuw product (incl. varianten)
export async function createProduct(payload: any): Promise<Product> {
  const res = await fetch("/pos/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

// 🔹 Product bijwerken
export async function updateProduct(id: string, payload: any): Promise<Product> {
  const res = await fetch(`/pos/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

// 🔹 Product verwijderen
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/pos/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
}

// =====================================================================
// Variants – via aparte endpoints /pos/core/variants
// =====================================================================

export async function createVariant(payload: any): Promise<ProductVariant> {
  const res = await fetch("/pos/core/variants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
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
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function deleteVariant(id: string): Promise<void> {
  const res = await fetch(`/pos/core/variants/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
}
