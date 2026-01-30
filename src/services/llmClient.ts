/**
 * LLM Client
 * 
 * LangChain-powered wrapper around Ollama for test generation.
 * Builds a simple prompt -> model chain and handles errors.
 */
import { PromptTemplate } from '@langchain/core/prompts';
import { Ollama } from '@langchain/ollama';
import { logger } from '../utils/logger';
import { LLM_CONFIG, ENV } from '../config';

export class LlmClient {
  private model: Ollama;

  constructor() {
    this.model = new Ollama({
      model: LLM_CONFIG.model,
      baseUrl: ENV.OLLAMA_BASE_URL,
      temperature: LLM_CONFIG.temperature,
    });
  }

  async generate(prompt: string): Promise<string> {
    try {
      const promptTemplate = PromptTemplate.fromTemplate('{input}');
      const chain = promptTemplate.pipe(this.model);
      const response = await chain.invoke({ input: prompt });
      return response;
    } catch (error) {
      logger.error('LLM generation failed', error);
      throw new Error(`LLM generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
