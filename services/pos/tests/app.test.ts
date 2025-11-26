import request from 'supertest';
import app from '../src/index';

describe('POS API', () => {
  describe('GET /pos/health', () => {
    it('returns health status', async () => {
      const res = await request(app).get('/pos/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok', service: 'pos' });
    });
  });
});
