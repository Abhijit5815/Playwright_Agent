// Structured logging utility
import { ENV } from '../config/constants';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private logLevel: LogLevel;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(level: LogLevel = 'info') {
    this.logLevel = level as LogLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.logLevel];
  }

  private formatEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(typeof data !== 'undefined' ? { data } : {}),
    };
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      const entry = this.formatEntry('debug', message, data);
      console.log('[DEBUG]', entry.message, data ? entry.data : '');
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      const entry = this.formatEntry('info', message, data);
      console.log('[INFO]', entry.message, data ? entry.data : '');
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      const entry = this.formatEntry('warn', message, data);
      console.warn('[WARN]', entry.message, data ? entry.data : '');
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      const entry = this.formatEntry('error', message, error);
      console.error('[ERROR]', entry.message, error ? entry.data : '');
    }
  }

  setLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

export const logger = new Logger(ENV.LOG_LEVEL as LogLevel);