## schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

//
// ==========================
//  CATEGORY / GROUPS
// ==========================
//

model RevenueGroup {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  color     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  products Product[]

  @@index([tenantId, name])
}

model Category {
  id        String  @id @default(cuid())
  tenantId  String
  name      String
  color     String?
  sortOrder Int     @default(0)
  isActive  Boolean @default(true)

  products Product[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tenantId, sortOrder])
}

model Product {
  id         String  @id @default(cuid())
  tenantId   String
  locationId String?

  name        String
  description String?

  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])

  revenueGroupId String?
  revenueGroup   RevenueGroup? @relation(fields: [revenueGroupId], references: [id])

  isActive     Boolean @default(true)
  isPopular    Boolean @default(false)
  isBestSeller Boolean @default(false)
  isNew        Boolean @default(false)

  allowDiscount Boolean @default(true)
  printGroup    String?

  variants    ProductVariant[]
  ingredients ProductIngredient[]
  menuItems   MenuItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tenantId, categoryId])
  @@index([tenantId, revenueGroupId])
}

model ProductVariant {
  id        String  @id @default(cuid())
  tenantId  String
  productId String
  product   Product @relation(fields: [productId], references: [id])

  name String
  sku  String?

  // DECIMAL velden vereisen backend/frontend validatie.
  priceInclVat Decimal @db.Decimal(10, 2)
  vatRate      Decimal @db.Decimal(4, 2)

  sortOrder Int     @default(0)
  isActive  Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tenantId, productId])
}

model StockItem {
  id       String @id @default(cuid())
  tenantId String
  name     String
  unit     String

  ingredients ProductIngredient[]
}

model ProductIngredient {
  id        String  @id @default(cuid())
  tenantId  String
  productId String
  product   Product @relation(fields: [productId], references: [id])

  stockItemId String
  stockItem   StockItem @relation(fields: [stockItemId], references: [id])

  quantity Decimal @db.Decimal(10, 3)
}

//
// =======================
//   MENU SYSTEM — CLEAN
// =======================
//

model Menu {
  id       String @id @default(cuid())
  tenantId String
  name     String
  slug     String @unique

  description String?

  // Presentatie instellingen
  showImages          Boolean @default(true)
  showPrices          Boolean @default(true)
  showDescription     Boolean @default(false)
  showCategoryHeaders Boolean @default(true)
  showProductBadges   Boolean @default(true)

  // Layout instellingen
  channel    String @default("BOTH")
  layoutType String @default("GRID")
  columns    Int?   @default(3)

  sortOrder Int     @default(0)
  isActive  Boolean @default(true)

  sections MenuSection[]
  items    MenuItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tenantId, sortOrder])
}

model MenuSection {
  id       String @id @default(cuid())
  tenantId String
  menuId   String
  menu     Menu   @relation(fields: [menuId], references: [id])

  title     String
  sortOrder Int    @default(0)

  items MenuItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tenantId, menuId])
}

model MenuItem {
  id       String @id @default(cuid())
  tenantId String

  menuId String
  menu   Menu   @relation(fields: [menuId], references: [id])

  sectionId String?
  section   MenuSection? @relation(fields: [sectionId], references: [id])

  productId String?
  product   Product? @relation(fields: [productId], references: [id])

  sortOrder Int     @default(0)
  isActive  Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tenantId, menuId])
  @@index([tenantId, sectionId])
  @@index([tenantId, productId])
}

## migration <most-recent-migration-folder-name>

// ...existing code...
// Paste the full SQL of the most recent migration here once identified.
// ...existing code...
