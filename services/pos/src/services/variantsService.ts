import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function listVariantsByProduct(tenantId: string, productId: string) {
  return prisma.productVariant.findMany({
    where: { tenantId, productId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getVariantById(tenantId: string, id: string) {
  return prisma.productVariant.findFirst({ where: { id, tenantId } });
}

export async function createVariant(
  tenantId: string,
  data: {
    productId: string;
    name: string;
    sku?: string | null;
    priceInclVat: string | number;
    vatRate: string | number;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  const payload: Prisma.ProductVariantUncheckedCreateInput = {
    tenantId,
    productId: data.productId,
    name: data.name,
    sku: data.sku ?? null,
    priceInclVat: new Prisma.Decimal(data.priceInclVat.toString()),
    vatRate: new Prisma.Decimal(data.vatRate.toString()),
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
  };
  return prisma.productVariant.create({ data: payload });
}

export async function updateVariant(
  tenantId: string,
  id: string,
  data: {
    name?: string;
    sku?: string | null;
    priceInclVat?: string | number;
    vatRate?: string | number;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  const existing = await prisma.productVariant.findFirst({ where: { id, tenantId } });
  if (!existing) throw new Error("Variant not found");

  const payload: Prisma.ProductVariantUncheckedUpdateInput = {};
  if (typeof data.name === "string") payload.name = data.name;
  if (data.sku !== undefined) payload.sku = data.sku;
  if (data.priceInclVat !== undefined)
    payload.priceInclVat = new Prisma.Decimal(data.priceInclVat.toString());
  if (data.vatRate !== undefined) payload.vatRate = new Prisma.Decimal(data.vatRate.toString());
  if (typeof data.sortOrder === "number") payload.sortOrder = data.sortOrder;
  if (typeof data.isActive === "boolean") payload.isActive = data.isActive;

  return prisma.productVariant.update({ where: { id: existing.id }, data: payload });
}

export async function deleteVariant(tenantId: string, id: string) {
  const existing = await prisma.productVariant.findFirst({ where: { id, tenantId } });
  if (!existing) throw new Error("Variant not found");
  await prisma.productVariant.delete({ where: { id: existing.id } });
}
