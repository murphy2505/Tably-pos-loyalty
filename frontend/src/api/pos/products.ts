import http from "../../services/http";

export type Product = {
  id: string;
  name: string;
  price?: number;
  sku?: string;
  categoryId?: string | null;
  revenueGroupId?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

export async function apiListProducts(): Promise<Product[]> {
  const res = await http.get("/pos-api/core/products");
  return res.data;
}

export async function apiGetProduct(id: string): Promise<Product> {
  const res = await http.get(`/pos-api/core/products/${id}`);
  return res.data;
}

export async function apiCreateProduct(payload: any): Promise<Product> {
  const res = await http.post("/pos-api/core/products", payload);
  return res.data;
}

export async function apiUpdateProduct(id: string, payload: any): Promise<Product> {
  const res = await http.put(`/pos-api/core/products/${id}`, payload);
  return res.data;
}

export async function apiDeleteProduct(id: string) {
  const res = await http.delete(`/pos-api/core/products/${id}`);
  return res.data;
}
