/*
  Warnings:

  - A unique constraint covering the columns `[useremail]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `useremail` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "useremail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_useremail_key" ON "Users"("useremail");
