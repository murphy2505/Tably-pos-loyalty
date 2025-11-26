import { Router } from 'express';
import { z } from 'zod';
import { redeemPoints, listRedemptions } from '../services/rewardService';

const router = Router();

router.post('/redeem', (req, res) => {
  const schema = z.object({ customerId: z.string().uuid(), points: z.number().int().positive() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const redemption = redeemPoints(parsed.data.customerId, parsed.data.points);
    res.status(201).json(redemption);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', (req, res) => {
  const { customerId } = req.query;
  if (customerId && typeof customerId !== 'string') return res.status(400).json({ error: 'Invalid customerId' });
  res.json(listRedemptions(customerId));
});

export default router;
