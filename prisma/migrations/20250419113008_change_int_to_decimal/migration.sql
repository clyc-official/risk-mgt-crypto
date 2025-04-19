/*
  Warnings:

  - You are about to alter the column `numberOfNear` on the `inputs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(36,18)`.
  - You are about to alter the column `numberOfFar` on the `inputs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(36,18)`.
  - You are about to alter the column `percenatageOfFar` on the `inputs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(36,18)`.
  - You are about to alter the column `devidedUpRatio` on the `inputs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(36,18)`.
  - You are about to alter the column `devidedDownRatio` on the `inputs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(36,18)`.
  - You are about to alter the column `numberOfNear` on the `outputs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(36,18)`.
  - You are about to alter the column `numberOfFar` on the `outputs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(36,18)`.
  - You are about to alter the column `devidedUpRatio` on the `outputs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(36,18)`.
  - You are about to alter the column `devidedDownRatio` on the `outputs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(36,18)`.

*/
-- AlterTable
ALTER TABLE `inputs` MODIFY `numberOfNear` DECIMAL(36, 18) NOT NULL,
    MODIFY `numberOfFar` DECIMAL(36, 18) NOT NULL,
    MODIFY `percenatageOfFar` DECIMAL(36, 18) NOT NULL,
    MODIFY `devidedUpRatio` DECIMAL(36, 18) NOT NULL,
    MODIFY `devidedDownRatio` DECIMAL(36, 18) NOT NULL;

-- AlterTable
ALTER TABLE `outputs` MODIFY `numberOfNear` DECIMAL(36, 18) NOT NULL,
    MODIFY `numberOfFar` DECIMAL(36, 18) NOT NULL,
    MODIFY `devidedUpRatio` DECIMAL(36, 18) NOT NULL,
    MODIFY `devidedDownRatio` DECIMAL(36, 18) NOT NULL;
