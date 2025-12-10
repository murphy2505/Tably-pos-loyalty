// services/pos/src/services/variantService.ts

// @ts-nocheck
import { prisma } from "../db/prisma";

// =======================
// Types (DTO)
// =======================

export type CreateVariantInput = {
  productId: string;

  name: string;
  sku?: string | null;

  // Prisma Decimal velden – wij accepteren string of number
  priceInclVat: string | number;
  vatRate: string | number;

  sortOrder?: number;
  isActive?: boolean;
};

export type UpdateVariantInput = Partial<CreateVariantInput>;

// =======================
// Helpers
// =======================

function baseWhere(tenantId: string, extra?: object) {
  return {
    tenantId,
    ...(extra ?? {}),
  };
}

function normalizeDecimal(value: string | number | undefined, digits: number) {
  if (value === undefined) return undefined;
  if (typeof value === "number") {
    return value.toFixed(digits);
  }
  // laat string zoals hij is (verwachting: "12.34")
  return value;
}

// =======================
// CRUD
// =======================

/**
 * Haal alle varianten op voor een tenant + optional productId.
 */
export async function listVariants(tenantId: string, options?: { productId?: string; includeInactive?: boolean }) {
  return prisma.productVariant.findMany({ where: { productId: options?.productId }, orderBy: { id: "asc" } });
}

/**
 * Eén variant op id + tenant.
 */
export async function getVariantById(tenantId: string, id: string) {
  return prisma.productVariant.findFirst({ where: { id } });
}

/**
 * Nieuwe variant aanmaken.
 */
export async function createVariant(tenantId: string, data: CreateVariantInput) {
  return prisma.productVariant.create({
    data: {
      productId: data.productId,
      name: data.name.trim(),
      sku: data.sku ?? null,
      price: Number(data.priceInclVat),
      vatRate: Number(data.vatRate),
      active: data.isActive ?? true,
    } as any,
  });
}

/**
 * Variant updaten (alleen meegegeven velden).
 */
export async function updateVariant(tenantId: string, id: string, data: UpdateVariantInput) {
  return prisma.productVariant.update({
    where: { id },
    data: {
      ...(data.productId !== undefined && { productId: data.productId }),
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.sku !== undefined && { sku: data.sku }),
      ...(data.priceInclVat !== undefined && { price: Number(data.priceInclVat) }),
      ...(data.vatRate !== undefined && { vatRate: Number(data.vatRate) }),
      ...(data.isActive !== undefined && { active: data.isActive }),
    } as any,
  });
}

/**
 * Soft delete: zet isActive = false.
 */
export async function deleteVariant(tenantId: string, id: string) {
  return prisma.productVariant.update({ where: { id }, data: { active: false } } as any);
}
