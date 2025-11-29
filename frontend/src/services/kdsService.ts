import type { KdsStatus } from "../types/kds";
import type { KdsTicket } from "../types/kds";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "KDS request failed");
  }
  return res.json() as Promise<T>;
}

export async function getKdsTickets(): Promise<KdsTicket[]> {
  const res = await fetch("/pos/kds");
  return handle<KdsTicket[]>(res);
}

export async function createKdsTicket(payload: {
  id: string;
  ticketNumber: number;
  items: { name: string; qty: number }[];
}): Promise<void> {
  const res = await fetch("/pos/kds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create KDS ticket");
}

export async function updateKdsStatus(id: string, status: KdsStatus): Promise<void> {
  const res = await fetch(`/pos/kds/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update KDS status");
}

export async function deleteKdsTicket(id: string): Promise<void> {
  const res = await fetch(`/pos/kds/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete KDS ticket");
}
