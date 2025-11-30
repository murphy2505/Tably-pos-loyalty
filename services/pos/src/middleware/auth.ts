import { Request, Response, NextFunction } from "express";

export default function authMiddleware(_req: Request, _res: Response, next: NextFunction) {
  // TODO: vervang door echte authenticatie/tenant-check
  next();
}
