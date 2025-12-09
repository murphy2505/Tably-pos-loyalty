/*
  Warnings:

  - You are about to drop the column `isActive` on the `MenuItem` table. All the data in the column will be lost.
  - Made the column `productId` on table `MenuItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_productId_fkey";

-- DropIndex
DROP INDEX "MenuItem_tenantId_menuId_idx";

-- DropIndex
DROP INDEX "MenuItem_tenantId_productId_idx";

-- DropIndex
DROP INDEX "MenuItem_tenantId_sectionId_idx";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "isActive",
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "shortLabel" TEXT,
ADD COLUMN     "variantId" TEXT,
ALTER COLUMN "productId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "MenuItem_tenantId_menuId_sectionId_sortOrder_idx" ON "MenuItem"("tenantId", "menuId", "sectionId", "sortOrder");

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
