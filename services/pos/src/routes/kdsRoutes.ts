import { Router } from "express";

export type KdsStatus = "queued" | "preparing" | "ready";

export interface KdsTicket {
  id: string;
  ticketNumber: number;
  items: { name: string; qty: number }[];
  status: KdsStatus;
  createdAt: string;
  updatedAt: string;
}

const router = Router();

// in-memory store
const kdsTickets: KdsTicket[] = [];

// GET /pos/kds
router.get("/", (_req, res) => {
  const sorted = [...kdsTickets].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  res.json(sorted);
});

// POST /pos/kds
router.post("/", (req, res) => {
  try {
    const { id, ticketNumber, items } = req.body as {
      id?: string;
      ticketNumber?: number;
      items?: { name: string; qty: number }[];
    };

    if (
      !id ||
      typeof ticketNumber !== "number" ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ error: "Invalid KDS ticket payload" });
    }

    const now = new Date().toISOString();

    const ticket: KdsTicket = {
      id,
      ticketNumber,
      items,
      status: "queued",
      createdAt: now,
      updatedAt: now,
    };

    kdsTickets.push(ticket);

    return res.status(201).json({ ok: true });
  } catch (e: any) {
    console.error("Error in POST /pos/kds:", e);
    return res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

// PATCH /pos/kds/:id/status
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status?: KdsStatus };

  if (!status || !["queued", "preparing", "ready"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const ticket = kdsTickets.find((t) => t.id === id);
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();

  res.json({ ok: true });
});

// DELETE /pos/kds/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = kdsTickets.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  kdsTickets.splice(index, 1);
  return res.status(204).send();
});

export default router;
