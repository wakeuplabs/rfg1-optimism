import { v4 as uuidv4 } from "uuid";

export const createPrimaryKey = (): string => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return uuidv4();
};
