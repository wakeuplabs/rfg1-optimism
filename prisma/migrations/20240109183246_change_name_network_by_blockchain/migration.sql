/*
  Warnings:

  - You are about to drop the column `network` on the `Contract` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('Optimism_Goerli', 'Optimism_Sequoia', 'Optimism');

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "network",
ADD COLUMN     "blockchain" "Chain" NOT NULL DEFAULT 'Optimism';

-- DropEnum
DROP TYPE "Network";
