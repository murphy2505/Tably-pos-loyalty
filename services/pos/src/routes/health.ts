import { Router } from "express";

const router = Router();

// Simple health check for the POS service
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "pos",
  });
});

export default router;
