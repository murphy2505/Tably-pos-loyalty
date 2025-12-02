import express from "express";
import cors from "cors";

import healthRouter from "./routes/health";
import kdsRoutes from "./routes/kdsRoutes";
import tablesRouter from "./routes/tables";
import authMiddleware from "./middleware/auth";

// Core/beheer routes
import categoriesRoutes from "./routes/categories";
import productsRoutes from "./routes/products";
import variantsRoutes from "./routes/variants";
import stockRoutes from "./routes/stock";
import ordersRoutes from "./routes/orders";
import customersRouter from "./routes/customersRouter";

// 🔹 NIEUW: POS bootstrap
import bootstrapRouter from "./routes/bootstrap";

const app = express();

// Middleware vóór routes
app.use(cors());
app.use(express.json());

/**
 * Public / basis POS endpoints
 */
app.use("/pos/health", healthRouter);
app.use("/pos/kds", kdsRoutes);

// Orders
app.use("/pos/orders", ordersRoutes);

/**
 * Protected / core beheer endpoints
 */
app.use("/pos/tables", authMiddleware, tablesRouter);
app.use("/pos/core/categories", authMiddleware, categoriesRoutes);
app.use("/pos/core/products", authMiddleware, productsRoutes);
app.use("/pos/core/variants", authMiddleware, variantsRoutes);
app.use("/pos/core/stock", authMiddleware, stockRoutes);

/**
 * POS-klanten endpoint (alleen onder /pos/customers)
 * Klantdata is single source of truth in loyalty-service.
 */
app.use("/pos/customers", authMiddleware, customersRouter);

/**
 * 🔹 POS bootstrap (volledige set data voor producten/menus/modifiers)
 * Ook gewoon achter auth, want dit is hele POS-config.
 */
app.use("/pos/bootstrap", authMiddleware, bootstrapRouter);

export default app;
