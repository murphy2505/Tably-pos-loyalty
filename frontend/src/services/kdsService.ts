// frontend/src/services/kdsService.ts
export type KdsStatus = "queued" | "preparing" | "ready";

export interface KdsTicketItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface KdsTicket {
  id: string;
  orderId?: string;
  tableId?: string;
  channel?: "inhouse" | "takeaway" | "delivery";
  items: KdsTicketItem[];
  status: KdsStatus;
  createdAt: string;
}

export async function fetchKdsTickets(): Promise<KdsTicket[]> {
  const res = await fetch("/pos/kds");
  if (!res.ok) throw new Error("Failed to load KDS tickets");
  return res.json();
}

export async function createKdsTicket(payload: Omit<KdsTicket, "createdAt">) {
  const res = await fetch("/pos/kds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create KDS ticket");
  return res.json();
}

export async function updateKdsStatus(id: string, status: KdsStatus) {
  const res = await fetch(`/pos/kds/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update KDS status");
  return res.json();
}

export async function deleteKdsTicket(id: string) {
  const res = await fetch(`/pos/kds/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete KDS ticket");
}
