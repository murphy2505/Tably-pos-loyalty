// services/pos/src/controllers/variantController.ts

import { Request, Response, NextFunction } from "express";
import {
  listVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
  CreateVariantInput,
  UpdateVariantInput,
} from "../services/variantService";

/**
 * Haal tenantId uit req. We proberen eerst req.tenantId (middleware),
 * en vallen anders terug op de x-tenant-id header.
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

  if (!tenantId) {
    throw new Error("Missing tenantId");
  }

  return tenantId;
}

/**
 * GET /pos/core/variants
 * Optioneel:
 *  - ?productId=...
 *  - ?includeInactive=true
 */
export async function listVariantsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const productId = req.query.productId
      ? String(req.query.productId)
      : undefined;
    const includeInactive =
      String(req.query.includeInactive).toLowerCase() === "true";

    const variants = await listVariants(tenantId, {
      productId,
      includeInactive,
    });

    res.json(variants);
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
 * GET /pos/core/variants/:id
 */
export async function getVariantHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id is verplicht in de URL" });
    }

    const variant = await getVariantById(tenantId, id);

    if (!variant) {
      return res.status(404).json({ message: "Variant niet gevonden" });
    }

    res.json(variant);
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
 * POST /pos/core/variants
 * Body: CreateVariantInput
 */
export async function createVariantHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const body = req.body as CreateVariantInput;

    if (!body?.productId || typeof body.productId !== "string") {
      return res.status(400).json({ message: "productId is verplicht" });
    }

    if (!body?.name || typeof body.name !== "string") {
      return res.status(400).json({ message: "name is verplicht" });
    }

    if (
      body.priceInclVat === undefined ||
      body.vatRate === undefined ||
      (typeof body.priceInclVat !== "number" &&
        typeof body.priceInclVat !== "string") ||
      (typeof body.vatRate !== "number" &&
        typeof body.vatRate !== "string")
    ) {
      return res.status(400).json({
        message:
          "priceInclVat en vatRate zijn verplicht en moeten number of string zijn",
      });
    }

    const variant = await createVariant(tenantId, body);

    res.status(201).json(variant);
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
 * PUT /pos/core/variants/:id
 * Body: UpdateVariantInput
 */
export async function updateVariantHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const body = req.body as UpdateVariantInput;

    if (!id) {
      return res.status(400).json({ message: "id is verplicht in de URL" });
    }

    const updated = await updateVariant(tenantId, id, body);

    if (!updated) {
      return res.status(404).json({ message: "Variant niet gevonden" });
    }

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
 * DELETE /pos/core/variants/:id
 * Soft delete (isActive = false)
 */
export async function deleteVariantHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id is verplicht in de URL" });
    }

    const deleted = await deleteVariant(tenantId, id);

    if (!deleted) {
      return res.status(404).json({ message: "Variant niet gevonden" });
    }

    res.json({ success: true, variant: deleted });
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res
        .status(400)
        .json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}
