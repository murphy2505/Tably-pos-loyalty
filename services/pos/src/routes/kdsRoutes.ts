// services/pos/src/routes/kdsRoutes.ts
import { Router } from "express";
import {
  listKdsTickets,
  advanceKdsTicket,
  type KdsTicket,
} from "../services/kdsService";

const router = Router();

/**
 * GET /pos/kds
 * (mounted via app.use("/pos/kds", kdsRoutes))
 */
router.get("/", async (_req, res) => {
  try {
    const tickets = await listKdsTickets();
    res.json(
      tickets.map((t: KdsTicket) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
      }))
    );
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Failed to load KDS tickets" });
  }
});

/**
 * POST /pos/kds/:id/advance
 */
router.post("/:id/advance", async (req, res) => {
  try {
    const ticket = await advanceKdsTicket(req.params.id);
    res.json({
      ...ticket,
      createdAt: ticket.createdAt.toISOString(),
    });
  } catch (e: any) {
    if (e.message === "Ticket not found") {
      res.status(404).json({ error: "Ticket not found" });
    } else {
      res.status(500).json({ error: e.message ?? "Failed to advance ticket" });
    }
  }
});

export default router;
