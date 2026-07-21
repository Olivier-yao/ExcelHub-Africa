-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "howToUse" TEXT,
ADD COLUMN     "sheetCount" INTEGER NOT NULL DEFAULT 1;
