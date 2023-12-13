/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export type Context = {
  prisma: PrismaClient;
};

export const createContext =
  (client: PrismaClient) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const context = {
      prisma: client,
    };

    (req as any).context = context;
    next();
  };
