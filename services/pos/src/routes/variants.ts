// services/pos/src/routes/variants.ts

import { Router } from "express";
import {
  listVariantsHandler,
  getVariantHandler,
  createVariantHandler,
  updateVariantHandler,
  deleteVariantHandler,
} from "../controllers/variantController";

const router = Router();

// GET /pos/core/variants
router.get("/", listVariantsHandler);

// GET /pos/core/variants/:id
router.get("/:id", getVariantHandler);

// POST /pos/core/variants
router.post("/", createVariantHandler);

// PUT /pos/core/variants/:id
router.put("/:id", updateVariantHandler);

// DELETE /pos/core/variants/:id
router.delete("/:id", deleteVariantHandler);

export default router;
