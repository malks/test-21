/*
  Warnings:

  - The values [savings,checking,easy] on the enum `Favoured_account_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Favoured` MODIFY `account_agency_digit` VARCHAR(2) NULL,
    MODIFY `account_type` ENUM('CONTA_CORRENTE', 'CONTA_POUPANCA', 'CONTA_FACIL') NULL,
    MODIFY `account_number_digit` VARCHAR(2) NULL;
