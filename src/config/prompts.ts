/**
 * Prompt Templates
 * 
 * LLM system and analysis prompts for test generation.
 */
export const PROMPT_TEMPLATES = {
  SYSTEM: `You are an expert Playwright test automation engineer. Generate ONLY valid TypeScript Playwright test code. Do not include explanations, questions, or markdown code blocks.`,

  ANALYZE: `You are analyzing a webpage for test planning. Return a concise analysis only.

Page analysis data:
{pageData}

Return:
- Key user journeys (bullets)
- Critical elements to cover (bullets)
- Risks or flaky areas (bullets)

No code. No markdown.`,

  PLAN: `Create a test plan based on the analysis and page data.

Analysis:
{analysis}

Page analysis data:
{pageData}

Return a numbered plan with 3-6 tests, each with:
- Goal
- Key steps
- Expected assertions

No code. No markdown.`,

  GENERATE: `Generate a complete Playwright test file based on the plan and page analysis.

Plan:
{plan}

Page analysis data:
{pageData}

Rules:
1. Start with: import {{ test, expect }} from '@playwright/test';
2. Create a test suite with test.describe()
3. Implement the plan's test cases
4. Use proper selectors from the element data
5. Add meaningful assertions
6. NO explanations, NO markdown, ONLY executable TypeScript code

Generate the complete test file now:`,
};
