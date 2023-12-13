import { dater } from "../utils";

export const getBlockTagForDate = async (
  date?: string
): Promise<number | undefined> => {
  if (!date) {
    return undefined;
  }

  const block = await dater.getDate(date, true, false);
  return block.block;
};
