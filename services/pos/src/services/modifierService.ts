// services/pos/src/services/modifierService.ts
import { PrismaClient, ModifierGroup, ModifierOption } from "@prisma/client";

const prisma = new PrismaClient();

// --------------------
// Types (DTO)
// --------------------
export interface ModifierGroupInput {
  name: string;
  description?: string | null;
  minRequired?: number;
  maxAllowed?: number | null;
  freeChoices?: number;
  isRequired?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ModifierOptionInput {
  name: string;
  shortLabel?: string | null;
  priceDelta?: string; // Decimal als string
  isDefault?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  color?: string | null;
  icon?: string | null;
}

// --------------------
// Groups
// --------------------
export async function listModifierGroups(tenantId: string) {
  return prisma.modifierGroup.findMany({
    where: { tenantId },
    orderBy: { sortOrder: "asc" },
    include: {
      options: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getModifierGroupById(tenantId: string, id: string) {
  return prisma.modifierGroup.findFirst({
    where: { id, tenantId },
    include: {
      options: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function createModifierGroup(
  tenantId: string,
  data: ModifierGroupInput
): Promise<ModifierGroup> {
  return prisma.modifierGroup.create({
    data: {
      tenantId,
      name: data.name,
      description: data.description ?? null,
      minRequired: data.minRequired ?? 0,
      maxAllowed: data.maxAllowed ?? null,
      freeChoices: data.freeChoices ?? 0,
      isRequired: data.isRequired ?? false,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateModifierGroup(
  tenantId: string,
  id: string,
  data: Partial<ModifierGroupInput>
): Promise<ModifierGroup | null> {
  const existing = await prisma.modifierGroup.findFirst({
    where: { id, tenantId },
  });
  if (!existing) return null;

  return prisma.modifierGroup.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      description: data.description ?? existing.description,
      minRequired: data.minRequired ?? existing.minRequired,
      maxAllowed:
        data.maxAllowed === undefined ? existing.maxAllowed : data.maxAllowed,
      freeChoices: data.freeChoices ?? existing.freeChoices,
      isRequired: data.isRequired ?? existing.isRequired,
      sortOrder: data.sortOrder ?? existing.sortOrder,
      isActive: data.isActive ?? existing.isActive,
    },
  });
}

export async function deleteModifierGroup(
  tenantId: string,
  id: string
): Promise<void> {
  // eerst opties weggooien
  await prisma.modifierOption.deleteMany({
    where: { groupId: id, tenantId },
  });

  await prisma.modifierGroup.deleteMany({
    where: { id, tenantId },
  });
}

// --------------------
// Options
// --------------------
export async function createModifierOption(
  tenantId: string,
  groupId: string,
  data: ModifierOptionInput
): Promise<ModifierOption> {
  const group = await prisma.modifierGroup.findFirst({
    where: { id: groupId, tenantId },
  });
  if (!group) {
    throw new Error("Modifier group not found for this tenant");
  }

  return prisma.modifierOption.create({
    data: {
      tenantId,
      groupId,
      name: data.name,
      shortLabel: data.shortLabel ?? null,
      priceDelta: data.priceDelta ? data.priceDelta : "0",
      isDefault: data.isDefault ?? false,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
      color: data.color ?? null,
      icon: data.icon ?? null,
    },
  });
}

export async function updateModifierOption(
  tenantId: string,
  id: string,
  data: Partial<ModifierOptionInput>
): Promise<ModifierOption | null> {
  const existing = await prisma.modifierOption.findFirst({
    where: { id, tenantId },
  });
  if (!existing) return null;

  return prisma.modifierOption.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      shortLabel: data.shortLabel ?? existing.shortLabel,
      priceDelta:
        data.priceDelta === undefined ? existing.priceDelta : data.priceDelta,
      isDefault: data.isDefault ?? existing.isDefault,
      isActive: data.isActive ?? existing.isActive,
      sortOrder: data.sortOrder ?? existing.sortOrder,
      color: data.color ?? existing.color,
      icon: data.icon ?? existing.icon,
    },
  });
}

export async function deleteModifierOption(
  tenantId: string,
  id: string
): Promise<void> {
  await prisma.modifierOption.deleteMany({
    where: { id, tenantId },
  });
}
