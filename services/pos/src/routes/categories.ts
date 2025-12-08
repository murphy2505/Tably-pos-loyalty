// services/pos/src/routes/categories.ts

import { Router } from "express";
import * as categoriesController from "../controllers/categoriesController";

const router = Router();

// GET /pos/core/categories  (in app.ts gemount als: app.use("/pos/core/categories", router))
router.get("/", categoriesController.listCategories);

// POST /pos/core/categories
router.post("/", categoriesController.createCategory);

// PUT /pos/core/categories/:id
router.put("/:id", categoriesController.updateCategory);

// DELETE /pos/core/categories/:id
router.delete("/:id", categoriesController.deleteCategory);

export default router;
