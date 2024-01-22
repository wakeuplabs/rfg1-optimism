import { prisma } from "../utils";

import { Chain } from "../models/chain";

const createContract = (contractAddress: string, blockchain: Chain) => {
  return prisma.contract.create({
    data: {
      address: contractAddress,
      blockchain
    },
  });
};

const getContract = async (contractAddress: string) => {
  return await prisma.contract.findFirst({
    where: {
      address: contractAddress,
    },
  });
};

const getMostPopularContracts = async ({ blockchain }: { blockchain: Chain }) => {
  return await prisma.contract.findMany({
    where: {
      isMostPopular: true,
      blockchain
    },
  });
};

export default { createContract, getContract, getMostPopularContracts };
