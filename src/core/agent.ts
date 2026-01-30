/**
 * PlaywrightAgent
 * 
 * Orchestrator for the test generation pipeline.
 * Delegates to PageAnalyzer, LlmClient, AgentGuardrails, and maintains state.
 */
import { logger } from '../utils/logger';
import { PROMPT_TEMPLATES } from '../config';
import { PageAnalysis, AgentState } from '../types';
import { PageAnalyzer } from '../services/pageAnalyzer';
import { LlmClient } from '../services/llmClient';
import { AgentGuardrails } from '../validators/agentGuardrails';

export class PlaywrightAgent {
  private state: AgentState = {};
  private guardrails = new AgentGuardrails();
  private analyzer = new PageAnalyzer();
  private llmClient = new LlmClient();

  constructor() {
    logger.info('PlaywrightAgent initialized');
  }

  async analyzePage(url: string): Promise<PageAnalysis> {
    const analysis = await this.analyzer.analyze(url);
    this.state.pageAnalysis = analysis;
    return analysis;
  }

  async generateTest(pageAnalysis: PageAnalysis): Promise<string> {
    logger.info('Generating test code using multi-step LLM chain');

    const pageDataStr = JSON.stringify(pageAnalysis, null, 2);

    const analysisPrompt = `${PROMPT_TEMPLATES.SYSTEM}\n\n${PROMPT_TEMPLATES.ANALYZE.replace('{pageData}', pageDataStr)}`;
    const analysisSummary = await this.llmClient.generate(analysisPrompt);
    this.state.analysisSummary = analysisSummary;

    const planPrompt = `${PROMPT_TEMPLATES.SYSTEM}\n\n${PROMPT_TEMPLATES.PLAN
      .replace('{analysis}', analysisSummary)
      .replace('{pageData}', pageDataStr)}`;
    const testPlan = await this.llmClient.generate(planPrompt);
    this.state.testPlan = testPlan;

    const generatePrompt = `${PROMPT_TEMPLATES.SYSTEM}\n\n${PROMPT_TEMPLATES.GENERATE
      .replace('{plan}', testPlan)
      .replace('{pageData}', pageDataStr)}`;

    const testCode = await this.llmClient.generate(generatePrompt);
    this.guardrails.enforceOrThrow(testCode);
    this.state.testCode = testCode;

    logger.info('Test code generated successfully');
    return testCode;
  }

  async run(url: string): Promise<string> {
    try {
      const analysis = await this.analyzePage(url);
      const testCode = await this.generateTest(analysis);
      return testCode;
    } catch (error) {
      logger.error('Agent run failed', error);
      throw error;
    }
  }

  getState(): AgentState {
    return this.state;
  }
}
