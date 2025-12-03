import { Router } from "express";

const router = Router();

// Types die ongeveer aansluiten bij wat de frontend verwacht
type PosVariant = {
  id: string;
  name: string;
  price: number;
  costPrice?: number | null;
  sku?: string | null;
  pluCode?: string | null;
  active: boolean;
};

type PosProduct = {
  id: string;
  tenantId: string;
  categoryId: string;
  categoryName?: string | null;
  name: string;
  shortLabel?: string | null;
  description?: string | null;
  vatRate: number;
  tileColor?: string | null;
  tileIcon?: string | null;
  imageUrl?: string | null;
  active: boolean;
  variants: PosVariant[];
};

// 🔹 Demo data – totdat Prisma-stuk stabiel is
const demoProducts: PosProduct[] = [
  {
    id: "prod_friet",
    tenantId: "demo-tenant",
    categoryId: "cat_friet_snacks",
    categoryName: "Friet & Snacks",
    name: "Friet",
    shortLabel: "Friet",
    description: "Verse friet, afgebakken in zonnebloemolie.",
    vatRate: 9,
    tileColor: "#FFEFAA",
    tileIcon: "🍟",
    imageUrl: null,
    active: true,
    variants: [
      {
        id: "var_friet_klein",
        name: "Klein",
        price: 2.6,
        costPrice: 0.8,
        sku: "FRIET-KLEIN",
        pluCode: null,
        active: true,
      },
      {
        id: "var_friet_groot",
        name: "Groot",
        price: 3.2,
        costPrice: 1.05,
        sku: "FRIET-GROOT",
        pluCode: null,
        active: true,
      },
      {
        id: "var_friet_super",
        name: "Super",
        price: 4.0,
        costPrice: 1.4,
        sku: "FRIET-SUPER",
        pluCode: null,
        active: true,
      },
    ],
  },
];

// GET /pos/products
router.get("/", async (_req, res) => {
  try {
    res.json(demoProducts);
  } catch (e: any) {
    console.error("GET /pos/products error:", e);
    res.status(500).json({ error: e.message });
  }
});

// GET /pos/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = demoProducts.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (e: any) {
    console.error("GET /pos/products/:id error:", e);
    res.status(500).json({ error: e.message });
  }
});

// POST /pos/products (dummy)
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const newId = `prod_${Date.now()}`;
    const newProduct: PosProduct = {
      id: newId,
      tenantId: "demo-tenant",
      categoryId: body.categoryId || "cat_demo",
      categoryName: body.categoryName || "Onbekende categorie",
      name: body.name || "Nieuw product",
      shortLabel: body.shortLabel ?? body.name ?? "Nieuw",
      description: body.description ?? null,
      vatRate: body.vatRate ?? 9,
      tileColor: body.tileColor ?? null,
      tileIcon: body.tileIcon ?? null,
      imageUrl: body.imageUrl ?? null,
      active: true,
      variants: [],
    };

    demoProducts.push(newProduct);
    res.status(201).json(newProduct);
  } catch (e: any) {
    console.error("POST /pos/products error:", e);
    res.status(500).json({ error: e.message });
  }
});

// PUT /pos/products/:id (dummy update)
router.put("/:id", async (req, res) => {
  try {
    const idx = demoProducts.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    demoProducts[idx] = {
      ...demoProducts[idx],
      ...req.body,
    };

    res.json(demoProducts[idx]);
  } catch (e: any) {
    console.error("PUT /pos/products/:id error:", e);
    res.status(500).json({ error: e.message });
  }
});

// DELETE /pos/products/:id (dummy)
router.delete("/:id", async (req, res) => {
  try {
    const idx = demoProducts.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    demoProducts.splice(idx, 1);
    res.status(204).send();
  } catch (e: any) {
    console.error("DELETE /pos/products/:id error:", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
