import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      locationId?: string | null;
    }
  }
}

export function withTenant(req: Request, res: Response, next: NextFunction) {
  const tenantId = req.header("x-tenant-id");
  const locationId = req.header("x-location-id") ?? null;

  if (!tenantId) {
    return res.status(400).json({ error: "Missing x-tenant-id" });
  }

  req.tenantId = tenantId;
  req.locationId = locationId;
  next();
}

export default withTenant;
