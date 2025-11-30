import { Router } from "express";
import { v4 as uuid } from "uuid";

const router = Router();

type PaymentMethod = "cash" | "card" | "sumup" | "qr" | "unknown";

interface PosOrderLine {
  productId: number;
  name: string;
  price: number;
  qty: number;
}

interface PosOrderTotals {
  subtotal: number;
  discount: number;
  total: number;
}

interface StoredOrder {
  orderId: string;
  ticketNumber: number;
  lines: PosOrderLine[];
  totals: PosOrderTotals;
  paymentMethod: PaymentMethod;
  source: string;
  createdAt: string;
}

// Simpele in-memory store
const orders: StoredOrder[] = [];

// POST /pos/orders
router.post("/", (req, res) => {
  try {
    const { lines, totals, paymentMethod, source } = req.body as {
      lines?: PosOrderLine[];
      totals?: PosOrderTotals;
      paymentMethod?: PaymentMethod;
      source?: string;
    };

    // Minimale validatie
    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must have at least one line" });
    }

    if (!totals || typeof totals.total !== "number") {
      return res
        .status(400)
        .json({ error: "Order totals are missing or invalid" });
    }

    const method: PaymentMethod = paymentMethod ?? "unknown";
    const ticketNumber = orders.length + 1;
    const orderId = uuid();

    const stored: StoredOrder = {
      orderId,
      ticketNumber,
      lines,
      totals,
      paymentMethod: method,
      source: source ?? "counter",
      createdAt: new Date().toISOString(),
    };

    orders.push(stored);

    // Dit is exact wat createPosOrder verwacht
    return res.status(201).json({
      ok: true,
      orderId,
      ticketNumber,
    });
  } catch (e: any) {
    console.error("Error in /pos/orders:", e);
    return res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
