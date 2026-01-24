import { PlaywrightAgent } from './core/agent';
import { logger } from './utils/logger';
import { ENV } from './config/constants';
async function main() {
    const url = process.argv[2];
    if (!url) {
        console.error('Usage: npm run dev -- <url>');
        process.exit(1);
    }
    try {
        logger.info(`Starting Playwright Agentic AI Agent`);
        logger.info(`Target URL: ${url}`);
        logger.info(`LLM Model: ${ENV.LLM_MODEL}`);
        logger.info(`Ollama URL: ${ENV.OLLAMA_BASE_URL}`);
        const agent = new PlaywrightAgent();
        const testCode = await agent.run(url);
        console.log('\n=== GENERATED TEST CODE ===\n');
        console.log(testCode);
        console.log('\n=== NEXT STEPS ===');
        console.log('1. Copy the code above');
        console.log('2. Create file: tests/generated.spec.ts');
        console.log('3. Run: npx playwright test tests/generated.spec.ts');
    }
    catch (error) {
        logger.error('Fatal error', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map