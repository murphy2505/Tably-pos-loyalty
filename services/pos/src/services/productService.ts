// services/pos/src/services/productService.ts

import { prisma } from "../db/prisma";

// =======================
// Types (DTO)
// =======================

export type CreateProductInput = {
  locationId?: string | null;

  name: string;
  description?: string | null;

  categoryId: string;
  revenueGroupId?: string | null;

  isActive?: boolean;
  isPopular?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;

  allowDiscount?: boolean;
  printGroup?: string | null;
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
  const { includeInactive = false } = options ?? {};

  return prisma.product.findMany({
    where: baseWhere(tenantId, includeInactive ? {} : { isActive: true }),
    orderBy: { name: "asc" },
    include: {
      category: true,
      revenueGroup: true,
      variants: true,
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
      revenueGroup: true,
      variants: true,
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
      locationId: data.locationId ?? null,

      name: data.name.trim(),
      description: data.description ?? null,

      categoryId: data.categoryId,
      revenueGroupId: data.revenueGroupId ?? null,

      isActive: data.isActive ?? true,
      isPopular: data.isPopular ?? false,
      isBestSeller: data.isBestSeller ?? false,
      isNew: data.isNew ?? false,

      allowDiscount: data.allowDiscount ?? true,
      printGroup: data.printGroup ?? null,
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
      // alleen invullen als ze aanwezig zijn in data
      ...(data.locationId !== undefined && {
        locationId: data.locationId,
      }),
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.categoryId !== undefined && {
        categoryId: data.categoryId,
      }),
      ...(data.revenueGroupId !== undefined && {
        revenueGroupId: data.revenueGroupId,
      }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.isPopular !== undefined && { isPopular: data.isPopular }),
      ...(data.isBestSeller !== undefined && {
        isBestSeller: data.isBestSeller,
      }),
      ...(data.isNew !== undefined && { isNew: data.isNew }),
      ...(data.allowDiscount !== undefined && {
        allowDiscount: data.allowDiscount,
      }),
      ...(data.printGroup !== undefined && {
        printGroup: data.printGroup,
      }),
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

  return prisma.product.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
}
