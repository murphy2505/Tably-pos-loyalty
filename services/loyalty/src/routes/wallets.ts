import { Router } from 'express';
import { z } from 'zod';
import { getWalletById, addToWallet, redeemFromWallet } from '../services/walletsService';

const router = Router();

// GET /wallets/:id
router.get('/:id', (req, res) => {
  (async () => {
    try {
      const wallet = await getWalletById(req.params.id);
      if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
      res.json(wallet);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  })();
});

// POST /wallets/:id/add
router.post('/:id/add', (req, res) => {
  const schema = z.object({
    amount: z.number().positive(),
    description: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  (async () => {
    try {
      const result = await addToWallet(req.params.id, parsed.data.amount, parsed.data.description);
      res.status(201).json(result);
    } catch (e: any) {
      if (e.message === 'Wallet not found') return res.status(404).json({ error: e.message });
      res.status(400).json({ error: e.message });
    }
  })();
});

// POST /wallets/:id/redeem
router.post('/:id/redeem', (req, res) => {
  const schema = z.object({
    amount: z.number().positive(),
    description: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  (async () => {
    try {
      const result = await redeemFromWallet(req.params.id, parsed.data.amount, parsed.data.description);
      res.status(201).json(result);
    } catch (e: any) {
      if (e.message === 'Wallet not found') return res.status(404).json({ error: e.message });
      res.status(400).json({ error: e.message });
    }
  })();
});

export default router;
