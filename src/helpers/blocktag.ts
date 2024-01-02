// Models
import { Network, getNetwork } from "../models/network";

// Services
import contractProvider from "../services/contractProvider";
import { daterProvider } from "../services/daterProvider";

export const getBlockTagForDate = async (
  date?: string,
  networkInput?: Network,
): Promise<number | undefined> => {
  if (!date || !networkInput) {
    return undefined;
  }

  const network = getNetwork(networkInput as string);

  const provider = contractProvider.getInstance(network)
  const dater = daterProvider.getDater(provider)

  const block = await dater.getDate(date, true, false);
  return block.block;
};
