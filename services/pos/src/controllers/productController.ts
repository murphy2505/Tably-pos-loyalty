// services/pos/src/controllers/productController.ts

import { Request, Response, NextFunction } from "express";
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  CreateProductInput,
  UpdateProductInput,
} from "../services/productService";

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
 * GET /pos/core/products
 * Optioneel queryparam: ?includeInactive=true
 */
export async function listProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const includeInactive =
      String(req.query.includeInactive).toLowerCase() === "true";

    const products = await listProducts(tenantId, { includeInactive });

    res.json(products);
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
 * GET /pos/core/products/:id
 */
export async function getProductHandler(
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

    const product = await getProductById(tenantId, id);

    if (!product) {
      return res.status(404).json({ message: "Product niet gevonden" });
    }

    res.json(product);
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
 * POST /pos/core/products
 * Body: CreateProductInput
 */
export async function createProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const body = req.body as CreateProductInput;

    if (!body?.name || typeof body.name !== "string") {
      return res.status(400).json({ message: "name is verplicht" });
    }

    if (!body?.categoryId || typeof body.categoryId !== "string") {
      return res.status(400).json({ message: "categoryId is verplicht" });
    }

    const product = await createProduct(tenantId, body);

    res.status(201).json(product);
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
 * PUT /pos/core/products/:id
 * Body: UpdateProductInput
 */
export async function updateProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const body = req.body as UpdateProductInput;

    if (!id) {
      return res.status(400).json({ message: "id is verplicht in de URL" });
    }

    const updated = await updateProduct(tenantId, id, body);

    if (!updated) {
      return res.status(404).json({ message: "Product niet gevonden" });
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
 * DELETE /pos/core/products/:id
 * Soft delete (isActive = false)
 */
export async function deleteProductHandler(
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

    const deleted = await deleteProduct(tenantId, id);

    if (!deleted) {
      return res.status(404).json({ message: "Product niet gevonden" });
    }

    res.json({ success: true, product: deleted });
  } catch (err) {
    if ((err as Error).message === "Missing tenantId") {
      return res
        .status(400)
        .json({ message: "Missing tenantId (x-tenant-id header is verplicht)" });
    }
    next(err);
  }
}
