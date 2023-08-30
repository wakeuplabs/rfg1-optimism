import { ethers } from "ethers";
import "dotenv/config";

const EthDater = require("ethereum-block-by-date");
const RPC_URL =
  process.env.RPC_URL || "https://polygon-mumbai-bor.publicnode.com";

export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const dater = new EthDater(provider);
