import request from 'supertest';
import app from '../src/index';
import { clearAllData } from '../src/services/authService';

describe('IDENTITY API', () => {
  beforeEach(() => {
    clearAllData();
  });

  describe('GET /health', () => {
    it('returns health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok', service: 'identity' });
    });
  });

  describe('POST /auth/register', () => {
    it('registers a new user', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.body.user.name).toBe('Test User');
      expect(res.body.user.roles).toContain('user');
    });

    it('rejects duplicate email', async () => {
      await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password456',
        name: 'Another User',
      });
      expect(res.status).toBe(409);
    });

    it('requires all fields', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
    });

    it('logs in with valid credentials', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('rejects invalid credentials', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(res.status).toBe(401);
    });

    it('requires email and password', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'test@example.com',
      });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /auth/me', () => {
    let token: string;

    beforeEach(async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
      token = res.body.token;
    });

    it('returns current user with valid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.name).toBe('Test User');
    });

    it('rejects invalid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });

    it('requires authorization header', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
