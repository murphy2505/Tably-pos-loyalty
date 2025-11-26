import request from 'supertest';
import app from '../src/index';
import { createTestToken } from '../src/middleware/authMiddleware';
import { clearAllData } from '../src/db/memory';

describe('POS Tables API', () => {
  const tenantId = 'tenant-1';
  const userId = 'user-1';
  const token = createTestToken(tenantId, userId);

  beforeEach(() => {
    clearAllData();
  });

  describe('POST /pos/tables', () => {
    it('creates a table', async () => {
      const res = await request(app)
        .post('/pos/tables')
        .set('Authorization', `Bearer ${token}`)
        .send({ number: 1 });
      
      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.number).toBe(1);
      expect(res.body.tenantId).toBe(tenantId);
      expect(res.body.status).toBe('open');
    });

    it('requires table number', async () => {
      const res = await request(app)
        .post('/pos/tables')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      
      expect(res.status).toBe(400);
    });

    it('requires authorization', async () => {
      const res = await request(app)
        .post('/pos/tables')
        .send({ number: 1 });
      
      expect(res.status).toBe(401);
    });
  });

  describe('GET /pos/tables', () => {
    it('returns tables for tenant', async () => {
      await request(app)
        .post('/pos/tables')
        .set('Authorization', `Bearer ${token}`)
        .send({ number: 1 });
      
      await request(app)
        .post('/pos/tables')
        .set('Authorization', `Bearer ${token}`)
        .send({ number: 2 });

      const res = await request(app)
        .get('/pos/tables')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('PATCH /pos/tables/:id/status', () => {
    it('updates table status', async () => {
      const createRes = await request(app)
        .post('/pos/tables')
        .set('Authorization', `Bearer ${token}`)
        .send({ number: 1 });
      
      const tableId = createRes.body.id;

      const res = await request(app)
        .patch(`/pos/tables/${tableId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'occupied' });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('occupied');
    });

    it('rejects invalid status', async () => {
      const createRes = await request(app)
        .post('/pos/tables')
        .set('Authorization', `Bearer ${token}`)
        .send({ number: 1 });
      
      const tableId = createRes.body.id;

      const res = await request(app)
        .patch(`/pos/tables/${tableId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'invalid' });
      
      expect(res.status).toBe(400);
    });

    it('returns 404 for non-existent table', async () => {
      const res = await request(app)
        .patch('/pos/tables/non-existent/status')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'occupied' });
      
      expect(res.status).toBe(404);
    });
  });
});
