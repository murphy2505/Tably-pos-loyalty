import { Router } from "express";
import prisma from "../prismaClient";

const router = Router();

/**
 * GET /pos/core/revenue-groups
 * Lijst met omzetgroepen
 */
router.get("/", async (_req, res) => {
  try {
    const groups = await prisma.revenueGroup.findMany({
      orderBy: { name: "asc" },
    });
    res.json(groups);
  } catch (e: any) {
    console.error("GET /pos/core/revenue-groups error:", e);
    res.status(500).json({ error: "Failed to load revenue groups" });
  }
});

/**
 * POST /pos/core/revenue-groups
 * Body: { name: string; color?: string }
 */
router.post("/", async (req, res) => {
  try {
    const { name, color } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }

    const group = await prisma.revenueGroup.create({
      data: {
        name: name.trim(),
        color: color || null,
      },
    });

    res.status(201).json(group);
  } catch (e: any) {
    console.error("POST /pos/core/revenue-groups error:", e);
    res.status(500).json({ error: "Failed to create revenue group" });
  }
});

/**
 * PUT /pos/core/revenue-groups/:id
 * Body: { name?: string; color?: string | null }
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body || {};

    const group = await prisma.revenueGroup.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        color: color === undefined ? undefined : color || null,
      },
    });

    res.json(group);
  } catch (e: any) {
    console.error("PUT /pos/core/revenue-groups/:id error:", e);
    res.status(500).json({ error: "Failed to update revenue group" });
  }
});

/**
 * DELETE /pos/core/revenue-groups/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.revenueGroup.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (e: any) {
    console.error("DELETE /pos/core/revenue-groups/:id error:", e);
    res.status(500).json({ error: "Failed to delete revenue group" });
  }
});

export default router;
