// services/pos/src/routes/modifiers.ts
import express, { Request, Response } from "express";
import {
  listModifierGroups,
  getModifierGroupById,
  createModifierGroup,
  updateModifierGroup,
  deleteModifierGroup,
  createModifierOption,
  updateModifierOption,
  deleteModifierOption,
} from "../services/modifierService";

const router = express.Router();

// Kleine helper – in toekomst kun je dit vervangen door auth-middleware
function getTenantId(req: Request): string {
  const tenantId = (req.query.tenantId as string) || (req.headers["x-tenant-id"] as string);
  if (!tenantId) {
    throw new Error("Missing tenantId");
  }
  return tenantId;
}

// --------------------
// Groups
// --------------------

// GET /pos/core/modifiers/groups?tenantId=...
router.get("/groups", async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const groups = await listModifierGroups(tenantId);
    res.json(groups);
  } catch (err: any) {
    console.error("Error listModifierGroups", err);
    res.status(400).json({ error: err.message || "Failed to list modifier groups" });
  }
});

// GET /pos/core/modifiers/groups/:id?tenantId=...
router.get("/groups/:id", async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const group = await getModifierGroupById(tenantId, req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Modifier group not found" });
    }
    res.json(group);
  } catch (err: any) {
    console.error("Error getModifierGroupById", err);
    res.status(400).json({ error: err.message || "Failed to get modifier group" });
  }
});

// POST /pos/core/modifiers/groups?tenantId=...
router.post("/groups", async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const group = await createModifierGroup(tenantId, req.body);
    res.status(201).json(group);
  } catch (err: any) {
    console.error("Error createModifierGroup", err);
    res.status(400).json({ error: err.message || "Failed to create modifier group" });
  }
});

// PUT /pos/core/modifiers/groups/:id?tenantId=...
router.put("/groups/:id", async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const group = await updateModifierGroup(tenantId, req.params.id, req.body);
    if (!group) {
      return res.status(404).json({ error: "Modifier group not found" });
    }
    res.json(group);
  } catch (err: any) {
    console.error("Error updateModifierGroup", err);
    res.status(400).json({ error: err.message || "Failed to update modifier group" });
  }
});

// DELETE /pos/core/modifiers/groups/:id?tenantId=...
router.delete("/groups/:id", async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    await deleteModifierGroup(tenantId, req.params.id);
    res.status(204).send();
  } catch (err: any) {
    console.error("Error deleteModifierGroup", err);
    res.status(400).json({ error: err.message || "Failed to delete modifier group" });
  }
});

// --------------------
// Options
// --------------------

// POST /pos/core/modifiers/groups/:groupId/options?tenantId=...
router.post("/groups/:groupId/options", async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const option = await createModifierOption(tenantId, req.params.groupId, req.body);
    res.status(201).json(option);
  } catch (err: any) {
    console.error("Error createModifierOption", err);
    res.status(400).json({ error: err.message || "Failed to create modifier option" });
  }
});

// PUT /pos/core/modifiers/options/:id?tenantId=...
router.put("/options/:id", async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const option = await updateModifierOption(tenantId, req.params.id, req.body);
    if (!option) {
      return res.status(404).json({ error: "Modifier option not found" });
    }
    res.json(option);
  } catch (err: any) {
    console.error("Error updateModifierOption", err);
    res.status(400).json({ error: err.message || "Failed to update modifier option" });
  }
});

// DELETE /pos/core/modifiers/options/:id?tenantId=...
router.delete("/options/:id", async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    await deleteModifierOption(tenantId, req.params.id);
    res.status(204).send();
  } catch (err: any) {
    console.error("Error deleteModifierOption", err);
    res.status(400).json({ error: err.message || "Failed to delete modifier option" });
  }
});

export default router;
