import type { PosOrderLine, PosOrderTotals } from "../types/pos";

export type PaymentMethod = "cash" | "card" | "sumup" | "qr";

export interface CreateOrderPayload {
  lines: PosOrderLine[];
  totals: PosOrderTotals;
  paymentMethod?: PaymentMethod;
  source?: "counter" | "phone" | "web" | "kiosk";
}

export interface CreateOrderResponse {
  orderId: string;
  ticketNumber: number;
  status: string;
}

export async function createPosOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const res = await fetch("/api/pos/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create POS order");
  }

  return res.json() as Promise<CreateOrderResponse>;
}
