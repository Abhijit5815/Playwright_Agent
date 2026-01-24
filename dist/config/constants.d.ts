import { LLMConfig } from '../types';
export declare const ENV: {
    OLLAMA_BASE_URL: string;
    LLM_MODEL: string;
    LOG_LEVEL: string;
    TIMEOUT: number;
    MAX_RETRIES: number;
    ALLOWED_DOMAINS: string[];
};
export declare const LLM_CONFIG: LLMConfig;
export declare const PLAYWRIGHT_CONFIG: {
    headless: boolean;
    timeout: number;
    navigationTimeout: number;
};
export declare const PROMPT_TEMPLATES: {
    SYSTEM: string;
    ANALYSIS: string;
};
export declare const RETRY_CONFIG: {
    maxAttempts: number;
    delayMs: number;
    backoffMultiplier: number;
};
export declare const VALIDATION: {
    MIN_URL_LENGTH: number;
    MAX_URL_LENGTH: number;
    ALLOWED_PROTOCOLS: string[];
    URL_REGEX: RegExp;
};
//# sourceMappingURL=constants.d.ts.map