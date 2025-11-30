import type { KdsStatus, KdsTicket } from "../types/kds";

export async function getKdsTickets(): Promise<KdsTicket[]> {
  const res = await fetch("/pos/kds");
  if (!res.ok) {
    throw new Error("Kon KDS tickets niet laden");
  }
  return (await res.json()) as KdsTicket[];
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
  if (!res.ok) {
    throw new Error("Kon KDS ticket niet aanmaken");
  }
}

export async function updateKdsStatus(
  id: string,
  status: KdsStatus
): Promise<void> {
  const res = await fetch(`/pos/kds/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error("Kon KDS status niet bijwerken");
  }
}

export async function deleteKdsTicket(id: string): Promise<void> {
  const res = await fetch(`/pos/kds/${id}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    throw new Error("Kon KDS ticket niet verwijderen");
  }
}
