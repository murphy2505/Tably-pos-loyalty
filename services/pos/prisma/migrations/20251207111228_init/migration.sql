/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuId` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_sectionId_fkey";

-- DropIndex
DROP INDEX "Menu_tenantId_name_idx";

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "menuId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "sectionId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Menu_slug_key" ON "Menu"("slug");

-- CreateIndex
CREATE INDEX "Menu_tenantId_sortOrder_idx" ON "Menu"("tenantId", "sortOrder");

-- CreateIndex
CREATE INDEX "MenuItem_tenantId_menuId_idx" ON "MenuItem"("tenantId", "menuId");

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "MenuSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
