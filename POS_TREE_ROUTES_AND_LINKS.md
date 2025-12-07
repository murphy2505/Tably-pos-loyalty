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

// Modifiers API

export async function apiListModifiers() {
  const res = await api.get("/pos/core/modifiers");
  return res.data;
}

export async function apiGetModifier(id: string) {
  const res = await api.get(`/pos/core/modifiers/${id}`);
  return res.data;
}

export async function apiCreateModifier(data: any) {
  const res = await api.post(`/pos/core/modifiers`, data);
  return res.data;
}

export async function apiUpdateModifier(id: string, data: any) {
  const res = await api.put(`/pos/core/modifiers/${id}`, data);
  return res.data;
}

export async function apiDeleteModifier(id: string) {
  const res = await api.delete(`/pos/core/modifiers/${id}`);
  return res.data;
}

// Modifiers groups API

export async function apiListModifierGroups() {
  const res = await api.get("/pos/core/modifier-groups");
  return res.data;
}

export async function apiGetModifierGroup(id: string) {
  const res = await api.get(`/pos/core/modifier-groups/${id}`);
  return res.data;
}

export async function apiCreateModifierGroup(data: any) {
  const res = await api.post(`/pos/core/modifier-groups`, data);
  return res.data;
}

export async function apiUpdateModifierGroup(id: string, data: any) {
  const res = await api.put(`/pos/core/modifier-groups/${id}`, data);
  return res.data;
}

export async function apiDeleteModifierGroup(id: string) {
  const res = await api.delete(`/pos/core/modifier-groups/${id}`);
  return res.data;
}

// Modifiers options API

export async function apiListModifierOptions() {
  const res = await api.get("/pos/core/modifier-options");
  return res.data;
}

export async function apiGetModifierOption(id: string) {
  const res = await api.get(`/pos/core/modifier-options/${id}`);
  return res.data;
}

export async function apiCreateModifierOption(data: any) {
  const res = await api.post(`/pos/core/modifier-options`, data);
  return res.data;
}

export async function apiUpdateModifierOption(id: string, data: any) {
  const res = await api.put(`/pos/core/modifier-options/${id}`, data);
  return res.data;
}

export async function apiDeleteModifierOption(id: string) {
  const res = await api.delete(`/pos/core/modifier-options/${id}`);
  return res.data;
}