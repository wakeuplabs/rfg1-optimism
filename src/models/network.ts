
export enum Network {
  TESTNET = "TESTNET",
  MAINNET = "MAINNET",
}

export const getNetwork = (network?: string): Network => {
  if (!network || !Object.values(Network).includes(network as Network)) {
    throw new Error("Network INVALID: " + network);
  }

  return network as Network;
}