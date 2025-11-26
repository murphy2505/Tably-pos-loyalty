import request from 'supertest';
import app from '../src/index';
import { createTestToken } from '../src/middleware/authMiddleware';
import { clearAllData } from '../src/db/memory';

describe('POS Orders API', () => {
  const tenantA = 'tenant-a';
  const tenantB = 'tenant-b';
  const userId = 'user-1';
  const tokenA = createTestToken(tenantA, userId);
  const tokenB = createTestToken(tenantB, userId);

  beforeEach(() => {
    clearAllData();
  });

  describe('POST /pos/orders', () => {
    it('creates an order', async () => {
      const res = await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          tableId: 'table-1',
          items: [
            { productId: 'prod-1', name: 'Coffee', quantity: 2, price: 3.50 },
          ],
        });
      
      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.tableId).toBe('table-1');
      expect(res.body.tenantId).toBe(tenantA);
      expect(res.body.status).toBe('open');
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].id).toBeDefined();
    });

    it('requires tableId', async () => {
      const res = await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ items: [] });
      
      expect(res.status).toBe(400);
    });

    it('requires items array', async () => {
      const res = await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ tableId: 'table-1' });
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /pos/orders', () => {
    it('returns orders for tenant', async () => {
      await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ tableId: 'table-1', items: [] });

      const res = await request(app)
        .get('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('GET /pos/orders/tables/:tableId/orders', () => {
    it('returns orders for specific table', async () => {
      await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ tableId: 'table-1', items: [] });

      await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ tableId: 'table-2', items: [] });

      const res = await request(app)
        .get('/pos/orders/tables/table-1/orders')
        .set('Authorization', `Bearer ${tokenA}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].tableId).toBe('table-1');
    });
  });

  describe('POST /pos/orders/:orderId/items', () => {
    it('adds item to order', async () => {
      const createRes = await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ tableId: 'table-1', items: [] });
      
      const orderId = createRes.body.id;

      const res = await request(app)
        .post(`/pos/orders/${orderId}/items`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ productId: 'prod-1', name: 'Coffee', quantity: 1, price: 3.50 });
      
      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
    });

    it('requires valid item fields', async () => {
      const createRes = await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ tableId: 'table-1', items: [] });
      
      const orderId = createRes.body.id;

      const res = await request(app)
        .post(`/pos/orders/${orderId}/items`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Coffee' });
      
      expect(res.status).toBe(400);
    });

    it('returns 404 for non-existent order', async () => {
      const res = await request(app)
        .post('/pos/orders/non-existent/items')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ productId: 'prod-1', name: 'Coffee', quantity: 1, price: 3.50 });
      
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /pos/orders/:orderId/status', () => {
    it('updates order status', async () => {
      const createRes = await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ tableId: 'table-1', items: [] });
      
      const orderId = createRes.body.id;

      const res = await request(app)
        .patch(`/pos/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ status: 'in_kitchen' });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('in_kitchen');
    });

    it('rejects invalid status', async () => {
      const createRes = await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ tableId: 'table-1', items: [] });
      
      const orderId = createRes.body.id;

      const res = await request(app)
        .patch(`/pos/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ status: 'invalid' });
      
      expect(res.status).toBe(400);
    });
  });

  describe('Tenant isolation', () => {
    it('tenant A cannot see tenant B orders', async () => {
      // Create order for tenant A
      await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ tableId: 'table-1', items: [] });

      // Create order for tenant B
      await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ tableId: 'table-1', items: [] });

      // Tenant A should only see their own order
      const resA = await request(app)
        .get('/pos/orders')
        .set('Authorization', `Bearer ${tokenA}`);
      
      expect(resA.body).toHaveLength(1);
      expect(resA.body[0].tenantId).toBe(tenantA);

      // Tenant B should only see their own order
      const resB = await request(app)
        .get('/pos/orders')
        .set('Authorization', `Bearer ${tokenB}`);
      
      expect(resB.body).toHaveLength(1);
      expect(resB.body[0].tenantId).toBe(tenantB);
    });

    it('tenant A cannot modify tenant B order', async () => {
      // Create order for tenant B
      const createRes = await request(app)
        .post('/pos/orders')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ tableId: 'table-1', items: [] });
      
      const orderId = createRes.body.id;

      // Tenant A tries to update tenant B's order
      const res = await request(app)
        .patch(`/pos/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ status: 'in_kitchen' });
      
      expect(res.status).toBe(404);
    });

    it('tenant A cannot see tenant B tables', async () => {
      // Create table for tenant A
      await request(app)
        .post('/pos/tables')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ number: 1 });

      // Create table for tenant B
      await request(app)
        .post('/pos/tables')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ number: 1 });

      // Tenant A should only see their own table
      const resA = await request(app)
        .get('/pos/tables')
        .set('Authorization', `Bearer ${tokenA}`);
      
      expect(resA.body).toHaveLength(1);
      expect(resA.body[0].tenantId).toBe(tenantA);
    });
  });
});
