import { Router } from "express";
const router = Router();

router.post("/", async (_req, res) => {
  try {
    // nieuwe bon
    res.status(201).json({ id: "order-1" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:id/items", async (_req, res) => {
  try {
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/items/:itemId", async (_req, res) => {
  try {
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/items/:itemId", async (_req, res) => {
  try {
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:id/pay", async (_req, res) => {
  try {
    // betaal: method CASH | PIN | OTHER
    res.status(201).json({ status: "PAID" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:id/cancel", async (_req, res) => {
  try {
    res.status(201).json({ status: "CANCELLED" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
