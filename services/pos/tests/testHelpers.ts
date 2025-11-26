/**
 * Creates a test token for use in tests only.
 * This creates a base64-encoded JSON token that the auth middleware can decode.
 */
export function createTestToken(tenantId: string, userId: string): string {
  return Buffer.from(JSON.stringify({ tenantId, userId })).toString('base64');
}
