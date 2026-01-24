// Structured logging utility
import { ENV } from '../config/constants';
class Logger {
    constructor(level = 'info') {
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
        };
        this.logLevel = level;
    }
    shouldLog(level) {
        return this.levels[level] >= this.levels[this.logLevel];
    }
    formatEntry(level, message, data) {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...(typeof data !== 'undefined' ? { data } : {}),
        };
    }
    debug(message, data) {
        if (this.shouldLog('debug')) {
            const entry = this.formatEntry('debug', message, data);
            console.log('[DEBUG]', entry.message, data ? entry.data : '');
        }
    }
    info(message, data) {
        if (this.shouldLog('info')) {
            const entry = this.formatEntry('info', message, data);
            console.log('[INFO]', entry.message, data ? entry.data : '');
        }
    }
    warn(message, data) {
        if (this.shouldLog('warn')) {
            const entry = this.formatEntry('warn', message, data);
            console.warn('[WARN]', entry.message, data ? entry.data : '');
        }
    }
    error(message, error) {
        if (this.shouldLog('error')) {
            const entry = this.formatEntry('error', message, error);
            console.error('[ERROR]', entry.message, error ? entry.data : '');
        }
    }
    setLevel(level) {
        this.logLevel = level;
    }
}
export const logger = new Logger(ENV.LOG_LEVEL);
//# sourceMappingURL=logger.js.map