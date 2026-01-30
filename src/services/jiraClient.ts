/**
 * Jira Client
 * 
 * Fetches Jira issue data to enrich test generation prompts.
 */
import { logger } from '../utils/logger';

export interface JiraIssueData {
  key: string;
  summary: string;
  description?: string;
  issueType?: string;
  status?: string;
  priority?: string;
  labels?: string[];
}

export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}

export class JiraClient {
  private config: JiraConfig;

  constructor(config: JiraConfig) {
    this.config = config;
  }

  async getIssue(issueKey: string): Promise<JiraIssueData> {
    const url = `${this.config.baseUrl.replace(/\/$/, '')}/rest/api/3/issue/${issueKey}`;
    const auth = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString('base64');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error('Jira issue fetch failed', { status: response.status, text });
      throw new Error(`Jira issue fetch failed (${response.status})`);
    }

    const data = (await response.json()) as any;
    const fields = data?.fields ?? {};

    return {
      key: data?.key ?? issueKey,
      summary: fields?.summary ?? '',
      description: this.flattenDescription(fields?.description),
      issueType: fields?.issuetype?.name,
      status: fields?.status?.name,
      priority: fields?.priority?.name,
      labels: Array.isArray(fields?.labels) ? fields.labels : [],
    };
  }

  private flattenDescription(description: any): string | undefined {
    if (!description) return undefined;
    if (typeof description === 'string') return description;

    const parts: string[] = [];
    const walk = (node: any) => {
      if (!node) return;
      if (typeof node === 'string') {
        parts.push(node);
        return;
      }
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (node.text) parts.push(node.text);
      if (node.content) walk(node.content);
    };

    walk(description);
    const text = parts.join(' ').replace(/\s+/g, ' ').trim();
    return text || undefined;
  }
}
