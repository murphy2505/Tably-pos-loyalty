import express from "express";
import ordersRoutes from "./routes/ordersRoutes";
import kdsRoutes from "./routes/kdsRoutes";
import healthRouter from "./routes/health";
import tablesRouter from "./routes/tables";
import authMiddleware from "./middleware/auth";
import categoriesRoutes from "./routes/categories";
import productsRoutes from "./routes/products";
import variantsRoutes from "./routes/variants";
import stockRoutes from "./routes/stock";
import coreOrdersRoutes from "./routes/orders";
import customersRouter from "./routes/customersRouter";
import categoriesRouter from "./routes/categoriesRouter";

const app = express();

// Body parser vóór routes
app.use(express.json());

// POS routes
app.use("/pos/health", healthRouter);
app.use("/pos/orders", ordersRoutes);
app.use("/pos/kds", kdsRoutes);

// Optioneel protected
app.use("/pos/tables", authMiddleware, tablesRouter);
app.use("/pos/core/categories", categoriesRoutes);
app.use("/pos/core/products", productsRoutes);
app.use("/pos/core/variants", variantsRoutes);
app.use("/pos/core/stock", stockRoutes);
app.use("/pos/core/orders", coreOrdersRoutes);

// Customers and categories
app.use("/customers", customersRouter);
app.use("/categories", categoriesRouter);

export default app;
