/*
  Warnings:

  - Added the required column `percentageOfNear` to the `inputs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percenatageOfFar` to the `outputs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentageOfNear` to the `outputs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inputs` ADD COLUMN `percentageOfNear` DECIMAL(36, 18) NOT NULL;

-- AlterTable
ALTER TABLE `outputs` ADD COLUMN `percenatageOfFar` DECIMAL(36, 18) NOT NULL,
    ADD COLUMN `percentageOfNear` DECIMAL(36, 18) NOT NULL;
