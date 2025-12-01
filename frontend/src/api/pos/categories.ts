export async function getCategories() {
  const res = await fetch("/pos/core/categories");
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export async function createCategory(payload: any) {
  const res = await fetch("/pos/core/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

export async function updateCategory(id: string, payload: any) {
  const res = await fetch(`/pos/core/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`/pos/core/categories/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete category");
}
