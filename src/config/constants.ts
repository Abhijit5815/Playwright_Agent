// Configuration and constants for the application
import { LLMConfig } from '../types'

export const ENV = {
  OLLAMA_BASE_URL: process.env.PLAYWRIGHT_AGENT_OLLAMA_URL || 'http://localhost:11434',
  LLM_MODEL: process.env.PLAYWRIGHT_AGENT_LLM_MODEL || 'llama3.2:3b',
  LOG_LEVEL: process.env.PLAYWRIGHT_AGENT_LOG_LEVEL || 'info',
  TIMEOUT: parseInt(process.env.PLAYWRIGHT_AGENT_TIMEOUT || '30000'),
  MAX_RETRIES: parseInt(process.env.PLAYWRIGHT_AGENT_MAX_RETRIES || '3'),
  ALLOWED_DOMAINS: (process.env.PLAYWRIGHT_AGENT_DOMAINS || 'localhost,example.com').split(','),
};

export const LLM_CONFIG: LLMConfig = {
  model: ENV.LLM_MODEL,
  baseUrl: ENV.OLLAMA_BASE_URL,  // Full URL: http://localhost:11434
  temperature: 0.7,
  maxTokens: 4096,
};

export const PLAYWRIGHT_CONFIG = {
  headless: true,
  timeout: ENV.TIMEOUT,
  navigationTimeout: ENV.TIMEOUT,
};

/*export const PROMPT_TEMPLATES = {
  SYSTEM: `You are an expert test automation engineer specializing in Playwright.
Your task is to generate comprehensive test cases based on page analysis.
Generate valid TypeScript code with proper typing.
Include Page Object Model pattern.
Make tests maintainable and scalable.`,

  ANALYSIS: `Based on this page analysis, generate a Playwright test file.
Include:
1. Page Object Model class
2. Test suite with multiple test cases
3. Proper assertions and error handling
4. Comments explaining complex logic

Page Data: {pageData}`,
};
*/
export const PROMPT_TEMPLATES = {
  SYSTEM: `You are an expert Playwright test automation engineer. Generate ONLY valid TypeScript Playwright test code. Do not include explanations, questions, or markdown code blocks.`,

  ANALYSIS: `Generate a complete Playwright test file for this page analysis:

{pageData}

Rules:
1. Start with: import {{ test, expect }} from '@playwright/test';
2. Create a test suite with test.describe()
3. Include at least 3 test cases for main interactions
4. Use proper selectors from the element data
5. Add meaningful assertions
6. NO explanations, NO markdown, ONLY executable TypeScript code

Generate the complete test file now:`,
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