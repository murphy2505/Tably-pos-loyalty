import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listMenus(tenantId: string) {
  return prisma.menu.findMany({
    where: { tenantId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getMenuById(tenantId: string, id: string) {
  return prisma.menu.findFirst({
    where: { id, tenantId },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
      },
      items: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function createMenu(tenantId: string, data: {
  name: string;
  slug?: string;
  description?: string | null;
  channel?: string;
  layoutType?: string;
  columns?: number | null;
  showImages?: boolean;
  showPrices?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const slug =
    data.slug ??
    data.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  return prisma.menu.create({
    data: {
      tenantId,
      name: data.name,
      slug,
      description: data.description ?? null,
      channel: data.channel ?? "BOTH",
      layoutType: data.layoutType ?? "GRID",
      columns: data.columns ?? null,
      showImages: data.showImages ?? true,
      showPrices: data.showPrices ?? true,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateMenu(
  tenantId: string,
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    description: string | null;
    channel: string;
    layoutType: string;
    columns: number | null;
    showImages: boolean;
    showPrices: boolean;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  if (data.slug) {
    data.slug = data.slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }

  return prisma.menu.updateMany({
    where: { id, tenantId },
    data,
  });
}

export async function deleteMenu(tenantId: string, id: string) {
  // Eerst gerelateerde items & sections weggooien
  await prisma.menuItem.deleteMany({ where: { menuId: id, tenantId } });
  await prisma.menuSection.deleteMany({ where: { menuId: id, tenantId } });

  return prisma.menu.deleteMany({
    where: { id, tenantId },
  });
}
