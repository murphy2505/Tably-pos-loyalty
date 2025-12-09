// services/pos/src/routes/categories.ts
import { Router } from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController";

const router = Router();

// GET /pos/core/categories
router.get("/", listCategories);

// POST /pos/core/categories
router.post("/", createCategory);

// PUT /pos/core/categories/:id
router.put("/:id", updateCategory);

// DELETE /pos/core/categories/:id
router.delete("/:id", deleteCategory);

export default router;
