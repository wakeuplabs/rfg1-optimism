import { Context } from "src/context";

declare global {
  namespace Express {
    interface Request {
      context: Context;
    }
  }
}
