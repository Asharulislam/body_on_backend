/*
  Warnings:

  - Made the column `description` on table `Machine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageKey` on table `Machine` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Machine" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "imageKey" SET NOT NULL;
