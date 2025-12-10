// services/pos/src/controllers/menuItemsController.ts
// @ts-nocheck
import { Request, Response } from "express";

function getTenantId(req: Request): string {
  // Zelfde patroon als bij categories/stock: header, anders fallback
  return (req.header("x-tenant-id") as string) || "demo-tenant";
}

/**
 * GET /pos/core/menu-items?menuId=...
 * Haalt alle menu-items op (optioneel gefilterd op menuId)
 */
export async function getAllMenuItems(req: Request, res: Response) {
  res.status(503).json({ message: "Menu items module disabled" });
}

/**
 * POST /pos/core/menu-items
 * body: { menuId, productId, variantId?, label?, shortLabel?, sortOrder?, isVisible?, isFavorite? }
 */
export async function createMenuItem(req: Request, res: Response) {
  res.status(503).json({ message: "Menu items module disabled" });
}

/**
 * PUT /pos/core/menu-items/:id
 * body: subset van velden om bij te werken
 */
export async function updateMenuItem(req: Request, res: Response) {
  res.status(503).json({ message: "Menu items module disabled" });
}

/**
 * DELETE /pos/core/menu-items/:id
 */
export async function deleteMenuItem(req: Request, res: Response) {
  res.status(503).json({ message: "Menu items module disabled" });
}
