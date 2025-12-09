/*
  Warnings:

  - You are about to drop the column `isActive` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `allowDiscount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isBestSeller` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isNew` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isPopular` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `printGroup` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `priceIncl` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vatRate` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_tenantId_sortOrder_idx";

-- DropIndex
DROP INDEX "Product_tenantId_categoryId_idx";

-- DropIndex
DROP INDEX "Product_tenantId_revenueGroupId_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "isActive",
DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "allowDiscount",
DROP COLUMN "description",
DROP COLUMN "isActive",
DROP COLUMN "isBestSeller",
DROP COLUMN "isNew",
DROP COLUMN "isPopular",
DROP COLUMN "locationId",
DROP COLUMN "printGroup",
ADD COLUMN     "priceIncl" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "vatRate" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_tenantId_name_key" ON "Category"("tenantId", "name");
