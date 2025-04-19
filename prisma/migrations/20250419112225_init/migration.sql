-- CreateTable
CREATE TABLE `inputs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `symbol` VARCHAR(191) NOT NULL,
    `category` ENUM('Spot', 'Futures') NOT NULL,
    `numberOfNear` INTEGER NOT NULL,
    `numberOfFar` INTEGER NOT NULL,
    `percenatageOfFar` INTEGER NOT NULL,
    `devidedUpRatio` INTEGER NOT NULL,
    `devidedDownRatio` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outputs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `symbol` VARCHAR(191) NOT NULL,
    `category` ENUM('Spot', 'Futures') NOT NULL,
    `numberOfNear` INTEGER NOT NULL,
    `numberOfFar` INTEGER NOT NULL,
    `devidedUpRatio` INTEGER NOT NULL,
    `devidedDownRatio` INTEGER NOT NULL,
    `farOrderTotalVolume` DECIMAL(36, 18) NOT NULL,
    `eachOrderAverage` DECIMAL(36, 18) NOT NULL,
    `farDownRange` DECIMAL(36, 18) NOT NULL,
    `farUpRange` DECIMAL(36, 18) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
