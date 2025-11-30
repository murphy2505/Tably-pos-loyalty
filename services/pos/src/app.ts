import express from "express";
import ordersRoutes from "./routes/ordersRoutes";
import kdsRoutes from "./routes/kdsRoutes";
import healthRouter from "./routes/health";
import tablesRouter from "./routes/tables";
import authMiddleware from "./middleware/auth"; // zorg dat dit pad klopt

const app = express();
app.use(express.json());

// Registratie van routers
app.use("/pos/orders", ordersRoutes);
app.use("/pos/kds", kdsRoutes);
app.use("/pos/health", healthRouter);
app.use("/pos/tables", authMiddleware, tablesRouter);

const PORT = process.env.PORT || 4002;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`POS service listening on port ${PORT}`);
  });
}

export default app;
