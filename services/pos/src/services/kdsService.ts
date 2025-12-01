// services/pos/src/services/kdsService.ts

export type KdsStatus = "new" | "preparing" | "ready" | "done";

export interface KdsItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface KdsTicket {
  id: string;
  orderNumber: string;
  tableName?: string | null;
  channel: "inhouse" | "takeaway" | "delivery";
  status: KdsStatus;
  createdAt: Date;
  items: KdsItem[];
}

// voor nu: simpele in-memory store
let tickets: KdsTicket[] = [];

// simpele flow: new -> preparing -> ready -> done
function getNextStatus(current: KdsStatus): KdsStatus {
  switch (current) {
    case "new":
      return "preparing";
    case "preparing":
      return "ready";
    case "ready":
      return "done";
    case "done":
    default:
      return "done";
  }
}

export async function listKdsTickets(): Promise<KdsTicket[]> {
  return tickets.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

// wordt door /kds/:id/advance gebruikt
export async function advanceKdsTicket(id: string): Promise<KdsTicket> {
  const t = tickets.find((t) => t.id === id);
  if (!t) {
    throw new Error("Ticket not found");
  }
  t.status = getNextStatus(t.status);
  return t;
}

// handig voor later (POS → KDS), en om te testen
export async function createKdsTicket(
  ticket: Omit<KdsTicket, "createdAt">
): Promise<KdsTicket> {
  const full: KdsTicket = { ...ticket, createdAt: new Date() };
  tickets.push(full);
  return full;
}
