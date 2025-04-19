/*
  Warnings:

  - Added the required column `faceValue` to the `inputs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inputs` ADD COLUMN `faceValue` DECIMAL(36, 18) NOT NULL;
