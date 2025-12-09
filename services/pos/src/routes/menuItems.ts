import { Router } from "express";
import * as controller from "../controllers/menuItemsController";

const router = Router();

// GET   /pos/core/menu-items
router.get("/", controller.getAllMenuItems);

// POST  /pos/core/menu-items
router.post("/", controller.createMenuItem);

// PUT   /pos/core/menu-items/:id
router.put("/:id", controller.updateMenuItem);

// DELETE /pos/core/menu-items/:id
router.delete("/:id", controller.deleteMenuItem);

export default router;
