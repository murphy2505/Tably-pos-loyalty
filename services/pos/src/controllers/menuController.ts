// services/pos/src/controllers/menuController.ts

import { Request, Response, NextFunction } from "express";
import {
  listMenus,
  getMenuById,
  getMenuBySlug,
  createMenu,
  updateMenu,
  deleteMenu,
  CreateMenuInput,
  UpdateMenuInput,
} from "../services/menuService";

/**
 * Tenant helper: haalt tenantId uit middleware of headers
 */
function getTenantId(req: Request): string {
  const fromReq = (req as any).tenantId;
  const fromHeader = req.headers["x-tenant-id"];

  const tenantId =
    typeof fromReq === "string"
      ? fromReq
      : typeof fromHeader === "string"
      ? fromHeader
      : null;

  if (!tenantId) throw new Error("Missing tenantId");
  return tenantId;
}

/**
 * GET /pos/core/menus
 */
export async function listMenusHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const includeInactive =
      String(req.query.includeInactive).toLowerCase() === "true";

    const menus = await listMenus(tenantId, { includeInactive });

    res.json(menus);
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res
        .status(400)
        .json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}

/**
 * GET /pos/core/menus/:id
 */
export async function getMenuHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    const menu = await getMenuById(tenantId, id);

    if (!menu) return res.status(404).json({ message: "Menukaart niet gevonden" });

    res.json(menu);
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res
        .status(400)
        .json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}

/**
 * GET /pos/core/menus/slug/:slug
 */
export async function getMenuBySlugHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const { slug } = req.params;

    const menu = await getMenuBySlug(tenantId, slug);

    if (!menu) return res.status(404).json({ message: "Menukaart niet gevonden" });

    res.json(menu);
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res
        .status(400)
        .json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}

/**
 * POST /pos/core/menus
 */
export async function createMenuHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const body = req.body as CreateMenuInput;

    if (!body?.name || typeof body.name !== "string") {
      return res.status(400).json({ message: "name is verplicht" });
    }
    if (!body?.slug || typeof body.slug !== "string") {
      return res.status(400).json({ message: "slug is verplicht" });
    }

    const menu = await createMenu(tenantId, body);

    res.status(201).json(menu);
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res
        .status(400)
        .json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}

/**
 * PUT /pos/core/menus/:id
 */
export async function updateMenuHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const body = req.body as UpdateMenuInput;

    const updated = await updateMenu(tenantId, id, body);

    if (!updated)
      return res.status(404).json({ message: "Menukaart niet gevonden" });

    res.json(updated);
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res
        .status(400)
        .json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}

/**
 * DELETE /pos/core/menus/:id
 * Soft delete
 */
export async function deleteMenuHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    const deleted = await deleteMenu(tenantId, id);

    if (!deleted)
      return res.status(404).json({ message: "Menukaart niet gevonden" });

    res.json({ success: true, menu: deleted });
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res
        .status(400)
        .json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}
