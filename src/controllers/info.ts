import { NextFunction, Request, Response } from "express";

const getInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json({ status: "OK" });
  } catch (error) {
    next(error);

    return;
  }
};

export default { getInfo };
