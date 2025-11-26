import request from 'supertest';
import app from '../src/index';

let customerId: string;

describe('LOYALTY API', () => {
  it('creates a customer', async () => {
    const res = await request(app).post('/customers').send({ name: 'Alice' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.points).toBe(0);
    customerId = res.body.id;
  });

  it('records a transaction and accrues points', async () => {
    const res = await request(app).post('/transactions').send({ customerId, amount: 42.75 });
    expect(res.status).toBe(201);
    expect(res.body.pointsEarned).toBeGreaterThan(0);
    const list = await request(app).get('/customers');
    const cust = list.body.find((c: any) => c.id === customerId);
    expect(cust.points).toBe(res.body.pointsEarned);
  });

  it('redeems points', async () => {
    const listBefore = await request(app).get('/customers');
    const custBefore = listBefore.body.find((c: any) => c.id === customerId);
    const toRedeem = Math.floor(custBefore.points / 2) || 1;
    const res = await request(app).post('/rewards/redeem').send({ customerId, points: toRedeem });
    expect(res.status).toBe(201);
    const listAfter = await request(app).get('/customers');
    const custAfter = listAfter.body.find((c: any) => c.id === customerId);
    expect(custAfter.points).toBe(custBefore.points - toRedeem);
  });
});
