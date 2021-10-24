-- CreateTable
CREATE TABLE `Favoured` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `account_bank` INTEGER NOT NULL,
    `account_agency` VARCHAR(191) NOT NULL,
    `account_agency_digit` INTEGER NOT NULL,
    `account_type` ENUM('savings', 'checking') NOT NULL,
    `account_number` VARCHAR(191) NOT NULL,
    `account_number_digit` INTEGER NOT NULL,

    UNIQUE INDEX `Favoured_email_key`(`email`),
    UNIQUE INDEX `Favoured_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bank` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Bank_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
