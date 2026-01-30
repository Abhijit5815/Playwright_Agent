/**
 * Agent Runner (CLI Entry Point)
 * 
 * Main entry for npm run dev.
 * Orchestrates agent pipeline: URL → analyze → generate → validate → write → report.
 */
import { PlaywrightAgent } from './core/agent';
import { logger } from './utils/logger';
import { ENV, LLM_CONFIG } from './config';
import { TestWriter } from './services/testWriter';

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((arg) => !arg.startsWith('--'));
  const jiraArg = args.find((arg) => arg.startsWith('--jira='))?.split('=')[1];
  const jiraFlagIndex = args.findIndex((arg) => arg === '--jira');
  const jiraKey = jiraArg || (jiraFlagIndex >= 0 ? args[jiraFlagIndex + 1] : undefined);

  if (!url) {
    console.error('Usage: npm run dev -- <url> [--jira <ISSUE_KEY>]');
    process.exit(1);
  }

  logger.info('Starting Playwright Agentic AI Agent');
  logger.info(`Target URL: ${url}`);
  logger.info(`LLM Model: ${LLM_CONFIG.model}`);
  logger.info(`Ollama URL: ${LLM_CONFIG.baseUrl}`);

  const agent = new PlaywrightAgent();
  const writer = new TestWriter();

  try {
    const testCode = await agent.run(url, jiraKey);
    const { filepath, lines } = writer.write(url, testCode);

    console.log('\n=== ✅ TEST FILE GENERATED ===\n');
    console.log(`📁 Location: ${filepath}`);
    console.log(`📝 Lines: ${lines}`);
    console.log('\n=== NEXT STEPS ===');
    console.log(`1. Review: cat ${filepath}`);
    console.log(`2. Run: npx playwright test ${filepath}`);
    console.log(`3. Debug: npx playwright test ${filepath} --headed --debug\n`);

  } catch (error) {
    logger.error('Agent failed:', error);
    process.exit(1);
  }
}

main();
