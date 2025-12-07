// frontend/src/api/pos/categories.ts

export interface PosCategory {
  id: string;
  name: string;
  color?: string | null;
  order?: number;
  parentId?: string | null;
}

const TENANT_ID = "demo-tenant";
const DEV_TOKEN = "DUMMY_DEV_TOKEN";

async function parseJsonResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
  return res.json();
}

export async function fetchCategories(): Promise<PosCategory[]> {
  const res = await fetch("/pos/core/categories", {
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getCategories(): Promise<PosCategory[]> {
  const res = await fetch("/pos/core/categories", {
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
  });
  return parseJsonResponse(res);
}

export async function createCategory(payload: {
  name: string;
  color?: string;
  order?: number;
  parentId?: string | null;
}): Promise<PosCategory> {
  const res = await fetch("/pos/core/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateCategory(
  id: string,
  payload: Partial<Pick<PosCategory, "name" | "color" | "order" | "parentId">>
): Promise<PosCategory> {
  const res = await fetch(`/pos/core/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`/pos/core/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
}
