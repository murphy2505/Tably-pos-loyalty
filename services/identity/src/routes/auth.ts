import { Router, Request, Response } from 'express';
import { login, register, getUserFromToken } from '../services/authService';

const router = Router();

// TODO: Add rate limiting middleware to protect against brute-force attacks
// Example: Use express-rate-limit package with appropriate limits for auth routes

/**
 * POST /auth/login
 * Login with email and password
 */
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const result = login(email, password);

  if (!result) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json(result);
});

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  const result = register(email, password, name);

  if (!result) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  res.status(201).json(result);
});

/**
 * GET /auth/me
 * Get current user from Authorization header
 */
router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  const user = getUserFromToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  res.json(user);
});

export default router;
