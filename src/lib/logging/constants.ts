/**
 * Constants for logging categories and common messages
 */

export const LOG_CATEGORY = {
  AUTH: 'auth',
  DATA: 'data',
  API: 'api',
  SERVER: 'server',
  CLIENT: 'client',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
} as const

export const LOG_ACTION = {
  // Auth actions
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  PASSWORD_RESET: 'password_reset',
  EMAIL_VERIFY: 'email_verify',
  SESSION_REFRESH: 'session_refresh',
  
  // Data actions
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  QUERY: 'query',
  
  // API actions
  REQUEST: 'request',
  RESPONSE: 'response',
  ERROR: 'error',
  
  // Server actions
  STARTUP: 'startup',
  SHUTDOWN: 'shutdown',
  MIDDLEWARE: 'middleware',
  
  // Performance actions
  SLOW_QUERY: 'slow_query',
  CACHE_MISS: 'cache_miss',
  HIGH_MEMORY: 'high_memory',
  
  // Security actions
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  INVALID_TOKEN: 'invalid_token',
  RATE_LIMIT: 'rate_limit',
} as const

export const LOG_MESSAGE = {
  // Auth messages
  AUTH_SUCCESS: 'Authentication successful',
  AUTH_FAILED: 'Authentication failed',
  SESSION_EXPIRED: 'Session expired',
  TOKEN_INVALID: 'Invalid token',
  
  // Data messages
  QUERY_SUCCESS: 'Query completed successfully',
  QUERY_FAILED: 'Query failed',
  UPDATE_SUCCESS: 'Update completed successfully',
  UPDATE_FAILED: 'Update failed',
  
  // API messages
  API_SUCCESS: 'API request successful',
  API_FAILED: 'API request failed',
  RATE_LIMITED: 'Rate limit exceeded',
  
  // Server messages
  SERVER_ERROR: 'Internal server error',
  MIDDLEWARE_ERROR: 'Middleware error',
  VALIDATION_ERROR: 'Validation error',
  
  // Performance messages
  SLOW_PERFORMANCE: 'Performance degradation detected',
  MEMORY_WARNING: 'High memory usage detected',
  
  // Security messages
  ACCESS_DENIED: 'Access denied',
  INVALID_REQUEST: 'Invalid request',
  SECURITY_VIOLATION: 'Security violation detected',
} as const

// Type exports
export type LogCategory = typeof LOG_CATEGORY[keyof typeof LOG_CATEGORY]
export type LogAction = typeof LOG_ACTION[keyof typeof LOG_ACTION]
export type LogMessage = typeof LOG_MESSAGE[keyof typeof LOG_MESSAGE] 