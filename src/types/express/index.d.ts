import { Context } from "../context";

declare global {
  namespace Express {
    interface Request {
      context: Context;
    }
  }
}
