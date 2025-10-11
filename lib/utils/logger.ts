/**
 * Production-Safe Logger Utility
 * 
 * Automatically disables debug logs in production while keeping errors visible.
 * 
 * Usage:
 * import { logger } from '@/lib/utils/logger'
 * 
 * logger.debug('Debug info')  // Only in development
 * logger.log('General log')   // Only in development
 * logger.warn('Warning')      // Only in development
 * logger.error('Error!')      // Always logged
 * logger.info('Info')         // Only in development
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

export const logger = {
  /**
   * Debug logs - only in development
   * Use for detailed debugging information
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args)
    }
  },

  /**
   * General logs - only in development
   * Use for general information
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  /**
   * Info logs - only in development
   * Use for informational messages
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },

  /**
   * Warning logs - only in development
   * Use for warning messages
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },

  /**
   * Error logs - ALWAYS logged (even in production)
   * Use for errors that need tracking
   */
  error: (...args: any[]) => {
    console.error(...args)
  },

  /**
   * Success logs - only in development
   * Use for success messages
   */
  success: (...args: any[]) => {
    if (isDevelopment) {
      console.log('✅', ...args)
    }
  },

  /**
   * Production-only logs
   * Use for critical production monitoring
   */
  prod: (...args: any[]) => {
    if (isProduction) {
      console.log('[PROD]', ...args)
    }
  },
}

// Export singleton instance
export default logger
