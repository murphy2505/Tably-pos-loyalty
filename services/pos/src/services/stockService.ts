import { z } from "zod";

export async function listStock(tenantId: string) {
  // TODO: implement with DB/Prisma; for now, return empty list for tenant
  return [];
}

export async function purchase(
  tenantId: string,
  data: { stockItemId: string; amount: number }
) {
  // TODO: increment quantity; create StockMovement type PURCHASE
  return { ok: true };
}

export async function waste(
  tenantId: string,
  data: { stockItemId: string; amount: number }
) {
  // TODO: decrement quantity; create StockMovement type WASTE
  return { ok: true };
}

export async function adjust(
  tenantId: string,
  data: { stockItemId: string; amount: number }
) {
  // TODO: set quantity; create StockMovement type ADJUSTMENT
  return { ok: true };
}

export async function history(tenantId: string) {
  // TODO: return stock movements for tenant
  return [];
}