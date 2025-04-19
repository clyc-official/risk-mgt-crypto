/*
  Warnings:

  - Added the required column `firstBidPrice` to the `outputs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `outputs` ADD COLUMN `firstBidPrice` DECIMAL(36, 18) NOT NULL;
