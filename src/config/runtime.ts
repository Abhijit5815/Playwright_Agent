/**
 * Runtime Configuration
 * 
 * Merges config from agent.config.json with hard defaults.
 * Exports ENV, LLM_CONFIG, and runtime settings used throughout the agent.
 */
import { LLMConfig } from '../types';
import { loadConfig } from './loader';
import { loadJiraConfig } from './jiraLoader';

const fileCfg = loadConfig();
const jiraCfg = loadJiraConfig();

export const ENV = {
  OLLAMA_BASE_URL: fileCfg.OLLAMA_BASE_URL!,
  LLM_MODEL: fileCfg.LLM_MODEL!,
  LOG_LEVEL: fileCfg.LOG_LEVEL!,
  TIMEOUT: fileCfg.TIMEOUT!,
  MAX_RETRIES: fileCfg.MAX_RETRIES!,
  ALLOWED_DOMAINS: Array.isArray(fileCfg.ALLOWED_DOMAINS) ? fileCfg.ALLOWED_DOMAINS : (fileCfg.ALLOWED_DOMAINS as string).split(','),
};

export const LLM_CONFIG: LLMConfig = {
  model: ENV.LLM_MODEL,
  baseUrl: ENV.OLLAMA_BASE_URL,
  temperature: typeof fileCfg.LLM_TEMPERATURE === 'number' ? fileCfg.LLM_TEMPERATURE : 0.7,
  maxTokens: typeof fileCfg.LLM_MAX_TOKENS === 'number' ? fileCfg.LLM_MAX_TOKENS : 4096,
};

export const JIRA_CONFIG = jiraCfg && jiraCfg.JIRA_BASE_URL && jiraCfg.JIRA_EMAIL && jiraCfg.JIRA_API_TOKEN
  ? {
      baseUrl: jiraCfg.JIRA_BASE_URL,
      email: jiraCfg.JIRA_EMAIL,
      apiToken: jiraCfg.JIRA_API_TOKEN,
    }
  : undefined;

export const PLAYWRIGHT_CONFIG = {
  headless: true,
  timeout: ENV.TIMEOUT,
  navigationTimeout: ENV.TIMEOUT,
};

export const RETRY_CONFIG = {
  maxAttempts: ENV.MAX_RETRIES,
  delayMs: 1000,
  backoffMultiplier: 2,
};

export const VALIDATION = {
  MIN_URL_LENGTH: 10,
  MAX_URL_LENGTH: 2048,
  ALLOWED_PROTOCOLS: ['http', 'https'],
  URL_REGEX: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)$/,
};
