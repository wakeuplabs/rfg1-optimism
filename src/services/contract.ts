import { prisma } from "../utils";

import { Network } from "../models/network";

const createContract = (contractAddress: string, network: Network) => {
  return prisma.contract.create({
    data: {
      address: contractAddress,
      network
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

export default { createContract, getContract };
