import { Request, Response, NextFunction } from "express";

function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    message: err.message,
    validation: (err as any).errors,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

export default { notFound, errorHandler };
