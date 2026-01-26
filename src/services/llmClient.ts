/**
 * LLM Client
 * 
 * Thin wrapper around Ollama API for test code generation.
 * Encapsulates HTTP communication and error handling.
 */
import axios from 'axios';
import { logger } from '../utils/logger';
import { LLM_CONFIG, ENV } from '../config';

export class LlmClient {
  async generate(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${ENV.OLLAMA_BASE_URL}/api/generate`, {
        model: LLM_CONFIG.model,
        prompt,
        stream: false,
      });

      return response.data.response;
    } catch (error) {
      logger.error('LLM generation failed', error);
      throw new Error(`LLM generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
