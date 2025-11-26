import express from 'express';
import tablesRouter from './routes/tables';
import ordersRouter from './routes/orders';
import healthRouter from './routes/health';
import { authMiddleware } from './middleware/authMiddleware';

export const app = express();
app.use(express.json());

// Health endpoint - no auth required
app.use('/pos/health', healthRouter);

// Protected routes - require auth
app.use('/pos/tables', authMiddleware, tablesRouter);
app.use('/pos/orders', authMiddleware, ordersRouter);

const PORT = process.env.PORT || 4002;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`POS service listening on port ${PORT}`);
  });
}

export default app;
