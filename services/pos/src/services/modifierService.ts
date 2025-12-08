// services/pos/src/services/modifierService.ts
//
// LET OP:
// In het huidige Prisma schema bestaan géén ModifierGroup / ModifierOption modellen.
// Deze service is daarom tijdelijk een "stub" zodat de POS service compileert.
// Later, als we modifier-modellen aan het Prisma schema toevoegen, vullen we deze
// functies weer met echte Prisma-calls.

import { prisma } from "../db/prisma";

// --------------------
// Types (DTO) – kunnen we alvast laten staan
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

// Kleine helper zodat we overal dezelfde foutmelding gebruiken
function notImplemented() {
  throw new Error(
    "Modifiers zijn nog niet geïmplementeerd: er zijn geen ModifierGroup/ModifierOption modellen in het Prisma schema."
  );
}

// --------------------
// Groups
// --------------------
export async function listModifierGroups(tenantId: string): Promise<any[]> {
  // Voor nu: geen data, lege lijst teruggeven
  console.warn(
    "[modifierService] listModifierGroups aangeroepen, maar modifiers zijn nog niet geïmplementeerd."
  );
  return [];
}

export async function getModifierGroupById(
  tenantId: string,
  id: string
): Promise<any | null> {
  console.warn(
    "[modifierService] getModifierGroupById aangeroepen, maar modifiers zijn nog niet geïmplementeerd."
  );
  return null;
}

export async function createModifierGroup(
  tenantId: string,
  data: ModifierGroupInput
): Promise<any> {
  notImplemented();
}

export async function updateModifierGroup(
  tenantId: string,
  id: string,
  data: Partial<ModifierGroupInput>
): Promise<any | null> {
  notImplemented();
}

export async function deleteModifierGroup(
  tenantId: string,
  id: string
): Promise<void> {
  notImplemented();
}

// --------------------
// Options
// --------------------
export async function createModifierOption(
  tenantId: string,
  groupId: string,
  data: ModifierOptionInput
): Promise<any> {
  notImplemented();
}

export async function updateModifierOption(
  tenantId: string,
  id: string,
  data: Partial<ModifierOptionInput>
): Promise<any | null> {
  notImplemented();
}

export async function deleteModifierOption(
  tenantId: string,
  id: string
): Promise<void> {
  notImplemented();
}
