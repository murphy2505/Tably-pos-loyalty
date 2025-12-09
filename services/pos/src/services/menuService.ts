// services/pos/src/services/menuService.ts

import { prisma } from "../db/prisma";

// =======================
// Types
// =======================

export type CreateMenuInput = {
  name: string;
  slug: string;

  description?: string | null;

  // Presentatie instellingen
  showImages?: boolean;
  showPrices?: boolean;
  showDescription?: boolean;
  showCategoryHeaders?: boolean;
  showProductBadges?: boolean;

  // Layout instellingen
  channel?: string; // "POS" | "WEB" | "BOTH"
  layoutType?: string; // "GRID" | "LIST" | etc.
  columns?: number | null;

  sortOrder?: number;
  isActive?: boolean;
};

export type UpdateMenuInput = Partial<CreateMenuInput>;

// =======================
// Helpers
// =======================

function baseWhere(tenantId: string, extra?: object) {
  return {
    tenantId,
    ...(extra ?? {}),
  };
}

// =======================
// Menu CRUD
// =======================

export async function listMenus(
  tenantId: string,
  options?: { includeInactive?: boolean }
) {
  const { includeInactive = false } = options ?? {};

  return prisma.menu.findMany({
    where: {
      ...baseWhere(tenantId),
      ...(includeInactive ? {} : { isActive: true }),
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getMenuById(tenantId: string, id: string) {
  return prisma.menu.findFirst({
    where: baseWhere(tenantId, { id }),
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
      },
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: true,
          section: true,
        },
      },
    },
  });
}

export async function getMenuBySlug(tenantId: string, slug: string) {
  return prisma.menu.findFirst({
    where: baseWhere(tenantId, { slug }),
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
      },
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: true,
          section: true,
        },
      },
    },
  });
}

export async function createMenu(tenantId: string, data: CreateMenuInput) {
  // sortOrder automatisch: laatste + 1
  const maxSort = await prisma.menu.aggregate({
    where: { tenantId },
    _max: { sortOrder: true },
  });

  const sortOrder =
    typeof data.sortOrder === "number"
      ? data.sortOrder
      : (maxSort._max.sortOrder ?? 0) + 1;

  // Ensure slug exists, is slug-safe, and unique globally (schema has @unique on slug)
  const base = (data.slug || data.name)
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "menu";

  const existing = await prisma.menu.findMany({
    where: { slug: { startsWith: base } },
    select: { slug: true },
  });
  const taken = new Set(existing.map((m) => m.slug));
  let slug = base;
  if (taken.has(slug)) {
    let i = 2;
    while (taken.has(`${base}-${i}`)) i++;
    slug = `${base}-${i}`;
  }

  return prisma.menu.create({
    data: {
      tenantId,
      name: data.name.trim(),
      slug,

      description: data.description ?? null,

      showImages: data.showImages ?? true,
      showPrices: data.showPrices ?? true,
      showDescription: data.showDescription ?? false,
      showCategoryHeaders: data.showCategoryHeaders ?? true,
      showProductBadges: data.showProductBadges ?? true,

      channel: data.channel ?? "BOTH",
      layoutType: data.layoutType ?? "GRID",
      columns: data.columns ?? 3,

      sortOrder,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateMenu(
  tenantId: string,
  id: string,
  data: UpdateMenuInput
) {
  const existing = await prisma.menu.findFirst({
    where: baseWhere(tenantId, { id }),
  });

  if (!existing) {
    return null;
  }

  return prisma.menu.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.slug !== undefined && { slug: data.slug.trim() }),
      ...(data.description !== undefined && { description: data.description }),

      ...(data.showImages !== undefined && { showImages: data.showImages }),
      ...(data.showPrices !== undefined && { showPrices: data.showPrices }),
      ...(data.showDescription !== undefined && {
        showDescription: data.showDescription,
      }),
      ...(data.showCategoryHeaders !== undefined && {
        showCategoryHeaders: data.showCategoryHeaders,
      }),
      ...(data.showProductBadges !== undefined && {
        showProductBadges: data.showProductBadges,
      }),

      ...(data.channel !== undefined && { channel: data.channel }),
      ...(data.layoutType !== undefined && { layoutType: data.layoutType }),
      ...(data.columns !== undefined && { columns: data.columns }),

      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

/**
 * Soft delete: isActive = false.
 */
export async function deleteMenu(tenantId: string, id: string) {
  const existing = await prisma.menu.findFirst({
    where: baseWhere(tenantId, { id }),
  });

  if (!existing) {
    return null;
  }

  return prisma.menu.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
}
