-- CreateTable
CREATE TABLE "GymImage" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GymImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GymImage" ADD CONSTRAINT "GymImage_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;
