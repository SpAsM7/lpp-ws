/**
 * Logger utility for consistent logging across the application
 * Uses console in development and could be replaced with a proper logging service in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

function formatMessage(level: LogLevel, event: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` | context=${JSON.stringify(context)}` : '';
  return `[${timestamp}] ${level.toUpperCase()} ${event}${contextStr}`;
}

/**
 * Application logger
 * In production, this should be replaced with a proper logging service
 */
export const logger = {
  debug(event: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('debug', event, context));
    }
  },

  info(event: string, context?: LogContext) {
    console.info(formatMessage('info', event, context));
  },

  warn(event: string, context?: LogContext) {
    console.warn(formatMessage('warn', event, context));
  },

  error(event: string, context?: LogContext) {
    console.error(formatMessage('error', event, context));
  }
};
