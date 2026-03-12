-- CreateEnum
CREATE TYPE "Type" AS ENUM ('capsule', 'cabin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('available', 'occupied', 'cleaning', 'maintenance');

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "status" "Status" NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);
