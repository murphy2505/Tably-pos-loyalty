import express from 'express';
import authRouter from './routes/auth';

export const app = express();
app.use(express.json());

app.use('/auth', authRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'identity' }));

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Identity service listening on port ${PORT}`);
  });
}

export default app;
