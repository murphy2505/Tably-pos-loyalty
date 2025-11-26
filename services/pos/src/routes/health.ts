import { Router, Response } from 'express';

const router = Router();

router.get('/', (_req, res: Response) => {
  res.json({ status: 'ok', service: 'pos' });
});

export default router;
