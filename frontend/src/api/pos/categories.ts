import http from "../../services/http";

export type Category = {
  id: string;
  name: string;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
};

export async function apiListCategories(): Promise<Category[]> {
  const res = await http.get("/pos-api/core/categories");
  return res.data;
}

export async function apiCreateCategory(payload: { name: string; color?: string | null }) {
  const res = await http.post("/pos-api/core/categories", payload);
  return res.data;
}

export async function apiUpdateCategory(id: string, payload: any) {
  const res = await http.put(`/pos-api/core/categories/${id}`, payload);
  return res.data;
}

export async function apiDeleteCategory(id: string) {
  const res = await http.delete(`/pos-api/core/categories/${id}`);
  return res.data;
}
