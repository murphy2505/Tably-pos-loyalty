import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

/**
 * GET /pos/bootstrap
 *
 * Haalt in één keer alle basisdata op voor de POS frontend.
 */
router.get("/", async (_req, res) => {
  try {
    const [
      categories,
      revenueGroups,
      products,
      variants,
      stockItems,
      modifierGroups,
      productModifierGroups,
      menuCards,
      menuItems,
      priceRules,
    ] = await Promise.all([
      prisma.category.findMany({ orderBy: { order: "asc" } }),
      prisma.revenueGroup.findMany({ orderBy: { name: "asc" } }),
      prisma.product.findMany({ orderBy: { name: "asc" } }),
      prisma.productVariant.findMany(),
      prisma.stockItem.findMany(),
      prisma.modifierGroup.findMany({
        include: { options: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.productModifierGroup.findMany(),
      prisma.menuCard.findMany({ orderBy: { name: "asc" } }),
      prisma.menuItem.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.priceRule.findMany(),
    ]);

    res.json({
      categories,
      revenueGroups,
      products,
      variants,
      stockItems,
      modifierGroups,
      productModifierGroups,
      menuCards,
      menuItems,
      priceRules,
    });
  } catch (err: any) {
    console.error("POS bootstrap failed:", err);
    res
      .status(500)
      .json({ error: "POS bootstrap failed", details: err.message });
  }
});

export default router;
