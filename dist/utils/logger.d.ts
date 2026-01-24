type LogLevel = 'debug' | 'info' | 'warn' | 'error';
declare class Logger {
    private logLevel;
    private levels;
    constructor(level?: LogLevel);
    private shouldLog;
    private formatEntry;
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, error?: unknown): void;
    setLevel(level: LogLevel): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map