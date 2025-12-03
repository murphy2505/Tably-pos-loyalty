/*
  Warnings:

  - You are about to alter the column `priceOverride` on the `MenuItem` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `priceDelta` on the `ModifierOption` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `discount` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `priceEach` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `vatRateSnapshot` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `amountOff` on the `PriceRule` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `newPrice` on the `PriceRule` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `percentOff` on the `PriceRule` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `amount` on the `ProductIngredient` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `costPrice` on the `ProductVariant` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `price` on the `ProductVariant` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `minimum` on the `StockItem` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `quantity` on the `StockItem` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `amount` on the `StockMovement` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MenuCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `RevenueGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StockItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "order" INTEGER NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("color", "id", "name", "order", "parentId", "tenantId") SELECT "color", "id", "name", "order", "parentId", "tenantId" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE INDEX "Category_tenantId_idx" ON "Category"("tenantId");
CREATE UNIQUE INDEX "Category_tenantId_name_key" ON "Category"("tenantId", "name");
CREATE TABLE "new_MenuCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "theme" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "activeFrom" DATETIME,
    "activeUntil" DATETIME,
    "startTime" TEXT,
    "endTime" TEXT,
    "daysOfWeek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MenuCard" ("activeFrom", "activeUntil", "daysOfWeek", "endTime", "id", "isPrimary", "name", "startTime", "tenantId", "theme", "type") SELECT "activeFrom", "activeUntil", "daysOfWeek", "endTime", "id", "isPrimary", "name", "startTime", "tenantId", "theme", "type" FROM "MenuCard";
DROP TABLE "MenuCard";
ALTER TABLE "new_MenuCard" RENAME TO "MenuCard";
CREATE INDEX "MenuCard_tenantId_idx" ON "MenuCard"("tenantId");
CREATE TABLE "new_MenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuCardId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "visibleOnPos" BOOLEAN NOT NULL DEFAULT true,
    "visibleOnKiosk" BOOLEAN NOT NULL DEFAULT true,
    "visibleOnWeb" BOOLEAN NOT NULL DEFAULT true,
    "visibleOnDelivery" BOOLEAN NOT NULL DEFAULT true,
    "priceOverride" DECIMAL,
    CONSTRAINT "MenuItem_menuCardId_fkey" FOREIGN KEY ("menuCardId") REFERENCES "MenuCard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MenuItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MenuItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MenuItem" ("id", "isHidden", "menuCardId", "priceOverride", "productId", "sortOrder", "variantId", "visibleOnDelivery", "visibleOnKiosk", "visibleOnPos", "visibleOnWeb") SELECT "id", "isHidden", "menuCardId", "priceOverride", "productId", "sortOrder", "variantId", "visibleOnDelivery", "visibleOnKiosk", "visibleOnPos", "visibleOnWeb" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
CREATE INDEX "MenuItem_menuCardId_idx" ON "MenuItem"("menuCardId");
CREATE INDEX "MenuItem_productId_idx" ON "MenuItem"("productId");
CREATE TABLE "new_ModifierOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceDelta" DECIMAL NOT NULL DEFAULT 0,
    "icon" TEXT,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ModifierOption_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ModifierGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ModifierOption" ("color", "groupId", "icon", "id", "name", "priceDelta", "sortOrder") SELECT "color", "groupId", "icon", "id", "name", "priceDelta", "sortOrder" FROM "ModifierOption";
DROP TABLE "ModifierOption";
ALTER TABLE "new_ModifierOption" RENAME TO "ModifierOption";
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceEach" DECIMAL NOT NULL,
    "discount" DECIMAL NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "variantName" TEXT NOT NULL,
    "categoryId" TEXT,
    "categoryName" TEXT,
    "revenueGroupId" TEXT,
    "revenueGroupName" TEXT,
    "vatRateSnapshot" DECIMAL NOT NULL,
    "allergensSummary" TEXT,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("allergensSummary", "categoryId", "categoryName", "discount", "id", "orderId", "priceEach", "productId", "productName", "quantity", "revenueGroupId", "revenueGroupName", "variantId", "variantName", "vatRateSnapshot") SELECT "allergensSummary", "categoryId", "categoryName", "discount", "id", "orderId", "priceEach", "productId", "productName", "quantity", "revenueGroupId", "revenueGroupName", "variantId", "variantName", "vatRateSnapshot" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");
CREATE INDEX "OrderItem_revenueGroupId_idx" ON "OrderItem"("revenueGroupId");
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" TEXT,
    CONSTRAINT "Payment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "createdAt", "employeeId", "id", "method", "orderId") SELECT "amount", "createdAt", "employeeId", "id", "method", "orderId" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");
CREATE INDEX "Payment_employeeId_idx" ON "Payment"("employeeId");
CREATE TABLE "new_PriceRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "categoryId" TEXT,
    "revenueGroupId" TEXT,
    "menuCardId" TEXT,
    "amountOff" DECIMAL,
    "percentOff" DECIMAL,
    "newPrice" DECIMAL,
    "startTime" TEXT,
    "endTime" TEXT,
    "daysOfWeek" TEXT,
    "dateFrom" DATETIME,
    "dateUntil" DATETIME,
    "appliesPos" BOOLEAN NOT NULL DEFAULT true,
    "appliesKiosk" BOOLEAN NOT NULL DEFAULT true,
    "appliesWeb" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PriceRule" ("amountOff", "appliesKiosk", "appliesPos", "appliesWeb", "categoryId", "createdAt", "dateFrom", "dateUntil", "daysOfWeek", "endTime", "id", "menuCardId", "name", "newPrice", "percentOff", "productId", "revenueGroupId", "startTime", "tenantId", "updatedAt", "variantId") SELECT "amountOff", "appliesKiosk", "appliesPos", "appliesWeb", "categoryId", "createdAt", "dateFrom", "dateUntil", "daysOfWeek", "endTime", "id", "menuCardId", "name", "newPrice", "percentOff", "productId", "revenueGroupId", "startTime", "tenantId", "updatedAt", "variantId" FROM "PriceRule";
DROP TABLE "PriceRule";
ALTER TABLE "new_PriceRule" RENAME TO "PriceRule";
CREATE INDEX "PriceRule_tenantId_idx" ON "PriceRule"("tenantId");
CREATE INDEX "PriceRule_productId_idx" ON "PriceRule"("productId");
CREATE INDEX "PriceRule_variantId_idx" ON "PriceRule"("variantId");
CREATE INDEX "PriceRule_categoryId_idx" ON "PriceRule"("categoryId");
CREATE INDEX "PriceRule_revenueGroupId_idx" ON "PriceRule"("revenueGroupId");
CREATE INDEX "PriceRule_menuCardId_idx" ON "PriceRule"("menuCardId");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "vatRate" REAL NOT NULL DEFAULT 9,
    "tileColor" TEXT,
    "tileIcon" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "shortLabel" TEXT,
    "kitchenNotes" TEXT,
    "recipe" TEXT,
    "preparation" TEXT,
    "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
    "isVegan" BOOLEAN NOT NULL DEFAULT false,
    "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
    "isLactoseFree" BOOLEAN NOT NULL DEFAULT false,
    "spicyLevel" INTEGER,
    "tracksStock" BOOLEAN NOT NULL DEFAULT false,
    "printGroup" TEXT,
    "isCombo" BOOLEAN NOT NULL DEFAULT false,
    "revenueGroupId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_revenueGroupId_fkey" FOREIGN KEY ("revenueGroupId") REFERENCES "RevenueGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("active", "categoryId", "description", "id", "imageUrl", "isCombo", "isGlutenFree", "isLactoseFree", "isVegan", "isVegetarian", "kitchenNotes", "name", "preparation", "printGroup", "recipe", "revenueGroupId", "shortLabel", "spicyLevel", "tenantId", "tileColor", "tileIcon", "tracksStock", "vatRate") SELECT "active", "categoryId", "description", "id", "imageUrl", "isCombo", "isGlutenFree", "isLactoseFree", "isVegan", "isVegetarian", "kitchenNotes", "name", "preparation", "printGroup", "recipe", "revenueGroupId", "shortLabel", "spicyLevel", "tenantId", "tileColor", "tileIcon", "tracksStock", "vatRate" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_tenantId_idx" ON "Product"("tenantId");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_revenueGroupId_idx" ON "Product"("revenueGroupId");
CREATE UNIQUE INDEX "Product_tenantId_categoryId_name_key" ON "Product"("tenantId", "categoryId", "name");
CREATE TABLE "new_ProductIngredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantId" TEXT NOT NULL,
    "stockItemId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    CONSTRAINT "ProductIngredient_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductIngredient_stockItemId_fkey" FOREIGN KEY ("stockItemId") REFERENCES "StockItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductIngredient" ("amount", "id", "stockItemId", "variantId") SELECT "amount", "id", "stockItemId", "variantId" FROM "ProductIngredient";
DROP TABLE "ProductIngredient";
ALTER TABLE "new_ProductIngredient" RENAME TO "ProductIngredient";
CREATE INDEX "ProductIngredient_variantId_idx" ON "ProductIngredient"("variantId");
CREATE INDEX "ProductIngredient_stockItemId_idx" ON "ProductIngredient"("stockItemId");
CREATE TABLE "new_ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "costPrice" DECIMAL,
    "sku" TEXT,
    "pluCode" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductVariant" ("active", "costPrice", "id", "name", "pluCode", "price", "productId", "sku") SELECT "active", "costPrice", "id", "name", "pluCode", "price", "productId", "sku" FROM "ProductVariant";
DROP TABLE "ProductVariant";
ALTER TABLE "new_ProductVariant" RENAME TO "ProductVariant";
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE UNIQUE INDEX "ProductVariant_productId_name_key" ON "ProductVariant"("productId", "name");
CREATE TABLE "new_RevenueGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_RevenueGroup" ("color", "createdAt", "id", "name", "updatedAt") SELECT "color", "createdAt", "id", "name", "updatedAt" FROM "RevenueGroup";
DROP TABLE "RevenueGroup";
ALTER TABLE "new_RevenueGroup" RENAME TO "RevenueGroup";
CREATE INDEX "RevenueGroup_tenantId_idx" ON "RevenueGroup"("tenantId");
CREATE UNIQUE INDEX "RevenueGroup_tenantId_name_key" ON "RevenueGroup"("tenantId", "name");
CREATE TABLE "new_StockItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL DEFAULT 0,
    "minimum" DECIMAL NOT NULL DEFAULT 0,
    "allergens" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_StockItem" ("allergens", "id", "minimum", "name", "quantity", "tenantId", "unit") SELECT "allergens", "id", "minimum", "name", "quantity", "tenantId", "unit" FROM "StockItem";
DROP TABLE "StockItem";
ALTER TABLE "new_StockItem" RENAME TO "StockItem";
CREATE INDEX "StockItem_tenantId_idx" ON "StockItem"("tenantId");
CREATE UNIQUE INDEX "StockItem_tenantId_name_key" ON "StockItem"("tenantId", "name");
CREATE TABLE "new_StockMovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stockItemId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" TEXT,
    "orderItemId" TEXT,
    "reversalOfId" TEXT,
    CONSTRAINT "StockMovement_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StockMovement_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StockMovement_stockItemId_fkey" FOREIGN KEY ("stockItemId") REFERENCES "StockItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StockMovement" ("amount", "createdAt", "employeeId", "id", "orderItemId", "reversalOfId", "stockItemId", "type") SELECT "amount", "createdAt", "employeeId", "id", "orderItemId", "reversalOfId", "stockItemId", "type" FROM "StockMovement";
DROP TABLE "StockMovement";
ALTER TABLE "new_StockMovement" RENAME TO "StockMovement";
CREATE INDEX "StockMovement_stockItemId_idx" ON "StockMovement"("stockItemId");
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");
CREATE INDEX "StockMovement_employeeId_idx" ON "StockMovement"("employeeId");
CREATE INDEX "StockMovement_orderItemId_idx" ON "StockMovement"("orderItemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
