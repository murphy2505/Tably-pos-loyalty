// services/pos/src/services/variantService.ts

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
export async function listVariants(
  tenantId: string,
  options?: { productId?: string; includeInactive?: boolean }
) {
  const { productId, includeInactive = false } = options ?? {};

  return prisma.productVariant.findMany({
    where: {
      ...baseWhere(tenantId),
      ...(productId ? { productId } : {}),
      ...(includeInactive ? {} : { isActive: true }),
    },
    orderBy: { sortOrder: "asc" },
    include: {
      product: true,
    },
  });
}

/**
 * Eén variant op id + tenant.
 */
export async function getVariantById(tenantId: string, id: string) {
  return prisma.productVariant.findFirst({
    where: baseWhere(tenantId, { id }),
    include: {
      product: true,
    },
  });
}

/**
 * Nieuwe variant aanmaken.
 */
export async function createVariant(
  tenantId: string,
  data: CreateVariantInput
) {
  // sortOrder automatisch bepalen als niet opgegeven
  const maxSort = await prisma.productVariant.aggregate({
    where: {
      tenantId,
      productId: data.productId,
    },
    _max: { sortOrder: true },
  });

  const sortOrder =
    typeof data.sortOrder === "number"
      ? data.sortOrder
      : (maxSort._max.sortOrder ?? 0) + 1;

  const price = normalizeDecimal(data.priceInclVat, 2);
  const vat = normalizeDecimal(data.vatRate, 2);

  if (price === undefined || vat === undefined) {
    throw new Error(
      "priceInclVat en vatRate zijn verplicht bij het aanmaken van een variant"
    );
  }

  return prisma.productVariant.create({
    data: {
      tenantId,
      productId: data.productId,
      name: data.name.trim(),
      sku: data.sku ?? null,
      priceInclVat: price,
      vatRate: vat,
      sortOrder,
      isActive: data.isActive ?? true,
    },
  });
}

/**
 * Variant updaten (alleen meegegeven velden).
 */
export async function updateVariant(
  tenantId: string,
  id: string,
  data: UpdateVariantInput
) {
  const existing = await prisma.productVariant.findFirst({
    where: baseWhere(tenantId, { id }),
  });

  if (!existing) {
    return null;
  }

  const price =
    data.priceInclVat !== undefined
      ? normalizeDecimal(data.priceInclVat, 2)
      : undefined;
  const vat =
    data.vatRate !== undefined
      ? normalizeDecimal(data.vatRate, 2)
      : undefined;

  return prisma.productVariant.update({
    where: { id },
    data: {
      ...(data.productId !== undefined && { productId: data.productId }),
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.sku !== undefined && { sku: data.sku }),
      ...(price !== undefined && { priceInclVat: price }),
      ...(vat !== undefined && { vatRate: vat }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

/**
 * Soft delete: zet isActive = false.
 */
export async function deleteVariant(tenantId: string, id: string) {
  const existing = await prisma.productVariant.findFirst({
    where: baseWhere(tenantId, { id }),
  });

  if (!existing) {
    return null;
  }

  return prisma.productVariant.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
}
