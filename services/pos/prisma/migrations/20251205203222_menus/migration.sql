-- CreateTable
CREATE TABLE "ModifierGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "minRequired" INTEGER NOT NULL DEFAULT 0,
    "maxAllowed" INTEGER,
    "freeChoices" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ModifierOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortLabel" TEXT,
    "priceDelta" DECIMAL NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ModifierOption_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ModifierGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VariantModifierGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "minRequired" INTEGER,
    "maxAllowed" INTEGER,
    "freeChoices" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "VariantModifierGroup_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VariantModifierGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ModifierGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VariantModifierOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantModifierGroupId" TEXT NOT NULL,
    "modifierOptionId" TEXT NOT NULL,
    "isDefaultForVariant" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "VariantModifierOption_variantModifierGroupId_fkey" FOREIGN KEY ("variantModifierGroupId") REFERENCES "VariantModifierGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VariantModifierOption_modifierOptionId_fkey" FOREIGN KEY ("modifierOptionId") REFERENCES "ModifierOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModifierOptionIngredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modifierOptionId" TEXT NOT NULL,
    "stockItemId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    CONSTRAINT "ModifierOptionIngredient_modifierOptionId_fkey" FOREIGN KEY ("modifierOptionId") REFERENCES "ModifierOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ModifierOptionIngredient_stockItemId_fkey" FOREIGN KEY ("stockItemId") REFERENCES "StockItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItemModifier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderItemId" TEXT NOT NULL,
    "modifierOptionId" TEXT,
    "groupName" TEXT NOT NULL,
    "optionName" TEXT NOT NULL,
    "priceDelta" DECIMAL NOT NULL,
    CONSTRAINT "OrderItemModifier_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItemModifier_modifierOptionId_fkey" FOREIGN KEY ("modifierOptionId") REFERENCES "ModifierOption" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ModifierGroup_tenantId_idx" ON "ModifierGroup"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ModifierGroup_tenantId_name_key" ON "ModifierGroup"("tenantId", "name");

-- CreateIndex
CREATE INDEX "ModifierOption_groupId_idx" ON "ModifierOption"("groupId");

-- CreateIndex
CREATE INDEX "ModifierOption_tenantId_idx" ON "ModifierOption"("tenantId");

-- CreateIndex
CREATE INDEX "VariantModifierGroup_variantId_idx" ON "VariantModifierGroup"("variantId");

-- CreateIndex
CREATE INDEX "VariantModifierGroup_groupId_idx" ON "VariantModifierGroup"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "VariantModifierGroup_variantId_groupId_key" ON "VariantModifierGroup"("variantId", "groupId");

-- CreateIndex
CREATE INDEX "VariantModifierOption_variantModifierGroupId_idx" ON "VariantModifierOption"("variantModifierGroupId");

-- CreateIndex
CREATE INDEX "VariantModifierOption_modifierOptionId_idx" ON "VariantModifierOption"("modifierOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "VariantModifierOption_variantModifierGroupId_modifierOptionId_key" ON "VariantModifierOption"("variantModifierGroupId", "modifierOptionId");

-- CreateIndex
CREATE INDEX "ModifierOptionIngredient_modifierOptionId_idx" ON "ModifierOptionIngredient"("modifierOptionId");

-- CreateIndex
CREATE INDEX "ModifierOptionIngredient_stockItemId_idx" ON "ModifierOptionIngredient"("stockItemId");

-- CreateIndex
CREATE INDEX "OrderItemModifier_orderItemId_idx" ON "OrderItemModifier"("orderItemId");

-- CreateIndex
CREATE INDEX "OrderItemModifier_modifierOptionId_idx" ON "OrderItemModifier"("modifierOptionId");
