import express from "express";
import {
  listMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../services/menuService";

const router = express.Router();

// alle endpoints verwachten x-tenant-id header
router.use((req, res, next) => {
  const tenantId = req.header("x-tenant-id");
  if (!tenantId) {
    return res.status(400).json({ error: "Missing x-tenant-id header" });
  }
  (req as any).tenantId = tenantId;
  next();
});

// GET /pos/menus
router.get("/", async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const menus = await listMenus(tenantId);
    res.json(menus);
  } catch (err) {
    console.error("Error listing menus", err);
    res.status(500).json({ error: "Failed to list menus" });
  }
});

// GET /pos/menus/:id  (incl. sections + items)
router.get("/:id", async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const { id } = req.params;
    const menu = await getMenuById(tenantId, id);
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }
    res.json(menu);
  } catch (err) {
    console.error("Error getting menu", err);
    res.status(500).json({ error: "Failed to get menu" });
  }
});

// POST /pos/menus
router.post("/", async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const menu = await createMenu(tenantId, req.body);
    res.status(201).json(menu);
  } catch (err) {
    console.error("Error creating menu", err);
    res.status(500).json({ error: "Failed to create menu" });
  }
});

// PUT /pos/menus/:id
router.put("/:id", async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const { id } = req.params;
    await updateMenu(tenantId, id, req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error updating menu", err);
    res.status(500).json({ error: "Failed to update menu" });
  }
});

// DELETE /pos/menus/:id
router.delete("/:id", async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const { id } = req.params;
    await deleteMenu(tenantId, id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting menu", err);
    res.status(500).json({ error: "Failed to delete menu" });
  }
});

export default router;
