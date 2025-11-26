import { v4 as uuidv4 } from 'uuid';
import { User, AuthResponse } from '../models/types';

// TODO: Replace with database (Prisma) integration
// In-memory storage for users
const users: Map<string, User & { password: string }> = new Map();

// TODO: Replace with proper JWT implementation
// Dummy token storage: token -> userId
const tokens: Map<string, string> = new Map();

// Default tenant for demo purposes
// TODO: Implement proper multi-tenant support
const DEFAULT_TENANT_ID = 'default-tenant';

/**
 * Login with email and password
 * TODO: Implement proper password hashing (bcrypt)
 * TODO: Implement JWT token generation
 */
export function login(email: string, password: string): AuthResponse | null {
  const user = Array.from(users.values()).find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return null;
  }

  // Generate a dummy token (userId as token for now)
  // TODO: Replace with JWT
  const token = `token-${user.id}`;
  tokens.set(token, user.id);

  const { password: _, ...userWithoutPassword } = user;
  return {
    token,
    user: userWithoutPassword,
  };
}

/**
 * Register a new user
 * TODO: Implement proper password hashing (bcrypt)
 * TODO: Add email validation and uniqueness check with database
 * TODO: Implement proper multi-tenant user creation
 */
export function register(
  email: string,
  password: string,
  name: string
): AuthResponse | null {
  // Check if email already exists
  const existingUser = Array.from(users.values()).find((u) => u.email === email);
  if (existingUser) {
    return null;
  }

  const id = uuidv4();
  const user: User & { password: string } = {
    id,
    email,
    password, // TODO: Hash password before storing
    name,
    roles: ['user'], // Default role
    tenantId: DEFAULT_TENANT_ID,
  };

  users.set(id, user);

  // Generate a dummy token
  // TODO: Replace with JWT
  const token = `token-${id}`;
  tokens.set(token, id);

  const { password: _, ...userWithoutPassword } = user;
  return {
    token,
    user: userWithoutPassword,
  };
}

/**
 * Get user from token
 * TODO: Implement JWT verification
 */
export function getUserFromToken(token: string): User | null {
  const userId = tokens.get(token);
  if (!userId) {
    return null;
  }

  const user = users.get(userId);
  if (!user) {
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Clear all data (useful for testing)
 */
export function clearAllData(): void {
  users.clear();
  tokens.clear();
}
