// services/pos/src/services/menuItemService.ts

// @ts-nocheck
// Sprint 2 menu items module temporarily disabled.
export function listMenuItems() { throw new Error("Menu items disabled"); }
export function createMenuItem() { throw new Error("Menu items disabled"); }
export function updateMenuItem() { throw new Error("Menu items disabled"); }
export function deleteMenuItem() { throw new Error("Menu items disabled"); }
export function reorderMenuItems() { throw new Error("Menu items disabled"); }

/**
 * Haal alle menu-items voor een tenant + menuId.
 */
export async function listMenuItems(tenantId: string, menuId: string) {
  throw new Error("Menu items disabled");
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
export async function createMenuItem(tenantId: string, data: CreateMenuItemInput) {
  throw new Error("Menu items disabled");
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
export async function updateMenuItem(tenantId: string, id: string, data: UpdateMenuItemInput) {
  throw new Error("Menu items disabled");
}

/**
 * Verwijder een menu-item voor deze tenant.
 */
export async function deleteMenuItem(tenantId: string, id: string) {
  throw new Error("Menu items disabled");
}

/**
 * Reorder: zet sortOrder = index+1 voor de opgegeven orderedIds.
 */
export async function reorderMenuItems(tenantId: string, menuId: string, orderedIds: string[]) {
  throw new Error("Menu items disabled");
}
