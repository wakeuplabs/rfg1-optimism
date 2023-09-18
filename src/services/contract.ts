import { boolean } from "yup";
import { AbiInput, AbiLine } from "../models/contract";
import { prisma } from "../utils";

const saveFunction = async (
  contractAddress: string,
  abiFunction: AbiLine,
  hash: string
) => {
  let contract = await getContract(contractAddress);
  if (contract === null) {
    contract = await createContract(contractAddress);
  }

  const existingFunction = await getFunctionByHash(contractAddress, hash);
  if (existingFunction === null) {
    await createFunction(contractAddress, abiFunction, hash);
  }
};

const getFunctionByHash = (contractAddress: string, hash: string) => {
  return prisma.function.findFirst({
    where: {
      contractId: contractAddress,
      hash: hash,
    },
  });
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
      constant: abiFunction.constant,
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

const createContract = (contractAddress: string) => {
  return prisma.contract.create({
    data: {
      address: contractAddress,
    },
  });
};

const getContract = (contractAddress: string) => {
  return prisma.contract.findFirst({
    where: {
      address: contractAddress,
    },
  });
};

export default { saveFunction, getContract };
