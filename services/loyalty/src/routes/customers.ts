import { Router } from 'express';
import { z } from 'zod';
import { createCustomer, listCustomers } from '../services/customerService.js';

const router = Router();

router.post('/', (req, res) => {
  const schema = z.object({ name: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const customer = createCustomer(parsed.data.name);
    res.status(201).json(customer);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', (_req, res) => {
  res.json(listCustomers());
});

export default router;
