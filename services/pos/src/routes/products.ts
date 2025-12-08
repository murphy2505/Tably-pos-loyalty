// services/pos/src/routes/products.ts

import { Router } from "express";
import {
  listProductsHandler,
  getProductHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/productController";

const router = Router();

// In app.ts verwacht je iets als:
// app.use("/pos/core/products", productsRouter);
// Daarom zijn de paths hier relatief (" / " en "/:id").

// GET /pos/core/products
router.get("/", listProductsHandler);

// GET /pos/core/products/:id
router.get("/:id", getProductHandler);

// POST /pos/core/products
router.post("/", createProductHandler);

// PUT /pos/core/products/:id
router.put("/:id", updateProductHandler);

// DELETE /pos/core/products/:id
router.delete("/:id", deleteProductHandler);

export default router;
