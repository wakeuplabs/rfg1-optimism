
import { ethers } from "ethers";
import EthDater from "ethereum-block-by-date";

const getDater = (provider: ethers.JsonRpcProvider) => new EthDater(provider as any);

export const daterProvider = {
  getDater
}