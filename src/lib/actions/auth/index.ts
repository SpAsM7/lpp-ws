/**
 * Authentication Actions Barrel Export
 * 
 * This module exports all authentication-related server actions.
 * Each action follows the naming convention [action][Feature]Action
 * as specified in Section 13.2 of coding standards.
 */

export { createLoginAction } from './create-login';
export { createMagicLinkAction } from './create-magic-link';
export { createResetRequestAction } from './create-reset-request';
export { createSignOutAction } from './create-signout';
export { createSignUpAction } from './create-signup';
export { updatePasswordAction } from './update-password';
export { verifyEmailAction } from './verify-email';