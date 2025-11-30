import { Router } from "express";

const router = Router();

// GET /customers (stub; echte klantdata zit in loyalty-service)
router.get("/", (_req, res) => {
  res.json([]);
});

// Optional detail stub
router.get("/:id", (_req, res) => {
  res.status(404).json({ error: "Customer not found in POS context" });
});

export default router;
