-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuSection" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "productId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Menu_tenantId_name_idx" ON "Menu"("tenantId", "name");

-- CreateIndex
CREATE INDEX "MenuSection_tenantId_menuId_idx" ON "MenuSection"("tenantId", "menuId");

-- CreateIndex
CREATE INDEX "MenuItem_tenantId_sectionId_idx" ON "MenuItem"("tenantId", "sectionId");

-- AddForeignKey
ALTER TABLE "MenuSection" ADD CONSTRAINT "MenuSection_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "MenuSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
