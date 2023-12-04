-- CreateTable
CREATE TABLE "Contract" (
    "address" TEXT NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "Function" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "constant" BOOLEAN NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Function_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Param" (
    "id" TEXT NOT NULL,
    "input" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "indexed" BOOLEAN,
    "functionId" TEXT NOT NULL,

    CONSTRAINT "Param_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Function" ADD CONSTRAINT "Function_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Param" ADD CONSTRAINT "Param_functionId_fkey" FOREIGN KEY ("functionId") REFERENCES "Function"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
