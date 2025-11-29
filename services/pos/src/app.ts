import express from "express";
import tablesRouter from "./routes/tables";
import healthRouter from "./routes/health";
import { authMiddleware } from "./middleware/authMiddleware";

// POS-specific routes
import ordersRoutes from "./routes/ordersRoutes";
import kdsRoutes from "./routes/kdsRoutes";

export const app = express();
app.use(express.json());

// Public health check
app.use("/pos/health", healthRouter);

// Orders (no auth for now)
app.use("/pos/orders", ordersRoutes);

// Kitchen Display System
app.use("/pos/kds", kdsRoutes);

// Protected POS routes
app.use("/pos/tables", authMiddleware, tablesRouter);

const PORT = process.env.PORT || 4002;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`POS service listening on port ${PORT}`);
  });
}

export default app;
