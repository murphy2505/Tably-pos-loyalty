// frontend/src/api/pos/variants.ts
import type { PosProductVariant } from "./products";

export type { PosProductVariant };

const headers: HeadersInit = {
  "Content-Type": "application/json",
  "x-tenant-id": "demo-tenant",
};

export interface CreateVariantInput {
  productId: string;
  name: string;
  price: number;
  isActive?: boolean;
}

export interface UpdateVariantInput {
  name?: string;
  price?: number;
  isActive?: boolean;
}

// Prisma Decimal/string → number
function toNumber(value: any, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  const n = Number(
    typeof value === "string" ? value.replace(",", ".") : value
  );
  return Number.isNaN(n) ? fallback : n;
}

function mapVariantFromApi(api: any): PosProductVariant {
  return {
    id: api.id,
    name: api.name,
    price: toNumber(api.priceInclVat ?? api.price),
    active: api.isActive ?? true,
  };
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status} – ${text || res.statusText || "Unknown error"}`
    );
  }

  if (!contentType.includes("application/json")) {
    console.error("Non-JSON response from", res.url, ":", text);
    throw new Error("Expected JSON response but got non-JSON/HTML.");
  }

  if (!text) return undefined as unknown as T;

  try {
    return JSON.parse(text) as T;
  } catch (e) {
    console.error("Failed to parse JSON from", res.url, ":", text);
    throw new Error("Invalid JSON in response.");
  }
}

export async function createVariant(
  payload: CreateVariantInput
): Promise<PosProductVariant> {
  const res = await fetch("/pos/core/variants", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const apiVariant = await parseJson<any>(res);
  return mapVariantFromApi(apiVariant);
}

export async function updateVariant(
  id: string,
  payload: UpdateVariantInput
): Promise<PosProductVariant> {
  const res = await fetch(`/pos/core/variants/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  const apiVariant = await parseJson<any>(res);
  return mapVariantFromApi(apiVariant);
}

export async function deleteVariant(id: string): Promise<void> {
  const res = await fetch(`/pos/core/variants/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
}
