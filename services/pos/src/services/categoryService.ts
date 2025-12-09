import { Router } from "express";

// In-memory category service (compile fix) – vervangt foutieve customer code
type Category = {
  id: string;
  tenantId: string;
  name: string;
  color?: string;
  parentId?: string | null;
  order: number;
};

const categoriesStore: Category[] = [];

function genId() {
  return "cat_" + Math.random().toString(36).slice(2, 10);
}

export async function listCategories(tenantId: string, _locationId?: string) {
  return categoriesStore
    .filter(c => c.tenantId === tenantId)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export async function createCategory(
  tenantId: string,
  data: { name: string; color?: string; parentId?: string | null; order?: number }
) {
  const nextOrder =
    typeof data.order === "number"
      ? data.order
      : categoriesStore
          .filter(c => c.tenantId === tenantId)
          .reduce((m, c) => (c.order > m ? c.order : m), -1) + 1;

  const category: Category = {
    id: genId(),
    tenantId,
    name: data.name,
    color: data.color,
    parentId: data.parentId ?? null,
    order: nextOrder,
  };
  categoriesStore.push(category);
  return category;
}

export async function updateCategory(
  tenantId: string,
  id: string,
  data: { name?: string; color?: string; parentId?: string | null; order?: number }
) {
  const idx = categoriesStore.findIndex(c => c.id === id && c.tenantId === tenantId);
  if (idx === -1) throw new Error("Category not found");
  const existing = categoriesStore[idx];
  categoriesStore[idx] = {
    ...existing,
    name: data.name ?? existing.name,
    color: data.color ?? existing.color,
    parentId: data.parentId !== undefined ? data.parentId : existing.parentId,
    order: data.order !== undefined ? data.order : existing.order,
  };
  return categoriesStore[idx];
}

export async function deleteCategory(tenantId: string, id: string) {
  const idx = categoriesStore.findIndex(c => c.id === id && c.tenantId === tenantId);
  if (idx === -1) throw new Error("Category not found");
  categoriesStore.splice(idx, 1);
  return true;
}