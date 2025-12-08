// services/pos/src/routes/menus.ts

import { Router } from "express";
import {
  listMenusHandler,
  getMenuHandler,
  getMenuBySlugHandler,
  createMenuHandler,
  updateMenuHandler,
  deleteMenuHandler,
} from "../controllers/menuController";

const router = Router();

// GET /pos/core/menus
router.get("/", listMenusHandler);

// GET /pos/core/menus/:id
router.get("/:id", getMenuHandler);

// GET /pos/core/menus/slug/:slug
router.get("/slug/:slug", getMenuBySlugHandler);

// POST /pos/core/menus
router.post("/", createMenuHandler);

// PUT /pos/core/menus/:id
router.put("/:id", updateMenuHandler);

// DELETE /pos/core/menus/:id
router.delete("/:id", deleteMenuHandler);

export default router;
