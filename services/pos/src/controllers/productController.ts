// services/pos/src/controllers/productController.ts
import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function getTenantId(req: Request): string {
  const tenantId = req.header("x-tenant-id");
  if (!tenantId || typeof tenantId !== "string") {
    throw new Error("Missing tenantId");
  }
  return tenantId;
}

// GET /pos/core/products
export async function getAllProducts(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);

    const products = await prisma.product.findMany({
      where: { tenantId },
      include: {
        // Alleen relaties die zeker in je schema staan
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(products);
  } catch (err) {
    console.error("Error getAllProducts", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

// GET /pos/core/products/:id
export async function getProductById(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: { id, tenantId },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error getProductById", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
}

// POST /pos/core/products
export async function createProduct(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);

    const { name, vatRate, categoryId } = req.body as {
      name?: string;
      vatRate?: number;
      categoryId?: string;
    };

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!categoryId || typeof categoryId !== "string") {
      return res.status(400).json({ message: "categoryId is required" });
    }

    const finalVatRate = typeof vatRate === "number" ? vatRate : 21;

    const data: Prisma.ProductUncheckedCreateInput = {
      tenantId,
      name,
      categoryId,
      vatRate: finalVatRate,
    };

    const product = await prisma.product.create({
      data,
      include: {
        category: true,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error createProduct", err);
    res.status(500).json({ message: "Failed to create product" });
  }
}

// PUT /pos/core/products/:id
export async function updateProduct(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    const { name, vatRate, categoryId } = req.body as {
      name?: string;
      vatRate?: number;
      categoryId?: string;
    };

    const existing = await prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    const data: Prisma.ProductUncheckedUpdateInput = {};

    if (typeof name === "string" && name.length > 0) {
      data.name = name;
    }

    if (typeof vatRate === "number") {
      data.vatRate = vatRate;
    }

    if (typeof categoryId === "string" && categoryId.length > 0) {
      data.categoryId = categoryId;
    }


    const product = await prisma.product.update({
      where: { id: existing.id },
      data,
      include: {
        category: true,
      },
    });

    res.json(product);
  } catch (err) {
    console.error("Error updateProduct", err);
    res.status(500).json({ message: "Failed to update product" });
  }
}

// DELETE /pos/core/products/:id
export async function deleteProduct(req: Request, res: Response) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;

    const existing = await prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    await prisma.product.delete({
      where: { id: existing.id },
    });

    res.status(204).send();
  } catch (err) {
    console.error("Error deleteProduct", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
}
