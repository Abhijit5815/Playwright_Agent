/**
 * Config Loader
 * 
 * Reads and parses agent configuration from external JSON files.
 * Supports multiple file locations via environment variable or defaults.
 */
import * as fs from 'fs';
import * as path from 'path';

export type RawConfig = Partial<{
  OLLAMA_BASE_URL: string;
  LLM_MODEL: string;
  LOG_LEVEL: string;
  TIMEOUT: number;
  MAX_RETRIES: number;
  ALLOWED_DOMAINS: string[] | string;
  LLM_TEMPERATURE: number;
  LLM_MAX_TOKENS: number;
}>;

function resolveConfigPath(): string | undefined {
  const fromEnv = process.env.PLAYWRIGHT_AGENT_CONFIG;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;

  const candidates = [
    path.join(process.cwd(), 'agent.config.json'),
    path.join(process.cwd(), 'config', 'agent.config.json'),
    path.join(process.cwd(), 'playwright-agent.config.json'),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

export function loadConfig(): RawConfig {
  const configPath = resolveConfigPath();
  if (!configPath) return {};

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw) as RawConfig;
    return parsed || {};
  } catch (e) {
    // If parsing fails, return empty and let env/defaults take over
    return {};
  }
}
