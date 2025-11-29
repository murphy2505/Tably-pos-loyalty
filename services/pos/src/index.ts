import express from 'express';
import tablesRouter from './routes/tables';
import healthRouter from './routes/health';
import { authMiddleware } from './middleware/authMiddleware';

// NEW router
import ordersRoutes from "./routes/ordersRoutes";

export const app = express();
app.use(express.json());

// Health endpoint - no auth required
app.use('/pos/health', healthRouter);

// NEW: Use the new orders API WITHOUT auth (for now)
app.use('/pos/orders', ordersRoutes);

// Protected routes (tables for example)
app.use('/pos/tables', authMiddleware, tablesRouter);

const PORT = process.env.PORT || 4002;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`POS service listening on port ${PORT}`);
  });
}

export default app;
