/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Context } from "src/context";
import { createPrimaryKey } from "../helpers/uuid";

export const errorLogger = async (
  context: Context,
  error: unknown
): Promise<string> => {
  const errorMessage = (error as { message: string }).message;

  await context.prisma.errorLog.create({
    data: {
      id: createPrimaryKey(),
      application: "RFG1_OPTIMISM",
      message: errorMessage,
      data: JSON.stringify(error),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return errorMessage;
};
