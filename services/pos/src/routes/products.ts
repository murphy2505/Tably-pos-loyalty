// services/pos/src/routes/products.ts
import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = Router();

// GET /pos/core/products
router.get("/", getAllProducts);

// GET /pos/core/products/:id
router.get("/:id", getProductById);

// POST /pos/core/products
router.post("/", createProduct);

// PUT /pos/core/products/:id
router.put("/:id", updateProduct);

// DELETE /pos/core/products/:id
router.delete("/:id", deleteProduct);

export default router;
