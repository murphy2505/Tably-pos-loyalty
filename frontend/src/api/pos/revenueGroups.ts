export type RevenueGroup = {
  id: string;
  name: string;
  color?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const BASE_URL = "/pos/core/revenue-groups";

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
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
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
