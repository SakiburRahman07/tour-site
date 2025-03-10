/*
  Warnings:

  - You are about to drop the column `dueAmount` on the `TourRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `TourRegistration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TourRegistration" DROP COLUMN "dueAmount",
DROP COLUMN "totalAmount";
