import express from "express";
import ordersRoutes from "./routes/ordersRoutes";
import kdsRoutes from "./routes/kdsRoutes";
import healthRouter from "./routes/health";
import tablesRouter from "./routes/tables";
import authMiddleware from "./middleware/auth";

const app = express();

// Body parser vóór routes
app.use(express.json());

// POS routes
app.use("/pos/health", healthRouter);
app.use("/pos/orders", ordersRoutes);
app.use("/pos/kds", kdsRoutes);

// Optioneel protected
app.use("/pos/tables", authMiddleware, tablesRouter);

export default app;
