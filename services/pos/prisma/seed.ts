// services/pos/prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenantId = "demo-tenant";

  // Categories
  const populair = await prisma.category.upsert({
    where: { tenantId_name: { tenantId, name: "Populair" } },
    update: {},
    create: {
      tenantId,
      name: "Populair",
      color: "#FFB300",
    },
  });

  const friet = await prisma.category.upsert({
    where: { tenantId_name: { tenantId, name: "Friet" } },
    update: {},
    create: {
      tenantId,
      name: "Friet",
      color: "#4CAF50",
    },
  });

  const snacks = await prisma.category.upsert({
    where: { tenantId_name: { tenantId, name: "Snacks" } },
    update: {},
    create: {
      tenantId,
      name: "Snacks",
      color: "#1976D2",
    },
  });

  // Products (eenvoudig voorbeeld)
  await prisma.product.createMany({
    data: [
      {
        tenantId,
        name: "Friet klein",
        categoryId: friet.id,
        priceIncl: "2.90",
        vatRate: 9,
      },
      {
        tenantId,
        name: "Friet groot",
        categoryId: friet.id,
        priceIncl: "3.80",
        vatRate: 9,
      },
      {
        tenantId,
        name: "Frikandel",
        categoryId: snacks.id,
        priceIncl: "2.50",
        vatRate: 21,
      },
      {
        tenantId,
        name: "Kroket",
        categoryId: snacks.id,
        priceIncl: "3.10",
        vatRate: 21,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed ✅");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
