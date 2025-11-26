/**
 * User type for multi-tenant authentication
 */
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  tenantId: string;
}

/**
 * Tenant type for multi-tenant support
 */
export interface Tenant {
  id: string;
  name: string;
}

/**
 * Login payload type
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Register payload type
 */
export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

/**
 * Auth response with token
 */
export interface AuthResponse {
  token: string;
  user: User;
}
