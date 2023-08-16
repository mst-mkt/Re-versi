/*
  Warnings:

  - The `outTime` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `inTime` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "inTime",
ADD COLUMN     "inTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "outTime",
ADD COLUMN     "outTime" TIMESTAMP(3);
