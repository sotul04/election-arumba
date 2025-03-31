/*
  Warnings:

  - Added the required column `major` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "major" TEXT NOT NULL;
