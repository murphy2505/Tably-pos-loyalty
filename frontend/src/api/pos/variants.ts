import http from "../../services/http";

export type Variant = {
  id: string;
  productId: string;
  name: string;
  sku?: string | null;
  priceInclVat: number | string;
  vatRate: number | string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function apiListVariants(productId: string): Promise<Variant[]> {
  const res = await http.get(`/pos-api/core/variants`, { params: { productId } });
  return res.data;
}

export async function apiCreateVariant(
  productId: string,
  payload: Omit<Variant, "id" | "productId" | "createdAt" | "updatedAt"> & { priceInclVat: number | string; vatRate: number | string }
): Promise<Variant> {
  const res = await http.post(`/pos-api/core/variants`, { ...payload, productId });
  return res.data;
}

export async function apiUpdateVariant(id: string, payload: Partial<Variant>): Promise<Variant> {
  const res = await http.put(`/pos-api/core/variants/${id}`, payload);
  return res.data;
}

export async function apiDeleteVariant(id: string): Promise<void> {
  await http.delete(`/pos-api/core/variants/${id}`);
}
