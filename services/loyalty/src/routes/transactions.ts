import { Router } from 'express';
import { z } from 'zod';
import { recordTransaction, listTransactions } from '../services/transactionService';

const router = Router();

router.post('/', (req, res) => {
  const schema = z.object({ customerId: z.string().uuid(), amount: z.number().positive() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const tx = recordTransaction(parsed.data.customerId, parsed.data.amount);
    res.status(201).json(tx);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', (req, res) => {
  const { customerId } = req.query;
  if (customerId && typeof customerId !== 'string') return res.status(400).json({ error: 'Invalid customerId' });
  res.json(listTransactions(customerId));
});

export default router;
