import { Response } from "express";

export const returnError = (res: Response, message: string) => {
  res.status(400).json({ message: message });
};
