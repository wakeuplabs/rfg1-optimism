export enum Chain {
  Optimism_Goerli = "Optimism_Goerli",
  Optimism_Sequoia = "Optimism_Sequoia",
  Optimism = "Optimism",
}

export const getChain = (chain?: string): Chain => {
  if (!chain || !Object.values(Chain).includes(chain as Chain)) {
    throw new Error("Network INVALID: " + chain);
  }

  return chain as Chain;
}