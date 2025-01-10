/**
 * Centralized logging utility for server-side logging
 * Provides consistent logging patterns and structured output
 */

import { LOG_CATEGORY, LOG_ACTION, LOG_MESSAGE, type LogCategory, type LogAction } from './constants'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogContext = {
  category: LogCategory
  action?: LogAction
  userId?: string
  path?: string
  timestamp?: string
  [key: string]: any
}

type LogEntry = {
  level: LogLevel
  message: string
  context: LogContext
  error?: Error
}

type FormattedLogData = {
  level: LogLevel
  category: LogCategory
  timestamp: string
  message: string
  error?: {
    name: string
    message: string
    stack?: string
  }
  [key: string]: any
}

/**
 * Format a log entry into a consistent structure
 */
function formatLogEntry(entry: LogEntry): string {
  const { level, message, context, error } = entry
  const { category, timestamp: contextTimestamp, ...restContext } = context
  const timestamp = contextTimestamp || new Date().toISOString()
  
  // Basic log structure
  const logData: FormattedLogData = {
    level,
    category,
    timestamp,
    message,
    ...restContext,
  }

  // Add error details if present
  if (error) {
    logData.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  return JSON.stringify(logData)
}

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, context: LogContext, error?: Error) {
  // Ensure timestamp
  if (!context.timestamp) {
    context.timestamp = new Date().toISOString()
  }

  const entry: LogEntry = {
    level,
    message,
    context,
    error,
  }

  const formattedLog = formatLogEntry(entry)

  // In production, we would send this to a logging service
  // For now, we'll use console with proper log levels
  switch (level) {
    case 'debug':
      if (process.env.NODE_ENV === 'development') {
        console.debug(formattedLog)
      }
      break
    case 'info':
      console.info(formattedLog)
      break
    case 'warn':
      console.warn(formattedLog)
      break
    case 'error':
      console.error(formattedLog)
      break
  }
}

/**
 * Convenience methods for different log levels
 */
export const logger = {
  debug: (message: string, context: LogContext) => log('debug', message, context),
  info: (message: string, context: LogContext) => log('info', message, context),
  warn: (message: string, context: LogContext, error?: Error) => log('warn', message, context, error),
  error: (message: string, context: LogContext, error?: Error) => log('error', message, context, error),
}

// Exports
export { LOG_CATEGORY, LOG_ACTION, LOG_MESSAGE }
export type { LogLevel, LogContext, LogEntry, LogCategory, LogAction } 