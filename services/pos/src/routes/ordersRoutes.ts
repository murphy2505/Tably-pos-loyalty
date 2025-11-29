import { Router } from "express";
import { v4 as uuid } from "uuid";

const router = Router();

// In-memory order store
const orders: any[] = [];

// POST /pos/orders
router.post("/", (req, res) => {
  try {
    const { lines, totals, paymentMethod, source } = req.body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ error: "Order must have at least one line" });
    }

    const orderId = uuid();
    const ticketNumber = orders.length + 1; // simpel oplopend nummer

    const order = {
      orderId,
      ticketNumber,
      lines,
      totals,
      paymentMethod: paymentMethod ?? "unknown",
      source: source ?? "counter",
      createdAt: new Date().toISOString(),
    };

    orders.push(order);

    return res.status(201).json({
      ok: true,
      orderId,
      ticketNumber,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
