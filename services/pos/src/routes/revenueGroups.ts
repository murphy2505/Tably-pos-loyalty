// @ts-nocheck
import { Router } from "express";

const router = Router();

router.use((req, res) => {
  res.status(503).json({ error: "Revenue groups module disabled" });
});

export default router;
