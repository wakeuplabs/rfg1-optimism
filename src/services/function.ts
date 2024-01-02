// Models
import { AbiInput, AbiLine } from "../models/contract";
import { Network } from "../models/network";

// Utils
import { prisma } from "../utils";

// Services
import contractService from "./contract";

const getFunctionByHash = (contractAddress: string, hash: string) => {
  return prisma.function.findFirst({
    where: {
      contractId: contractAddress,
      hash: hash,
    },
    include: {
      params: true,
    },
  });
};

const getFunctionByName = async (
  contractAddress: string,
  functionName: string
) => {
  return await prisma.function.findFirst({
    where: {
      contractId: contractAddress,
      name: functionName,
    },
    include: {
      params: true,
    },
  });
};

const getFunctions = async (
  contractAddress: string,
) => {
  return await prisma.function.findMany({
    where: {
      contractId: contractAddress,
    },
    include: {
      params: true,
    },
  });
};

const saveFunction = async (
  contractAddress: string,
  abiFunction: AbiLine,
  hash: string,
  network: Network,
) => {
  let contract = await contractService.getContract(contractAddress);
  if (contract === null) {
    contract = await contractService.createContract(contractAddress, network);
  }

  const existingFunction = await getFunctionByHash(contractAddress, hash);
  if (existingFunction === null) {
    await createFunction(contractAddress, abiFunction, hash);
  }
};

const createFunction = (
  contractAddress: string,
  abiFunction: AbiLine,
  hash: string
) => {
  return prisma.function.create({
    data: {
      contractId: contractAddress,
      name: abiFunction.name,
      constant: !!abiFunction.constant,
      hash: hash,
      params: {
        createMany: {
          data: getAbiFunctionParams(abiFunction),
        },
      },
    },
  });
};

const getAbiFunctionParams = (abiFunction: AbiLine) => {
  const toDataType = (a: AbiInput, input: boolean) => {
    return {
      input: input,
      type: a.type,
      name: a.name,
      indexed: a.indexed,
    };
  };
  // join mapped inputs and outputs
  return abiFunction.inputs
    .map((i) => toDataType(i, true))
    .concat(abiFunction.outputs.map((i) => toDataType(i, false)));
};

export default { saveFunction, getFunctionByName, getFunctions, createFunction };
