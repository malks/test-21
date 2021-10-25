-- AlterTable
ALTER TABLE `Favoured` ADD COLUMN `status` ENUM('draft', 'valid') NOT NULL DEFAULT 'draft';
