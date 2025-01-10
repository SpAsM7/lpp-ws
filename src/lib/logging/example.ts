/**
 * Example usage of the logging utility
 * This file demonstrates various logging patterns and best practices
 */

import { logger, LOG_CATEGORY, LOG_ACTION, LOG_MESSAGE, type LogAction } from '.'

// Example: Logging authentication attempts
export function logAuthAttempt(userId: string, success: boolean) {
  logger.info(
    success ? LOG_MESSAGE.AUTH_SUCCESS : LOG_MESSAGE.AUTH_FAILED,
    {
      category: LOG_CATEGORY.AUTH,
      action: LOG_ACTION.LOGIN,
      userId,
      success,
    }
  )
}

// Example: Logging API requests
export function logApiRequest(path: string, method: string, duration: number) {
  logger.info(
    LOG_MESSAGE.API_SUCCESS,
    {
      category: LOG_CATEGORY.API,
      action: LOG_ACTION.REQUEST,
      path,
      method,
      duration,
    }
  )
}

// Example: Logging errors with stack traces
export function logError(error: Error, context: Record<string, any> = {}) {
  logger.error(
    LOG_MESSAGE.SERVER_ERROR,
    {
      category: LOG_CATEGORY.SERVER,
      action: LOG_ACTION.ERROR,
      ...context,
    },
    error
  )
}

// Example: Logging performance issues
export function logSlowQuery(query: string, duration: number) {
  if (duration > 1000) { // More than 1 second
    logger.warn(
      LOG_MESSAGE.SLOW_PERFORMANCE,
      {
        category: LOG_CATEGORY.PERFORMANCE,
        action: LOG_ACTION.SLOW_QUERY,
        query,
        duration,
      }
    )
  }
}

// Example: Logging security events
export function logSecurityEvent(userId: string, action: string, details: Record<string, any> = {}) {
  logger.warn(
    LOG_MESSAGE.SECURITY_VIOLATION,
    {
      category: LOG_CATEGORY.SECURITY,
      action: LOG_ACTION.UNAUTHORIZED,
      userId,
      details,
    }
  )
}

// Example: Debug logging (only in development)
export function logDebug(message: string, data: Record<string, any> = {}) {
  logger.debug(
    message,
    {
      category: LOG_CATEGORY.SERVER,
      action: LOG_ACTION.REQUEST,
      ...data,
    }
  )
}

// Example: Logging data operations
export function logDataOperation(operation: string, table: string, success: boolean) {
  logger.info(
    success ? LOG_MESSAGE.UPDATE_SUCCESS : LOG_MESSAGE.UPDATE_FAILED,
    {
      category: LOG_CATEGORY.DATA,
      action: operation as LogAction,
      table,
      success,
    }
  )
} 