import { Router } from "express";
const router = Router();

router.get("/", async (_req, res) => {
  try {
    res.json([]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (_req, res) => {
  try {
    // PURCHASE
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/waste", async (_req, res) => {
  try {
    // WASTE
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/adjust", async (_req, res) => {
  try {
    // ADJUSTMENT
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/history", async (_req, res) => {
  try {
    res.json([]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
