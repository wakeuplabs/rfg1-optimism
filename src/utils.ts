import { ethers } from "ethers";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import EthDater from "ethereum-block-by-date";
const RPC_URL = process.env.RPC_URL || "https://optimism-goerli.publicnode.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

export const prisma = new PrismaClient();
export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const signer = new ethers.Wallet(PRIVATE_KEY, provider);
export const dater = new EthDater(provider as any);
