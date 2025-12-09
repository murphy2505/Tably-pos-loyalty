// services/pos/src/controllers/menuItemsController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getTenantId(req: Request): string {
  // Zelfde patroon als bij categories/stock: header, anders fallback
  return (req.header("x-tenant-id") as string) || "demo-tenant";
}

/**
 * GET /pos/core/menu-items?menuId=...
 * Haalt alle menu-items op (optioneel gefilterd op menuId)
 */
export async function getAllMenuItems(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const menuId = req.query.menuId as string | undefined;

    const where: any = { tenantId };
    if (menuId) {
      where.menuId = menuId;
    }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: [{ menuId: "asc" }, { sortOrder: "asc" }],
      include: {
        product: true,
        variant: true, // mag null zijn
        menu: true,
      },
    });

    res.json(items);
  } catch (err) {
    console.error("Error getAllMenuItems", err);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
}

/**
 * POST /pos/core/menu-items
 * body: { menuId, productId, variantId?, label?, shortLabel?, sortOrder?, isVisible?, isFavorite? }
 */
export async function createMenuItem(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const {
      menuId,
      productId,
      variantId,
      label,
      shortLabel,
      sortOrder,
      isVisible,
      isFavorite,
    } = req.body;

    if (!menuId || !productId) {
      return res.status(400).json({
        message: "menuId en productId zijn verplicht",
      });
    }

    const item = await prisma.menuItem.create({
      data: {
        tenantId,
        menuId,
        productId,
        variantId: variantId || null,
        label: label || null,
        shortLabel: shortLabel || null,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
        isVisible: typeof isVisible === "boolean" ? isVisible : true,
        isFavorite: typeof isFavorite === "boolean" ? isFavorite : false,
      },
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Error createMenuItem", err);
    res.status(500).json({ message: "Failed to create menu item" });
  }
}

/**
 * PUT /pos/core/menu-items/:id
 * body: subset van velden om bij te werken
 */
export async function updateMenuItem(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    const {
      menuId,
      productId,
      variantId,
      label,
      shortLabel,
      sortOrder,
      isVisible,
      isFavorite,
    } = req.body;

    // Optioneel: check op tenant-scope
    const existing = await prisma.menuItem.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        menuId: menuId ?? existing.menuId,
        productId: productId ?? existing.productId,
        variantId:
          typeof variantId === "undefined" ? existing.variantId : variantId,
        label: typeof label === "undefined" ? existing.label : label,
        shortLabel:
          typeof shortLabel === "undefined" ? existing.shortLabel : shortLabel,
        sortOrder:
          typeof sortOrder === "number" ? sortOrder : existing.sortOrder,
        isVisible:
          typeof isVisible === "boolean" ? isVisible : existing.isVisible,
        isFavorite:
          typeof isFavorite === "boolean" ? isFavorite : existing.isFavorite,
      },
    });

    res.json(item);
  } catch (err) {
    console.error("Error updateMenuItem", err);
    res.status(500).json({ message: "Failed to update menu item" });
  }
}

/**
 * DELETE /pos/core/menu-items/:id
 */
export async function deleteMenuItem(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    // Zelfde tenant-check
    const existing = await prisma.menuItem.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    console.error("Error deleteMenuItem", err);
    res.status(500).json({ message: "Failed to delete menu item" });
  }
}
