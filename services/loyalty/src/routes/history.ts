import { Router } from 'express';
import { getCustomerHistory } from '../services/historyService';

const router = Router();

// GET /history/customer/:id → volledige timeline
router.get('/customer/:id', (req, res) => {
  (async () => {
    try {
      const history = await getCustomerHistory(req.params.id);
      res.json(history);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  })();
});

export default router;
