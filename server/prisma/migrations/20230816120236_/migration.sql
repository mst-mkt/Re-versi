/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "board" JSONB NOT NULL,
    "turnColor" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "inTime" INTEGER NOT NULL,
    "outTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id","roomId")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
