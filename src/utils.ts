import { ethers } from "ethers";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import EthDater from "ethereum-block-by-date";
const RPC_URL = process.env.RPC_URL || "https://optimism-goerli.publicnode.com";

export const prisma = new PrismaClient();
export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const dater = new EthDater(provider as any);
