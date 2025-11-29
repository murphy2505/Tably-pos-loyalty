import { Router } from "express";
import { KdsTicket, KdsStatus } from "../types/kds";

const router = Router();
const kdsTickets: KdsTicket[] = [];

router.get("/", (_req, res) => {
  const sorted = [...kdsTickets].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
  res.json(sorted);
});

router.post("/", (req, res) => {
  const { id, ticketNumber, items } = req.body as {
    id?: string;
    ticketNumber?: number;
    items?: { name: string; qty: number }[];
  };
  if (!id || typeof ticketNumber !== "number" || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid ticket payload" });
  }
  const now = new Date();
  const ticket: KdsTicket = {
    id,
    ticketNumber,
    items: items.map(i => ({ name: i.name, qty: i.qty })),
    status: "queued",
    createdAt: now,
    updatedAt: now,
  };
  kdsTickets.push(ticket);
  res.status(201).json(ticket);
});

router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status?: KdsStatus };
  if (!status || !["queued", "preparing", "ready"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const ticket = kdsTickets.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ error: "Not found" });
  ticket.status = status;
  ticket.updatedAt = new Date();
  res.json(ticket);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const idx = kdsTickets.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  kdsTickets.splice(idx, 1);
  res.status(204).send();
});

export default router;
