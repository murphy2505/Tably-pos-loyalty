export type KdsStatus = "queued" | "preparing" | "ready";

export interface KdsTicket {
  id: string;
  ticketNumber: number;
  items: { name: string; qty: number }[];
  status: KdsStatus;
}
