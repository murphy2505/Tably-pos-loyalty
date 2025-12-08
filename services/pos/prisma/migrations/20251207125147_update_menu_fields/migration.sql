-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "showCategoryHeaders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showDescription" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showPrices" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showProductBadges" BOOLEAN NOT NULL DEFAULT true;
