-- CreateTable
CREATE TABLE "Category" (
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

-- CreateTable
CREATE TABLE "RevenueGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
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

-- CreateTable
CREATE TABLE "ProductVariant" (
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

-- CreateTable
CREATE TABLE "StockItem" (
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

-- CreateTable
CREATE TABLE "ProductIngredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantId" TEXT NOT NULL,
    "stockItemId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    CONSTRAINT "ProductIngredient_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductIngredient_stockItemId_fkey" FOREIGN KEY ("stockItemId") REFERENCES "StockItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StockMovement" (
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

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pinCode" TEXT,
    "role" TEXT
);

-- CreateTable
CREATE TABLE "Table" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "tableId" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" DATETIME,
    "cancelReason" TEXT,
    "employeeId" TEXT,
    "deviceId" TEXT,
    "source" TEXT,
    "dineType" TEXT,
    CONSTRAINT "Order_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
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

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" TEXT,
    CONSTRAINT "Payment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'BOTH',
    "layoutType" TEXT NOT NULL DEFAULT 'GRID',
    "columns" INTEGER,
    "showImages" BOOLEAN NOT NULL DEFAULT true,
    "showPrices" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MenuSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MenuSection_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionId" TEXT,
    "productId" TEXT,
    "productVariantId" TEXT,
    "label" TEXT,
    "shortLabel" TEXT,
    "badge" TEXT,
    "color" TEXT,
    "tileSize" TEXT NOT NULL DEFAULT 'AUTO',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "showPrice" BOOLEAN NOT NULL DEFAULT true,
    "showImage" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MenuItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "MenuSection" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Category_tenantId_idx" ON "Category"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_tenantId_name_key" ON "Category"("tenantId", "name");

-- CreateIndex
CREATE INDEX "RevenueGroup_tenantId_idx" ON "RevenueGroup"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "RevenueGroup_tenantId_name_key" ON "RevenueGroup"("tenantId", "name");

-- CreateIndex
CREATE INDEX "Product_tenantId_idx" ON "Product"("tenantId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_revenueGroupId_idx" ON "Product"("revenueGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_tenantId_categoryId_name_key" ON "Product"("tenantId", "categoryId", "name");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_name_key" ON "ProductVariant"("productId", "name");

-- CreateIndex
CREATE INDEX "StockItem_tenantId_idx" ON "StockItem"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "StockItem_tenantId_name_key" ON "StockItem"("tenantId", "name");

-- CreateIndex
CREATE INDEX "ProductIngredient_variantId_idx" ON "ProductIngredient"("variantId");

-- CreateIndex
CREATE INDEX "ProductIngredient_stockItemId_idx" ON "ProductIngredient"("stockItemId");

-- CreateIndex
CREATE INDEX "StockMovement_stockItemId_idx" ON "StockMovement"("stockItemId");

-- CreateIndex
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");

-- CreateIndex
CREATE INDEX "StockMovement_employeeId_idx" ON "StockMovement"("employeeId");

-- CreateIndex
CREATE INDEX "StockMovement_orderItemId_idx" ON "StockMovement"("orderItemId");

-- CreateIndex
CREATE INDEX "Employee_tenantId_idx" ON "Employee"("tenantId");

-- CreateIndex
CREATE INDEX "Table_tenantId_locationId_idx" ON "Table"("tenantId", "locationId");

-- CreateIndex
CREATE INDEX "Order_tenantId_locationId_idx" ON "Order"("tenantId", "locationId");

-- CreateIndex
CREATE INDEX "Order_tableId_idx" ON "Order"("tableId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_employeeId_idx" ON "Order"("employeeId");

-- CreateIndex
CREATE INDEX "Order_deviceId_idx" ON "Order"("deviceId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");

-- CreateIndex
CREATE INDEX "OrderItem_revenueGroupId_idx" ON "OrderItem"("revenueGroupId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "Payment_employeeId_idx" ON "Payment"("employeeId");

-- CreateIndex
CREATE INDEX "Menu_tenantId_idx" ON "Menu"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_tenantId_slug_key" ON "Menu"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "MenuSection_menuId_idx" ON "MenuSection"("menuId");

-- CreateIndex
CREATE INDEX "MenuSection_tenantId_idx" ON "MenuSection"("tenantId");

-- CreateIndex
CREATE INDEX "MenuSection_categoryId_idx" ON "MenuSection"("categoryId");

-- CreateIndex
CREATE INDEX "MenuItem_menuId_idx" ON "MenuItem"("menuId");

-- CreateIndex
CREATE INDEX "MenuItem_tenantId_idx" ON "MenuItem"("tenantId");

-- CreateIndex
CREATE INDEX "MenuItem_sectionId_idx" ON "MenuItem"("sectionId");

-- CreateIndex
CREATE INDEX "MenuItem_productId_idx" ON "MenuItem"("productId");

-- CreateIndex
CREATE INDEX "MenuItem_productVariantId_idx" ON "MenuItem"("productVariantId");
