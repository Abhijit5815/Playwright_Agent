import { PlaywrightAgent } from './core/agent';
import { logger } from './utils/logger';
import { ENV, LLM_CONFIG } from './config/constants';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error('Usage: npm run dev -- <url>');
    process.exit(1);
  }

  logger.info('Starting Playwright Agentic AI Agent');
  logger.info(`Target URL: ${url}`);
  logger.info(`LLM Model: ${LLM_CONFIG.model}`);
  logger.info(`Ollama URL: ${LLM_CONFIG.baseUrl}`);

  const agent = new PlaywrightAgent();

  try {
    const testCode = await agent.run(url);

    // Clean up code (remove markdown blocks if present)
    let cleanCode = testCode.trim();
    if (cleanCode.startsWith('```typescript') || cleanCode.startsWith('```ts') || cleanCode.startsWith('```')) {
      cleanCode = cleanCode.replace(/^```(typescript|ts)?\n?/g, '');
    }
    if (cleanCode.endsWith('```')) {
      cleanCode = cleanCode.replace(/```$/g, '');
    }
    cleanCode = cleanCode.trim();

    // Ensure tests/ directory exists (created only once)
    const testsDir = path.join(process.cwd(), 'tests');
    if (!fs.existsSync(testsDir)) {
      fs.mkdirSync(testsDir, { recursive: true });
      logger.info('Created tests/ directory');
    }

    // Extract hostname for subfolder
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '').replace(/\./g, '-');
    
    // Create site-specific subfolder
    const siteDir = path.join(testsDir, hostname);
    if (!fs.existsSync(siteDir)) {
      fs.mkdirSync(siteDir, { recursive: true });
      logger.info(`Created tests/${hostname}/ directory`);
    }

    // Generate unique filename with datetime
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T');
    const dateStr = timestamp[0]; // 2026-01-24
    const timeStr = timestamp[1].split('-')[0]; // 15-00-23
    const filename = `${hostname}-${dateStr}-${timeStr}.spec.ts`;
    const filepath = path.join(siteDir, filename);

    // Write to file
    fs.writeFileSync(filepath, cleanCode, 'utf-8');

    console.log('\n=== ✅ TEST FILE GENERATED ===\n');
    console.log(`📁 Location: tests/${hostname}/${filename}`);
    console.log(`📝 Lines: ${cleanCode.split('\n').length}`);
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
