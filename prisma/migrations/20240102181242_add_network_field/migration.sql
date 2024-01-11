-- CreateEnum
CREATE TYPE "Network" AS ENUM ('TESTNET', 'MAINNET');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "network" "Network" NOT NULL DEFAULT 'MAINNET';
