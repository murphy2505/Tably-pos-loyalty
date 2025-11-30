import express from "express";
import ordersRoutes from "./routes/ordersRoutes";
import kdsRoutes from "./routes/kdsRoutes";
import healthRouter from "./routes/health";
import tablesRouter from "./routes/tables";

export const app = express();
app.use(express.json());

// Registratie van routers
app.use("/pos/orders", ordersRoutes);
app.use("/pos/kds", kdsRoutes);
app.use("/pos/health", healthRouter);

// Voor nu ZONDER auth, gewoon open:
app.use("/pos/tables", tablesRouter);

const PORT = process.env.PORT || 4002;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`POS service listening on port ${PORT}`);
  });
}

export default app;
