import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function listVariantsByProduct(_tenantId: string, productId: string) {
  return prisma.productVariant.findMany({
    where: { productId },
    orderBy: { id: "asc" },
  });
}

export async function getVariantById(_tenantId: string, id: string) {
  return prisma.productVariant.findFirst({ where: { id } });
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
    productId: data.productId,
    name: data.name,
    sku: data.sku ?? null,
    price: new Prisma.Decimal(data.priceInclVat.toString()),
    vatRate: Math.trunc(Number(data.vatRate)),
    active: data.isActive ?? true,
  } as any;
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
  const existing = await prisma.productVariant.findFirst({ where: { id } });
  if (!existing) throw new Error("Variant not found");

  const payload: Prisma.ProductVariantUncheckedUpdateInput = {} as any;
  if (typeof data.name === "string") payload.name = data.name;
  if (data.sku !== undefined) payload.sku = data.sku;
  if (data.priceInclVat !== undefined)
    (payload as any).price = Number(data.priceInclVat);
  if (data.vatRate !== undefined) (payload as any).vatRate = Math.trunc(Number(data.vatRate));
  if (typeof data.isActive === "boolean") payload.active = data.isActive;

  return prisma.productVariant.update({ where: { id: existing.id }, data: payload });
}

export async function deleteVariant(_tenantId: string, id: string) {
  const existing = await prisma.productVariant.findFirst({ where: { id } });
  if (!existing) throw new Error("Variant not found");
  await prisma.productVariant.delete({ where: { id: existing.id } });
}
