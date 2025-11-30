import { Router } from "express";
import { z } from "zod";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

const router = Router();

function requireTenant(req: any, res: any): { tenantId: string; locationId?: string } | undefined {
  const tenantId = req.headers["x-tenant-id"];
  if (!tenantId || typeof tenantId !== "string") {
    res.status(400).json({ error: "Missing x-tenant-id header" });
    return;
  }
  const locationIdHeader = req.headers["x-location-id"];
  const locationId = typeof locationIdHeader === "string" ? locationIdHeader : undefined;
  return { tenantId, locationId };
}

const createSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
  parentId: z.string().nullable().optional(),
  order: z.number().int().min(0).optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
  parentId: z.string().nullable().optional(),
  order: z.number().int().min(0).optional(),
});

// GET /categories
router.get("/", async (req, res) => {
  const ctx = requireTenant(req, res);
  if (!ctx) return;
  try {
    const categories = await listCategories(ctx.tenantId, ctx.locationId);
    res.json(categories);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /categories
router.post("/", async (req, res) => {
  const ctx = requireTenant(req, res);
  if (!ctx) return;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const category = await createCategory(ctx.tenantId, parsed.data);
    res.status(201).json(category);
  } catch (e: any) {
    if (e.message.includes("Category")) {
      return res.status(404).json({ error: e.message });
    }
    res.status(500).json({ error: e.message });
  }
});

// PUT /categories/:id
router.put("/:id", async (req, res) => {
  const ctx = requireTenant(req, res);
  if (!ctx) return;
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const updated = await updateCategory(ctx.tenantId, req.params.id, parsed.data);
    res.json(updated);
  } catch (e: any) {
    if (e.message.includes("not found")) {
      return res.status(404).json({ error: e.message });
    }
    res.status(500).json({ error: e.message });
  }
});

// DELETE /categories/:id
router.delete("/:id", async (req, res) => {
  const ctx = requireTenant(req, res);
  if (!ctx) return;
  try {
    await deleteCategory(ctx.tenantId, req.params.id);
    res.status(204).send();
  } catch (e: any) {
    if (e.message.includes("not found")) {
      return res.status(404).json({ error: e.message });
    }
    if (e.message.includes("has products")) {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: e.message });
  }
});

export default router;