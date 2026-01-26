/**
 * Page Analyzer
 * 
 * Extracts interactive elements from web pages using Playwright.
 * Detects element type (button, input, link, form) and attributes.
 */
import { chromium, Page, Browser } from '@playwright/test';
import { logger } from '../utils/logger';
import { PLAYWRIGHT_CONFIG } from '../config';
import { PageAnalysis, PageElement } from '../types';

export class PageAnalyzer {
  async analyze(url: string): Promise<PageAnalysis> {
    logger.info(`Starting page analysis for: ${url}`);

    const browser: Browser = await chromium.launch({ headless: PLAYWRIGHT_CONFIG.headless });
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: PLAYWRIGHT_CONFIG.timeout });
      const analysis = await this.extractPageElements(page, url);
      logger.info(`Page analysis complete. Found ${analysis.elements.length} elements`);
      return analysis;
    } finally {
      await browser.close();
    }
  }

  private async extractPageElements(page: Page, url: string): Promise<PageAnalysis> {
    const elements = await page.locator('button, input, a[href], form, [role="button"]').all();
    const pageElements: PageElement[] = [];

    for (const element of elements) {
      try {
        const text = (await element.textContent()) || '';
        const selector = await element.locator('..').evaluate((el: HTMLElement) => {
          return el.getAttribute('id') || el.className || 'element';
        });

        pageElements.push({
          id: `elem_${pageElements.length}`,
          type: await this.detectElementType(element),
          text: text.trim(),
          selector: selector,
          ariaLabel: (await element.getAttribute('aria-label')) || undefined,
          placeholder: (await element.getAttribute('placeholder')) || undefined,
        });
      } catch (e) {
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

  private async detectElementType(element: any): Promise<PageElement['type']> {
    const tagName = await element.evaluate((el: HTMLElement) => el.tagName.toLowerCase());

    switch (tagName) {
      case 'button':
        return 'button';
      case 'input':
        return 'input';
      case 'a':
        return 'link';
      case 'form':
        return 'form';
      default:
        return 'other';
    }
  }
}
