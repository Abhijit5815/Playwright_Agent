/**
 * Prompt Templates
 * 
 * LLM system and analysis prompts for test generation.
 */
export const PROMPT_TEMPLATES = {
  SYSTEM: `You are an expert Playwright test automation engineer. Generate ONLY valid TypeScript Playwright test code. Do not include explanations, questions, or markdown code blocks.`,

  ANALYSIS: `Generate a complete Playwright test file for this page analysis:

{pageData}

Rules:
1. Start with: import {{ test, expect }} from '@playwright/test';
2. Create a test suite with test.describe()
3. Include at least 3 test cases for main interactions
4. Use proper selectors from the element data
5. Add meaningful assertions
6. NO explanations, NO markdown, ONLY executable TypeScript code

Generate the complete test file now:`,
};
