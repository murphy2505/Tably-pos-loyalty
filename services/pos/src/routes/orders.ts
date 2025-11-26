import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import {
  createOrder,
  addItem,
  listOrders,
  listOrdersForTable,
  setOrderStatus,
} from '../services/orderService';
import { Order } from '../models/types';

const router = Router();

router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const orders = listOrders(tenantId);
  res.json(orders);
});

router.get('/tables/:tableId/orders', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const { tableId } = req.params;
  const orders = listOrdersForTable(tenantId, tableId);
  res.json(orders);
});

router.post('/', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const { tableId, items } = req.body;

  if (!tableId) {
    res.status(400).json({ error: 'tableId is required' });
    return;
  }

  if (!Array.isArray(items)) {
    res.status(400).json({ error: 'items must be an array' });
    return;
  }

  const order = createOrder(tenantId, tableId, items);
  res.status(201).json(order);
});

router.post('/:orderId/items', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const { orderId } = req.params;
  const item = req.body;

  if (!item.productId || !item.name || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
    res.status(400).json({ error: 'Item must have productId, name, quantity, and price' });
    return;
  }

  const order = addItem(tenantId, orderId, item);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.json(order);
});

router.patch('/:orderId/status', (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses: Order['status'][] = ['open', 'in_kitchen', 'ready', 'completed'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be one of: open, in_kitchen, ready, completed' });
    return;
  }

  const order = setOrderStatus(tenantId, orderId, status);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.json(order);
});

export default router;
