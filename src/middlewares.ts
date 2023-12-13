import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { errorLogger } from "./controllers/errorLog";

function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

async function errorHandler(err: Error, req: Request, res: Response) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  await errorLogger((req as any).context, err);

  res.json({
    message: err.message,
    validation: (err as any).errors,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

export default { notFound, errorHandler };
