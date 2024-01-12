export enum Chain {
  Optimism_Goerli = "Optimism_Goerli",
  Optimism_Sepolia = "Optimism_Sepolia",
  Optimism = "Optimism",
}

export const getChain = (chain?: string): Chain => {
  if (!chain || !Object.values(Chain).includes(chain as Chain)) {
    throw new Error("Blockchain INVALID: " + chain);
  }

  return chain as Chain;
}