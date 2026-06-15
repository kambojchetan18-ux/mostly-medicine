import { randomUUID } from "crypto";

/**
 * Generate a unique request ID (v4 UUID) for tracing API calls
 * through logs and response headers.
 */
export function getRequestId(): string {
  return randomUUID();
}
