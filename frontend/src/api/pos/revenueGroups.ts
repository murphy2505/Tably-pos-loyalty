export type RevenueGroup = {
  id: string;
  name: string;
  color?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const BASE_URL = "/pos/core/revenue-groups";

const headers = {
  "Content-Type": "application/json",
  "x-tenant-id": "demo",
};

async function handleRes(res: Response) {
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getRevenueGroups(): Promise<RevenueGroup[]> {
  const res = await fetch(BASE_URL);
  return handleRes(res);
}

export async function createRevenueGroup(payload: {
  name: string;
  color?: string;
}): Promise<RevenueGroup> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function updateRevenueGroup(
  id: string,
  payload: { name?: string; color?: string | null }
): Promise<RevenueGroup> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function deleteRevenueGroup(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  await handleRes(res);
}

export interface PosRevenueGroup {
  id: string;
  name: string;
  color?: string | null;
}

// TODO: vervang dit pad zodra het backend-endpoint beschikbaar is.
export async function fetchRevenueGroups(): Promise<RevenueGroup[]> {
  const res = await fetch("/pos/core/revenue-groups", { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
