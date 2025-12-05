import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listMenuItems(tenantId: string, menuId: string) {
  return prisma.menuItem.findMany({
    where: { tenantId, menuId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createMenuItem(
  tenantId: string,
  data: {
    menuId: string;
    sectionId?: string | null;
    productId?: string | null;
    productVariantId?: string | null;
    label?: string | null;
    shortLabel?: string | null;
    badge?: string | null;
    color?: string | null;
    tileSize?: string;
    isFavorite?: boolean;
    isVisible?: boolean;
    sortOrder?: number;
    showPrice?: boolean;
    showImage?: boolean;
  }
) {
  // Bepaal sortOrder: laatste + 1
  const maxSort = await prisma.menuItem.aggregate({
    where: { tenantId, menuId: data.menuId },
    _max: { sortOrder: true },
  });

  const sortOrder = data.sortOrder ?? (maxSort._max.sortOrder ?? 0) + 1;

  return prisma.menuItem.create({
    data: {
      tenantId,
      menuId: data.menuId,
      sectionId: data.sectionId ?? null,
      productId: data.productId ?? null,
      productVariantId: data.productVariantId ?? null,
      label: data.label ?? null,
      shortLabel: data.shortLabel ?? null,
      badge: data.badge ?? null,
      color: data.color ?? null,
      tileSize: data.tileSize ?? "AUTO",
      isFavorite: data.isFavorite ?? false,
      isVisible: data.isVisible ?? true,
      sortOrder,
      showPrice: data.showPrice ?? true,
      showImage: data.showImage ?? true,
    },
  });
}

export async function updateMenuItem(
  tenantId: string,
  id: string,
  data: Partial<{
    sectionId: string | null;
    productId: string | null;
    productVariantId: string | null;
    label: string | null;
    shortLabel: string | null;
    badge: string | null;
    color: string | null;
    tileSize: string;
    isFavorite: boolean;
    isVisible: boolean;
    sortOrder: number;
    showPrice: boolean;
    showImage: boolean;
  }>
) {
  return prisma.menuItem.updateMany({
    where: { id, tenantId },
    data,
  });
}

export async function deleteMenuItem(tenantId: string, id: string) {
  return prisma.menuItem.deleteMany({
    where: { id, tenantId },
  });
}

export async function reorderMenuItems(
  tenantId: string,
  menuId: string,
  orderedIds: string[]
) {
  // heel simpel: loop en zet sortOrder = index
  const updates = orderedIds.map((id, index) =>
    prisma.menuItem.updateMany({
      where: { id, tenantId, menuId },
      data: { sortOrder: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  return listMenuItems(tenantId, menuId);
}
