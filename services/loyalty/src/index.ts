import express from 'express';
import customersRouter from './routes/customers';
import transactionsRouter from './routes/transactions';
import rewardsRouter from './routes/rewards';

export const app = express();
app.use(express.json());

app.use('/customers', customersRouter);
app.use('/transactions', transactionsRouter);
app.use('/rewards', rewardsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Loyalty service listening on port ${PORT}`);
  });
}

export default app;
