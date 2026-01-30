/**
 * PlaywrightAgent
 * 
 * Orchestrator for the test generation pipeline.
 * Delegates to PageAnalyzer, LlmClient, AgentGuardrails, and maintains state.
 */
import { logger } from '../utils/logger';
import { PROMPT_TEMPLATES, JIRA_CONFIG } from '../config';
import { PageAnalysis, AgentState, JiraIssue } from '../types';
import { PageAnalyzer } from '../services/pageAnalyzer';
import { LlmClient } from '../services/llmClient';
import { AgentGuardrails } from '../validators/agentGuardrails';
import { JiraClient } from '../services/jiraClient';

export class PlaywrightAgent {
  private state: AgentState = {};
  private guardrails = new AgentGuardrails();
  private analyzer = new PageAnalyzer();
  private llmClient = new LlmClient();
  private jiraClient?: JiraClient;

  constructor() {
    if (JIRA_CONFIG) {
      this.jiraClient = new JiraClient(JIRA_CONFIG);
    }
    logger.info('PlaywrightAgent initialized');
  }

  async analyzePage(url: string): Promise<PageAnalysis> {
    const analysis = await this.analyzer.analyze(url);
    this.state.pageAnalysis = analysis;
    return analysis;
  }

  async generateTest(pageAnalysis: PageAnalysis, jiraIssue?: JiraIssue): Promise<string> {
    logger.info('Generating test code using multi-step LLM chain');

    const pageDataStr = JSON.stringify(pageAnalysis, null, 2);
    const jiraDataStr = jiraIssue ? JSON.stringify(jiraIssue, null, 2) : 'None';

    const analysisPrompt = `${PROMPT_TEMPLATES.SYSTEM}\n\n${PROMPT_TEMPLATES.ANALYZE
      .replace('{pageData}', pageDataStr)
      .replace('{jiraData}', jiraDataStr)}`;
    const analysisSummary = await this.llmClient.generate(analysisPrompt);
    this.state.analysisSummary = analysisSummary;

    const planPrompt = `${PROMPT_TEMPLATES.SYSTEM}\n\n${PROMPT_TEMPLATES.PLAN
      .replace('{analysis}', analysisSummary)
      .replace('{pageData}', pageDataStr)
      .replace('{jiraData}', jiraDataStr)}`;
    const testPlan = await this.llmClient.generate(planPrompt);
    this.state.testPlan = testPlan;

    const generatePrompt = `${PROMPT_TEMPLATES.SYSTEM}\n\n${PROMPT_TEMPLATES.GENERATE
      .replace('{plan}', testPlan)
      .replace('{pageData}', pageDataStr)
      .replace('{jiraData}', jiraDataStr)}`;

    const testCode = await this.llmClient.generate(generatePrompt);
    this.guardrails.enforceOrThrow(testCode);
    this.state.testCode = testCode;

    logger.info('Test code generated successfully');
    return testCode;
  }

  async run(url: string, jiraKey?: string): Promise<string> {
    try {
      const jiraIssue = await this.fetchJiraIssue(jiraKey);
      if (jiraIssue) this.state.jiraIssue = jiraIssue;
      const analysis = await this.analyzePage(url);
      const testCode = await this.generateTest(analysis, jiraIssue);
      return testCode;
    } catch (error) {
      logger.error('Agent run failed', error);
      throw error;
    }
  }

  private async fetchJiraIssue(jiraKey?: string): Promise<JiraIssue | undefined> {
    if (!jiraKey) return undefined;
    if (!this.jiraClient) {
      throw new Error('Jira config not found. Add jira.config.json to enable Jira enrichment.');
    }
    return this.jiraClient.getIssue(jiraKey);
  }

  getState(): AgentState {
    return this.state;
  }
}
