import { Request, Response } from "express";
import {
  listVariantsByProduct,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
} from "../services/variantsService";

function getTenantId(req: Request): string {
  const tenantId = req.header("x-tenant-id");
  if (!tenantId || typeof tenantId !== "string") {
    throw new Error("Missing tenantId");
  }
  return tenantId;
}

export async function listVariantsHandler(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { productId } = req.query as { productId?: string };
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }
    const variants = await listVariantsByProduct(tenantId, productId);
    res.json(variants);
  } catch (err: any) {
    console.error("listVariantsHandler error", err);
    res.status(500).json({ message: err.message || "Failed to list variants" });
  }
}

export async function getVariantHandler(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const variant = await getVariantById(tenantId, id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    res.json(variant);
  } catch (err: any) {
    console.error("getVariantHandler error", err);
    res.status(500).json({ message: err.message || "Failed to get variant" });
  }
}

export async function createVariantHandler(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { productId, name, sku, priceInclVat, vatRate, sortOrder, isActive } = req.body || {};
    if (!productId || !name || priceInclVat === undefined || vatRate === undefined) {
      return res.status(400).json({ message: "productId, name, priceInclVat and vatRate are required" });
    }
    const created = await createVariant(tenantId, {
      productId,
      name,
      sku,
      priceInclVat,
      vatRate,
      sortOrder,
      isActive,
    });
    res.status(201).json(created);
  } catch (err: any) {
    console.error("createVariantHandler error", err);
    res.status(500).json({ message: err.message || "Failed to create variant" });
  }
}

export async function updateVariantHandler(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const updated = await updateVariant(tenantId, id, req.body || {});
    res.json(updated);
  } catch (err: any) {
    console.error("updateVariantHandler error", err);
    if (err.message === "Variant not found") return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message || "Failed to update variant" });
  }
}

export async function deleteVariantHandler(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    await deleteVariant(tenantId, id);
    res.status(204).send();
  } catch (err: any) {
    console.error("deleteVariantHandler error", err);
    if (err.message === "Variant not found") return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message || "Failed to delete variant" });
  }
}
