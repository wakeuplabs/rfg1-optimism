import "dotenv/config";

export const config = {
  rpc: {
    testnet: process.env.RPC_TESTNET_URL,
    mainnet: process.env.RPC_MAINNET_URL,
  }
}