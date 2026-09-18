/*
  Warnings:

  - You are about to drop the column `key` on the `GymImage` table. All the data in the column will be lost.
  - Added the required column `imageKey` to the `GymImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GymImage" DROP COLUMN "key",
ADD COLUMN     "imageKey" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "machineName" TEXT NOT NULL,
    "description" TEXT,
    "imageKey" TEXT,
    "gymId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;
