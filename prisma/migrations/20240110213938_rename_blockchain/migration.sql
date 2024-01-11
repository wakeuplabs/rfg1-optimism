/*
  Warnings:

  - The values [Optimism_Sequoia] on the enum `Chain` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Chain_new" AS ENUM ('Optimism_Goerli', 'Optimism_Sepolia', 'Optimism');
ALTER TABLE "Contract" ALTER COLUMN "blockchain" DROP DEFAULT;
ALTER TABLE "Contract" ALTER COLUMN "blockchain" TYPE "Chain_new" USING ("blockchain"::text::"Chain_new");
ALTER TYPE "Chain" RENAME TO "Chain_old";
ALTER TYPE "Chain_new" RENAME TO "Chain";
DROP TYPE "Chain_old";
ALTER TABLE "Contract" ALTER COLUMN "blockchain" SET DEFAULT 'Optimism';
COMMIT;
