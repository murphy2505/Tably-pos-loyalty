// services/pos/src/controllers/menuController.ts

import { Request, Response, NextFunction } from "express";
// @ts-nocheck
import { } from "../services/menuService";

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

    return res.status(503).json({ message: "Menu module disabled" });
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

    return res.status(503).json({ message: "Menu module disabled" });
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

    return res.status(503).json({ message: "Menu module disabled" });
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
    return res.status(503).json({ message: "Menu module disabled" });
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
    return res.status(503).json({ message: "Menu module disabled" });
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

    return res.status(503).json({ message: "Menu module disabled" });
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res
        .status(400)
        .json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}
