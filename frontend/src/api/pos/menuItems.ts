// frontend/src/api/pos/menuItems.ts
import http from "../../services/http";

export type MenuItemDto = {
  id: string;
  tenantId: string;
  menuId: string;
  sectionId?: string | null;
  productId: string;
  variantId?: string | null;
  label?: string | null;
  shortLabel?: string | null;
  sortOrder: number;
  isVisible: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;

  product?: {
    id: string;
    name: string;
  } | null;
  variant?: {
    id: string;
    name: string;
  } | null;
  menu?: {
    id: string;
    name: string;
  } | null;
};

// x-tenant-id is injected by http interceptor

export async function fetchMenuItems(menuId?: string): Promise<MenuItemDto[]> {
  const res = await http.get("/pos-api/core/menu-items", {
    params: menuId ? { menuId } : undefined,
  });

  const data = res.data;

  // ✅ Verdraagzaam tegen { items: [...] } of andere vormen
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.items)) {
    return data.items;
  }

  console.warn("Unexpected menu-items response shape:", data);
  return [];
}
