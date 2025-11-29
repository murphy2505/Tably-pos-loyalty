export type KdsStatus = "queued" | "preparing" | "ready";

export interface KdsTicket {
  id: string;               // koppeling aan orderId (bv. "O-1002")
  ticketNumber: number;
  items: { name: string; qty: number }[];
  status: KdsStatus;
  createdAt: Date;
  updatedAt: Date;
}
