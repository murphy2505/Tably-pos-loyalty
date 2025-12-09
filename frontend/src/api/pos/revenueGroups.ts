import http from "../../services/http";

export type RevenueGroup = {
  id: string;
  name: string;
  color?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export async function apiListRevenueGroups(): Promise<RevenueGroup[]> {
  const res = await http.get("/pos-api/core/revenue-groups");
  return res.data;
}

export async function apiCreateRevenueGroup(payload: { name: string; color?: string | null }): Promise<RevenueGroup> {
  const res = await http.post("/pos-api/core/revenue-groups", payload);
  return res.data;
}

export async function apiUpdateRevenueGroup(id: string, payload: Partial<RevenueGroup>): Promise<RevenueGroup> {
  const res = await http.put(`/pos-api/core/revenue-groups/${id}`, payload);
  return res.data;
}

export async function apiDeleteRevenueGroup(id: string): Promise<void> {
  await http.delete(`/pos-api/core/revenue-groups/${id}`);
}

// Backwards-compat alias exports for existing pages expecting old names
export const getRevenueGroups = apiListRevenueGroups;
export const createRevenueGroup = apiCreateRevenueGroup;
export const updateRevenueGroup = apiUpdateRevenueGroup;
export const deleteRevenueGroup = apiDeleteRevenueGroup;

export async function fetchRevenueGroups(): Promise<RevenueGroup[]> {
  return apiListRevenueGroups();
}
