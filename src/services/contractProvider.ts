import { ethers, TransactionRequest } from "ethers";
import { AbiLine } from "../models/contract";
import { Chain } from "../models/chain";
import { config } from "../config";

interface CallProps {
  address: string;
  abi: AbiLine[];
  functionName: string;
  params: any[];
  blockTag?: number;
}

const getInstance = (blockchain: Chain) => {
  if (blockchain === Chain.Optimism_Sequoia) {
    return new ethers.JsonRpcProvider(config.rpc.testnet);
  }

  return new ethers.JsonRpcProvider(config.rpc.mainnet);
} 

const call = async (provider: ethers.JsonRpcProvider, {
  address,
  blockTag,
  functionName,
  params,
  abi,
}: CallProps) => {
  const contract = new ethers.Contract(address, abi);
  const data = contract.interface.encodeFunctionData(functionName, params);

  // prepare request
  const transactionReq: TransactionRequest = {
    to: address,
    data: data,
    blockTag,
  };

  // make the call
  const result = await provider.call(transactionReq);

  if (result === "0x") {
    throw new Error("The contract responded with 0x");
  }

  // todo look into this
  const response = contract.interface.decodeFunctionResult(
    functionName,
    result
  );

  return response;
};

const contractProvider = {
  call,
  getInstance,
};

export default contractProvider;
