import express from 'express';
import customersRouter from './routes/customers.js';
import transactionsRouter from './routes/transactions.js';
import rewardsRouter from './routes/rewards.js';

const app = express();
app.use(express.json());

app.use('/customers', customersRouter);
app.use('/transactions', transactionsRouter);
app.use('/rewards', rewardsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(PORT, () => {
    console.log(`Loyalty service listening on port ${PORT}`);
  });
}

export default app;
