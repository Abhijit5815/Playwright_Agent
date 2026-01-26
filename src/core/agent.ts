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
    logger.info('Generating test code using LLM');

    const pageDataStr = JSON.stringify(pageAnalysis, null, 2);
    const fullPrompt = `${PROMPT_TEMPLATES.SYSTEM}\n\n${PROMPT_TEMPLATES.ANALYSIS.replace('{pageData}', pageDataStr)}`;

    const testCode = await this.llmClient.generate(fullPrompt);
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
