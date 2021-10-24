-- AlterTable
ALTER TABLE `Favoured` MODIFY `account_bank` VARCHAR(191) NULL,
    MODIFY `account_agency` VARCHAR(191) NULL,
    MODIFY `account_agency_digit` VARCHAR(1) NULL,
    MODIFY `account_type` ENUM('savings', 'checking') NULL,
    MODIFY `account_number` VARCHAR(191) NULL,
    MODIFY `account_number_digit` VARCHAR(1) NULL;
