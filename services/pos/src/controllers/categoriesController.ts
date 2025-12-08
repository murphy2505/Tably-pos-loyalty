// services/pos/src/controllers/categoriesController.ts

import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma";

/**
 * Haal tenantId uit req. We proberen eerst req.tenantId (middleware),
 * en vallen anders terug op de x-tenant-id header.
 */
function getTenantId(req: Request): string {
  const fromReq = (req as any).tenantId;
  const fromHeader = req.headers["x-tenant-id"];

  const tenantId = typeof fromReq === "string" ? fromReq : typeof fromHeader === "string" ? fromHeader : null;

  if (!tenantId) {
    // zelfde gedrag als je eerdere "Missing tenantId" helper
    throw new Error("Missing tenantId");
  }

  return tenantId;
}

/**
 * GET /pos/core/categories
 * Haalt alle categorieën voor deze tenant op, gesorteerd op sortOrder.
 */
export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const tenantId = getTenantId(req);

    const categories = await prisma.category.findMany({
      where: { tenantId },
      orderBy: { sortOrder: "asc" },
    });

    res.json(categories);
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res.status(400).json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}

/**
 * POST /pos/core/categories
 * Body: { name: string; color?: string; sortOrder?: number; isActive?: boolean }
 */
export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const tenantId = getTenantId(req);
    const { name, color, sortOrder, isActive } = req.body ?? {};

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is verplicht" });
    }

    const category = await prisma.category.create({
      data: {
        tenantId,
        name: name.trim(),
        color: color ?? null,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });

    res.status(201).json(category);
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res.status(400).json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}

/**
 * PUT /pos/core/categories/:id
 * Body: { name?: string; color?: string; sortOrder?: number; isActive?: boolean }
 */
export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const { name, color, sortOrder, isActive } = req.body ?? {};

    if (!id) {
      return res.status(400).json({ message: "id is verplicht in de URL" });
    }

    // Eerst checken of deze categorie bij deze tenant hoort
    const existing = await prisma.category.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Categorie niet gevonden" });
    }

    const data: {
      name?: string;
      color?: string | null;
      sortOrder?: number;
      isActive?: boolean;
    } = {};

    if (typeof name === "string") data.name = name.trim();
    if (typeof color === "string" || color === null) data.color = color ?? null;
    if (typeof sortOrder === "number") data.sortOrder = sortOrder;
    if (typeof isActive === "boolean") data.isActive = isActive;

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res.status(400).json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}

/**
 * DELETE /pos/core/categories/:id
 *
 * Voor nu doen we een "soft delete": we zetten isActive = false.
 * Dan blijven referenties vanuit producten heel blijven.
 */
export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id is verplicht in de URL" });
    }

    const existing = await prisma.category.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Categorie niet gevonden" });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    res.json({ success: true, category: updated });
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res.status(400).json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}
