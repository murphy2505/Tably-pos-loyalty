// services/pos/src/services/menuItemService.ts

import { prisma } from "../db/prisma";

/**
 * Haal alle menu-items voor een tenant + menuId.
 */
export async function listMenuItems(tenantId: string, menuId: string) {
  return prisma.menuItem.findMany({
    where: { tenantId, menuId },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Input type voor het aanmaken van een menu-item.
 * LET OP:
 * We houden deze bewust in lijn met het Prisma-model:
 * - tenantId (apart argument)
 * - menuId (verplicht)
 * - sectionId? (optioneel)
 * - productId? (optioneel)
 * - sortOrder? (optioneel, wordt automatisch bepaald als hij ontbreekt)
 * - isActive? (optioneel, default = true)
 */
export type CreateMenuItemInput = {
  menuId: string;
  sectionId?: string | null;
  productId: string;
  variantId?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
  isFavorite?: boolean;
};

/**
 * Maak een nieuw menu-item.
 * Bepaalt automatisch sortOrder = laatste + 1 als die niet is meegegeven.
 */
export async function createMenuItem(
  tenantId: string,
  data: CreateMenuItemInput
) {
  // Bepaal sortOrder: laatste + 1
  const maxSort = await prisma.menuItem.aggregate({
    where: { tenantId, menuId: data.menuId },
    _max: { sortOrder: true },
  });

  const sortOrder =
    typeof data.sortOrder === "number"
      ? data.sortOrder
      : (maxSort._max.sortOrder ?? 0) + 1;

  return prisma.menuItem.create({
    data: {
      tenantId,
      menuId: data.menuId,
      sectionId: data.sectionId ?? null,
      productId: data.productId,
      variantId: data.variantId ?? null,
      sortOrder,
      isVisible: data.isVisible ?? true,
      isFavorite: data.isFavorite ?? false,
    },
  });
}

/**
 * Input type voor update; alleen velden die in het Prisma-model zitten.
 */
export type UpdateMenuItemInput = {
  sectionId?: string | null;
  productId?: string; // required column in schema; update only accepts string
  variantId?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
  isFavorite?: boolean;
};

/**
 * Update een menu-item (alleen toegestane velden).
 * We gebruiken updateMany om veilig op tenantId + id te filteren.
 */
export async function updateMenuItem(
  tenantId: string,
  id: string,
  data: UpdateMenuItemInput
) {
  const updateData: UpdateMenuItemInput = {};

  if (data.sectionId !== undefined) {
    updateData.sectionId = data.sectionId;
  }
  if (data.productId !== undefined) {
    updateData.productId = data.productId;
  }
  if (data.variantId !== undefined) {
    updateData.variantId = data.variantId;
  }
  if (data.sortOrder !== undefined) {
    updateData.sortOrder = data.sortOrder;
  }
  if (data.isVisible !== undefined) {
    updateData.isVisible = data.isVisible;
  }
  if (data.isFavorite !== undefined) {
    updateData.isFavorite = data.isFavorite;
  }

  return prisma.menuItem.updateMany({
    where: { id, tenantId },
    data: updateData as any,
  });
}

/**
 * Verwijder een menu-item voor deze tenant.
 */
export async function deleteMenuItem(tenantId: string, id: string) {
  return prisma.menuItem.deleteMany({
    where: { id, tenantId },
  });
}

/**
 * Reorder: zet sortOrder = index+1 voor de opgegeven orderedIds.
 */
export async function reorderMenuItems(
  tenantId: string,
  menuId: string,
  orderedIds: string[]
) {
  const updates = orderedIds.map((id, index) =>
    prisma.menuItem.updateMany({
      where: { id, tenantId, menuId },
      data: { sortOrder: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  return listMenuItems(tenantId, menuId);
}
