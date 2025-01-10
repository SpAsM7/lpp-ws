export const AUTH_ERRORS = {
  INVALID_RESET_LINK: {
    code: 'auth/invalid-reset-link',
    message: 'Invalid or expired password reset link. Please request a new one.',
  },
  TOO_MANY_REQUESTS: {
    code: 'auth/too-many-requests',
    message: 'Too many reset attempts. Please try again in 5 minutes.',
  },
  RESET_IN_PROGRESS: {
    code: 'auth/reset-in-progress',
    message: 'A password reset is already in progress. Please check your email or try again in 5 minutes.',
  },
  RESET_REQUEST_FAILED: {
    code: 'auth/reset-request-failed',
    message: 'Failed to send password reset email. Please try again.',
  },
  NO_CODE: {
    code: 'auth/no-code',
    message: 'No authorization code found',
  },
  NO_SESSION: {
    code: 'auth/no-session',
    message: 'No session data returned from authentication',
  },
  SESSION_EXPIRED: {
    code: 'auth/session-expired',
    message: 'Your session has expired. Please sign in again.',
  },
  INVALID_CREDENTIALS: {
    code: 'auth/invalid-credentials',
    message: 'Invalid email or password.',
  },
  USER_EXISTS: {
    code: 'auth/user-exists',
    message: 'An account with this email already exists.',
  },
  WEAK_PASSWORD: {
    code: 'auth/weak-password',
    message: 'Password must be at least 8 characters and contain uppercase, lowercase, and numbers.',
  },
  SIGNUP_FAILED: {
    code: 'auth/signup-failed',
    message: 'Failed to create account. Please try again.',
  },
  INVALID_INPUT: {
    code: 'auth/invalid-input',
    message: 'Please check your input and try again.',
  },
  UNKNOWN: {
    code: 'auth/unknown',
    message: 'An unknown authentication error occurred.',
  },
  EMAIL_NOT_VERIFIED: {
    code: 'auth/email-not-verified',
    message: 'Please verify your email before signing in',
  },
  INVALID_CODE: {
    code: 'auth/invalid-code',
    message: 'Invalid or expired authorization code',
  },
  USER_NOT_FOUND: {
    code: 'auth/user-not-found',
    message: 'No user found with this email',
  },
  PASSWORD_MISMATCH: {
    code: 'auth/password-mismatch',
    message: 'Passwords do not match',
  },
  SESSION_ERROR: {
    code: 'auth/session-error',
    message: 'Failed to create or validate session',
  },
  INVALID_REQUEST: {
    code: 'auth/invalid-request',
    message: 'Invalid authentication request',
  },
} as const

export type AuthErrorCode = keyof typeof AUTH_ERRORS
