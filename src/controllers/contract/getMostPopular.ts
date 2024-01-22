import { NextFunction, Request, Response } from "express";

// Models
import { getChain } from "../../models/chain";

// Services
import contractService from "../../services/contract";

// Controllers
import { errorLogger } from "../errorLog";

const getMostPopular = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blockchain = getChain(req.query.blockchain as string);

    const response = await contractService.getMostPopularContracts({ blockchain });

    const parsed = response.map(item => item.address);

    res.status(200).json(parsed);
  } catch (error) {
    const message = await errorLogger((req as any).context, error);
    res.status(400).json({ message: message });
    next(error);
  }
};

export { getMostPopular };
