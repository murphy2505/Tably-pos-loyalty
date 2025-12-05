import express from "express";
import {
  listMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
} from "../services/menuItemService";

const router = express.Router();

router.use((req, res, next) => {
  const tenantId = req.header("x-tenant-id");
  if (!tenantId) {
    return res.status(400).json({ error: "Missing x-tenant-id header" });
  }
  (req as any).tenantId = tenantId;
  next();
});

// GET /pos/menu-items?menuId=...
router.get("/", async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const menuId = req.query.menuId as string | undefined;

    if (!menuId) {
      return res.status(400).json({ error: "Missing menuId query param" });
    }

    const items = await listMenuItems(tenantId, menuId);
    res.json(items);
  } catch (err) {
    console.error("Error listing menu items", err);
    res.status(500).json({ error: "Failed to list menu items" });
  }
});

// POST /pos/menu-items
router.post("/", async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const item = await createMenuItem(tenantId, req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating menu item", err);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// PUT /pos/menu-items/:id
router.put("/:id", async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const { id } = req.params;
    await updateMenuItem(tenantId, id, req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error updating menu item", err);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// DELETE /pos/menu-items/:id
router.delete("/:id", async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const { id } = req.params;
    await deleteMenuItem(tenantId, id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting menu item", err);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// POST /pos/menu-items/reorder
// body: { menuId: string, orderedIds: string[] }
router.post("/reorder", async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const { menuId, orderedIds } = req.body as {
      menuId: string;
      orderedIds: string[];
    };

    if (!menuId || !Array.isArray(orderedIds)) {
      return res
        .status(400)
        .json({ error: "menuId and orderedIds[] are required" });
    }

    const items = await reorderMenuItems(tenantId, menuId, orderedIds);
    res.json(items);
  } catch (err) {
    console.error("Error reordering menu items", err);
    res.status(500).json({ error: "Failed to reorder menu items" });
  }
});

export default router;
