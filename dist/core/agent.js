// Main agent for page analysis and test generation
import { chromium } from '@playwright/test';
import axios from 'axios';
import { logger } from '../utils/logger';
import { ENV, LLM_CONFIG, PLAYWRIGHT_CONFIG, PROMPT_TEMPLATES } from '../config/constants';
export class PlaywrightAgent {
    constructor() {
        this.state = {};
        logger.info('PlaywrightAgent initialized');
    }
    async analyzePage(url) {
        logger.info(`Starting page analysis for: ${url}`);
        const browser = await chromium.launch({ headless: PLAYWRIGHT_CONFIG.headless });
        const page = await browser.newPage();
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: PLAYWRIGHT_CONFIG.timeout });
            const analysis = await this.extractPageElements(page, url);
            this.state.pageAnalysis = analysis;
            logger.info(`Page analysis complete. Found ${analysis.elements.length} elements`);
            return analysis;
        }
        finally {
            await browser.close();
        }
    }
    async extractPageElements(page, url) {
        const elements = await page.locator('button, input, a[href], form, [role="button"]').all();
        const pageElements = [];
        for (const element of elements) {
            try {
                const text = await element.textContent() || '';
                const selector = await element.locator('..').evaluate((el) => {
                    return el.getAttribute('id') || el.className || 'element';
                });
                pageElements.push({
                    id: `elem_${pageElements.length}`,
                    type: await this.detectElementType(element),
                    text: text.trim(),
                    selector: selector,
                    ariaLabel: await element.getAttribute('aria-label') || undefined,
                    placeholder: await element.getAttribute('placeholder') || undefined,
                });
            }
            catch (e) {
                logger.warn('Failed to extract element', e);
            }
        }
        return {
            title: await page.title(),
            url,
            elements: pageElements,
            metadata: {
                timestamp: new Date(),
                userAgent: await page.evaluate(() => navigator.userAgent),
            },
        };
    }
    async detectElementType(element) {
        const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
        switch (tagName) {
            case 'button': return 'button';
            case 'input': return 'input';
            case 'a': return 'link';
            case 'form': return 'form';
            default: return 'other';
        }
    }
    async generateTest(pageAnalysis) {
        logger.info('Generating test code using LLM');
        const pageDataStr = JSON.stringify(pageAnalysis, null, 2);
        const fullPrompt = `${PROMPT_TEMPLATES.SYSTEM}\n\n${PROMPT_TEMPLATES.ANALYSIS.replace('{pageData}', pageDataStr)}`;
        try {
            const response = await axios.post(`${ENV.OLLAMA_BASE_URL}/api/generate`, {
                model: LLM_CONFIG.model,
                prompt: fullPrompt,
                stream: false,
            });
            const testCode = response.data.response;
            this.state.testCode = testCode;
            logger.info('Test code generated successfully');
            return testCode;
        }
        catch (error) {
            logger.error('Failed to generate test code', error);
            throw new Error(`Test generation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async run(url) {
        try {
            const analysis = await this.analyzePage(url);
            const testCode = await this.generateTest(analysis);
            return testCode;
        }
        catch (error) {
            logger.error('Agent run failed', error);
            throw error;
        }
    }
    getState() {
        return this.state;
    }
}
//# sourceMappingURL=agent.js.map