import { Router } from "express";
import type { PosOrder, OrderLine, OrderTotals, PaymentMethod } from "../types/order";

const router = Router();

// In-memory store
const orders: PosOrder[] = [];
let ticketCounter = 1000;

// POST /api/pos/orders
router.post("/", (req, res) => {
  const body: {
    lines: OrderLine[];
    totals: OrderTotals;
    paymentMethod?: PaymentMethod;
    source?: "counter" | "phone" | "web" | "kiosk";
  } = req.body;

  // Minimal validation
  if (!body || !Array.isArray(body.lines) || body.lines.length === 0) {
    return res.status(400).json({ error: "Lines are required" });
  }
  if (!body.totals || typeof body.totals.total !== "number" || body.totals.total < 0) {
    return res.status(400).json({ error: "Totals.total must be a non-negative number" });
  }

  // Create order
  ticketCounter += 1;
  const id = `O-${ticketCounter}`;
  const now = new Date();

  const created: PosOrder = {
    id,
    ticketNumber: ticketCounter,
    status: body.paymentMethod ? "paid" : "open",
    lines: body.lines,
    totals: body.totals,
    paymentMethod: body.paymentMethod,
    source: body.source ?? "counter",
    createdAt: now,
    updatedAt: now,
  };

  orders.push(created);

  return res.status(201).json({
    orderId: created.id,
    ticketNumber: created.ticketNumber,
    status: created.status,
  });
});

// GET /api/pos/orders/:id (optional detail)
router.get("/:id", (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  return res.json(order);
});

export default router;
