// services/pos/src/controllers/categoriesController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Hulpje om tenantId uit headers te halen
function getTenantId(req: Request): string {
  const tenantId = req.headers["x-tenant-id"];
  if (!tenantId || typeof tenantId !== "string") {
    throw new Error("Missing tenantId");
  }
  return tenantId;
}

// GET /pos/core/categories
export async function listCategories(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);

    const categories = await prisma.category.findMany({
      where: { tenantId },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    res.json(categories);
  } catch (err: any) {
    console.error("Error listCategories:", err);
    res.status(500).json({ error: "Failed to list categories" });
  }
}

// POST /pos/core/categories
export async function createCategory(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { name, color } = req.body as {
      name?: string;
      color?: string | null;
    };

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }

    // Bepaal volgende order voor deze tenant
    const maxOrder = await prisma.category.aggregate({
      where: { tenantId },
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    const category = await prisma.category.create({
      data: {
        tenantId,
        name,
        color: color ?? null,
        order: nextOrder,
      },
    });

    res.status(201).json(category);
  } catch (err: any) {
    console.error("Error createCategory:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
}

// PUT /pos/core/categories/:id
export async function updateCategory(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const { name, color } = req.body as {
      name?: string;
      color?: string | null;
    };

    // Eerst checken of deze category bij deze tenant hoort
    const existing = await prisma.category.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updated = await prisma.category.update({
      where: { id: existing.id },
      data: {
        name: typeof name === "string" && name.length > 0 ? name : existing.name,
        color: color !== undefined ? color : existing.color,
      },
    });

    res.json(updated);
  } catch (err: any) {
    console.error("Error updateCategory:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
}

// DELETE /pos/core/categories/:id
export async function deleteCategory(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    const existing = await prisma.category.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    await prisma.category.delete({
      where: { id: existing.id },
    });

    res.status(204).send();
  } catch (err: any) {
    console.error("Error deleteCategory:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
}
