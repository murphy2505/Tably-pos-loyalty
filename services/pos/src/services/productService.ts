// services/pos/src/services/productService.ts

import { prisma } from "../db/prisma";

// =======================
// Types (DTO)
// =======================

export type CreateProductInput = {
  name: string;
  categoryId: string;
  revenueGroupId?: string | null;
  priceIncl?: number;
  vatRate?: number;
};

export type UpdateProductInput = Partial<CreateProductInput>;

// =======================
// Helpers
// =======================

/**
 * Basis where-filter voor producten van een tenant.
 */
function baseWhere(tenantId: string, extra?: object) {
  return {
    tenantId,
    ...(extra ?? {}),
  };
}

// =======================
// CRUD functies
// =======================

/**
 * Haal alle producten voor een tenant op.
 * Optioneel: alleen actieve producten.
 */
export async function listProducts(
  tenantId: string,
  options?: { includeInactive?: boolean }
) {
  return prisma.product.findMany({
    where: baseWhere(tenantId),
    orderBy: { name: "asc" },
    include: {
      category: true,
      RevenueGroup: true,
      ProductVariant: true,
    },
  });
}

/**
 * Haal een product op op id + tenant.
 */
export async function getProductById(tenantId: string, id: string) {
  return prisma.product.findFirst({
    where: baseWhere(tenantId, { id }),
    include: {
      category: true,
      RevenueGroup: true,
      ProductVariant: true,
    },
  });
}

/**
 * Maak een nieuw product aan voor een tenant.
 */
export async function createProduct(
  tenantId: string,
  data: CreateProductInput
) {
  return prisma.product.create({
    data: {
      tenantId,
      name: data.name.trim(),
      categoryId: data.categoryId,
      revenueGroupId: data.revenueGroupId ?? null,
      priceIncl: (data.priceIncl ?? 0) as any,
      vatRate: Math.trunc(data.vatRate ?? 0),
    },
  });
}

/**
 * Update een product (alleen velden die zijn meegegeven).
 */
export async function updateProduct(
  tenantId: string,
  id: string,
  data: UpdateProductInput
) {
  // Eerst checken of het product bij deze tenant hoort
  const existing = await prisma.product.findFirst({
    where: baseWhere(tenantId, { id }),
  });

  if (!existing) {
    return null;
  }

  return prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.categoryId !== undefined && {
        categoryId: data.categoryId,
      }),
      ...(data.revenueGroupId !== undefined && {
        revenueGroupId: data.revenueGroupId,
      }),
      ...(data.priceIncl !== undefined && { priceIncl: data.priceIncl as any }),
      ...(data.vatRate !== undefined && { vatRate: Math.trunc(data.vatRate as number) }),
    },
  });
}

/**
 * Soft delete: zet isActive = false.
 * (Zo breken we geen referenties vanuit varianten of menu-items.)
 */
export async function deleteProduct(tenantId: string, id: string) {
  const existing = await prisma.product.findFirst({
    where: baseWhere(tenantId, { id }),
  });

  if (!existing) {
    return null;
  }

  await prisma.product.deleteMany({ where: { id, tenantId } });
  return existing;
}
