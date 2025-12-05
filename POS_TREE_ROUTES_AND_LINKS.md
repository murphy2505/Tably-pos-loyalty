// ----------------------------
// Menukaarten API
// ----------------------------

export async function apiListMenus() {
  const res = await api.get("/pos/menus");
  return res.data;
}

export async function apiGetMenu(id: string) {
  const res = await api.get(`/pos/menus/${id}`);
  return res.data;
}

export async function apiListMenuItems(menuId: string) {
  const res = await api.get(`/pos/menu-items`, {
    params: { menuId },
  });
  return res.data;
}

export async function apiCreateMenu(data: any) {
  const res = await api.post(`/pos/core/menus`, data);
  return res.data;
}

export async function apiUpdateMenu(id: string, data: any) {
  const res = await api.put(`/pos/core/menus/${id}`, data);
  return res.data;
}

export async function apiDeleteMenu(id: string) {
  const res = await api.delete(`/pos/core/menus/${id}`);
  return res.data;
}

export async function apiCreateMenuItem(data: any) {
  const res = await api.post(`/pos/core/menu-items`, data);
  return res.data;
}

export async function apiUpdateMenuItem(id: string, data: any) {
  const res = await api.put(`/pos/core/menu-items/${id}`, data);
  return res.data;
}

export async function apiDeleteMenuItem(id: string) {
  const res = await api.delete(`/pos/core/menu-items/${id}`);
  return res.data;
}

export async function apiReorderMenuItems(menuId: string, orderedIds: string[]) {
  const res = await api.post(`/pos/core/menu-items/reorder`, {
    menuId,
    orderedIds,
  });
  return res.data;
}