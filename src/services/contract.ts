import { prisma } from "../utils";

const createContract = (contractAddress: string) => {
  return prisma.contract.create({
    data: {
      address: contractAddress,
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
