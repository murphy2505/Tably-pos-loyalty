import express from 'express';
import customersRouter from './routes/customers';
import transactionsRouter from './routes/transactions';
import rewardsRouter from './routes/rewards';
import walletsRouter from './routes/wallets';
import historyRouter from './routes/history';
import cors from 'cors';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/customers', customersRouter);
app.use('/transactions', transactionsRouter);
app.use('/rewards', rewardsRouter);

// Nieuwe routers
app.use('/wallets', walletsRouter);
app.use('/history', historyRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Loyalty service listening on port ${PORT}`);
  });
}

export default app;
