import axios from "axios";

// Basis axios instance – proxy in vite.config stuurt /pos naar backend
const api = axios.create({
  baseURL: "/", // alles gaat via Vite proxy
});

// ----------------------------
// Menukaarten API
// ----------------------------

// POS (kassa) – read-only
export async function apiListMenusPOS() {
  const res = await api.get("/pos/menus");
  return res.data;
}

export async function apiGetMenuPOS(id: string) {
  const res = await api.get(`/pos/menus/${id}`);
  return res.data;
}

export async function apiListMenuItemsPOS(menuId: string) {
  const res = await api.get("/pos/menu-items", {
    params: { menuId },
  });
  return res.data;
}

// CORE (dashboard / beheer)
export async function apiListMenus() {
  const res = await api.get("/pos-api/menus");
  return res.data;
}

export async function apiGetMenu(id: string) {
  const res = await api.get(`/pos-api/menus/${id}`);
  return res.data;
}

export async function apiCreateMenu(data: any) {
  const res = await api.post(`/pos-api/core/menus`, data);
  return res.data;
}

export async function apiUpdateMenu(id: string, data: any) {
  const res = await api.put(`/pos-api/core/menus/${id}`, data);
  return res.data;
}

export async function apiDeleteMenu(id: string) {
  const res = await api.delete(`/pos-api/core/menus/${id}`);
  return res.data;
}

// Menu-items beheer
export async function apiListMenuItems(menuId: string) {
  const res = await api.get("/pos-api/core/menu-items", {
    params: { menuId },
  });
  return res.data;
}

export async function apiCreateMenuItem(data: any) {
  const res = await api.post(`/pos-api/core/menu-items`, data);
  return res.data;
}

export async function apiUpdateMenuItem(id: string, data: any) {
  const res = await api.put(`/pos-api/core/menu-items/${id}`, data);
  return res.data;
}

export async function apiDeleteMenuItem(id: string) {
  const res = await api.delete(`/pos-api/core/menu-items/${id}`);
  return res.data;
}

export async function apiReorderMenuItems(menuId: string, orderedIds: string[]) {
  const res = await api.post(`/pos-api/core/menu-items/reorder`, {
    menuId,
    orderedIds,
  });
  return res.data;
}

//
// -------------------------
//   MODIFIERS API
// -------------------------
//

export async function listModifierGroups() {
  const res = await api.get(`/pos-api/core/modifiers/groups`);
  return res.data;
}

export async function getModifierGroup(id: string) {
  const res = await api.get(`/pos-api/core/modifiers/groups/${id}`);
  return res.data;
}

export async function createModifierGroup(data: any) {
  const res = await api.post(`/pos-api/core/modifiers/groups`, data);
  return res.data;
}

export async function updateModifierGroup(id: string, data: any) {
  const res = await api.put(`/pos-api/core/modifiers/groups/${id}`, data);
  return res.data;
}

export async function deleteModifierGroup(id: string) {
  const res = await api.delete(`/pos-api/core/modifiers/groups/${id}`);
  return res.data;
}

// ---- Options ----

export async function createModifierOption(groupId: string, data: any) {
  const res = await api.post(`/pos-api/core/modifiers/groups/${groupId}/options`, data);
  return res.data;
}

export async function updateModifierOption(id: string, data: any) {
  const res = await api.put(`/pos-api/core/modifiers/options/${id}`, data);
  return res.data;
}

export async function deleteModifierOption(id: string) {
  const res = await api.delete(`/pos-api/core/modifiers/options/${id}`);
  return res.data;
}
