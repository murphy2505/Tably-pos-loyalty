// services/pos/src/app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRouter from "./routes/health";
import ordersRouter from "./routes/orders";
import kdsRouter from "./routes/kdsRoutes";
import categoriesRouter from "./routes/categories";
import productsRouter from "./routes/products";
import variantsRouter from "./routes/variants";
import stockRouter from "./routes/stock";
import tablesRouter from "./routes/tables";
// Sprint 2 features disabled for current schema
// import menusRouter from "./routes/menus";
// import menuItemsRouter from "./routes/menuItems";
// import modifiersRouter from "./routes/modifiers";
// import revenueGroupsRouter from "./routes/revenueGroups";
import authMiddleware from "./middleware/auth";

dotenv.config();

const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// ====== HEALTH ======
app.use("/pos/health", healthRouter);

// ====== PUBLIC POS ENDPOINTS (orders/kds) ======
app.use("/pos/orders", ordersRouter);
app.use("/pos/kds", kdsRouter);

// ====== PROTECTED CORE API (met tenant headers) ======
app.use("/pos/core/categories", authMiddleware, categoriesRouter);
app.use("/pos/core/products", authMiddleware, productsRouter);
app.use("/pos/core/variants", authMiddleware, variantsRouter);
app.use("/pos/core/stock", authMiddleware, stockRouter);
app.use("/pos/tables", authMiddleware, tablesRouter);

// Menus and Menu Items core endpoints
// app.use("/pos/core/menus", authMiddleware, menusRouter);
// app.use("/pos/core/menu-items", authMiddleware, menuItemsRouter);
// app.use("/pos/core/modifiers", authMiddleware, modifiersRouter);
// app.use("/pos/core/revenue-groups", authMiddleware, revenueGroupsRouter);

// ====== JSON ERROR HANDLERS ======
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error in POS service:", err);
    if (res.headersSent) {
      return;
    }
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
  });
});

export default app;
