/**
 * Jira Config Loader
 * 
 * Reads Jira credentials from a separate JSON file.
 */
import * as fs from 'fs';
import * as path from 'path';

export type JiraRawConfig = Partial<{
  JIRA_BASE_URL: string;
  JIRA_EMAIL: string;
  JIRA_API_TOKEN: string;
}>;

function resolveJiraConfigPath(): string | undefined {
  const fromEnv = process.env.PLAYWRIGHT_AGENT_JIRA_CONFIG;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;

  const candidates = [
    path.join(process.cwd(), 'jira.config.json'),
    path.join(process.cwd(), 'config', 'jira.config.json'),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  return undefined;
}

export function loadJiraConfig(): JiraRawConfig | undefined {
  const configPath = resolveJiraConfigPath();
  if (!configPath) return undefined;

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw) as JiraRawConfig;
    return parsed || undefined;
  } catch {
    return undefined;
  }
}
