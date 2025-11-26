import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { createTable, listTables, setTableStatus } from '../services/tableService';
import { Table } from '../models/types';

const router = Router();

router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const tables = listTables(tenantId);
  res.json(tables);
});

router.post('/', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const { number } = req.body;

  if (typeof number !== 'number') {
    res.status(400).json({ error: 'Table number is required' });
    return;
  }

  const table = createTable(tenantId, number);
  res.status(201).json(table);
});

router.patch('/:id/status', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses: Table['status'][] = ['open', 'occupied', 'closed'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be one of: open, occupied, closed' });
    return;
  }

  const table = setTableStatus(tenantId, id, status);
  if (!table) {
    res.status(404).json({ error: 'Table not found' });
    return;
  }

  res.json(table);
});

export default router;
