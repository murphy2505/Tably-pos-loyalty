import { Router } from "express";
const router = Router();

router.post("/", async (_req, res) => {
  try {
    res.status(201).json({ id: "var-1" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (_req, res) => {
  try {
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (_req, res) => {
  try {
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
