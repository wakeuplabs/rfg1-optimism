// Models
import { Chain, getChain } from "../models/chain";

// Services
import contractProvider from "../services/contractProvider";
import { daterProvider } from "../services/daterProvider";

export const getBlockTagForDate = async (
  date?: string,
  blockchainInput?: Chain,
): Promise<number | undefined> => {
  if (!date || !blockchainInput) {
    return undefined;
  }

  const blockchain = getChain(blockchainInput as string);

  const provider = contractProvider.getInstance(blockchain)
  const dater = daterProvider.getDater(provider)

  const block = await dater.getDate(date, true, false);
  return block.block;
};
