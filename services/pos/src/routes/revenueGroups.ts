import { Router } from "express";
import prisma from "../prismaClient";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId =
      (req as any).tenantId ||
      (req.headers["x-tenant-id"] as string | undefined) ||
      "demo-tenant";

    const revenueGroups = await prisma.revenueGroup.findMany({
      where: { tenantId },
      orderBy: { name: "asc" },
    });

    res.json(revenueGroups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch revenue groups" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, color } = req.body;

    const tenantId =
      (req as any).tenantId ||
      (req.headers["x-tenant-id"] as string | undefined) ||
      "demo-tenant";

    const revenueGroup = await prisma.revenueGroup.create({
      data: {
        tenantId,
        name,
        color,
      },
    });

    res.status(201).json(revenueGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create revenue group" });
  }
});

export default router;
