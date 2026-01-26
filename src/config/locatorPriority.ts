/**\n * Locator Priority & Selector Heuristics\n * \n * Defines locator strategy ordering and patterns for detecting unstable selectors.\n */

export interface LocatorPriorityRule {
  name: string;
  description: string;
  weight: number; // higher number = higher preference
}

// Ordered preference for selector strategies. Higher weight = higher priority.
export const LOCATOR_PRIORITY: LocatorPriorityRule[] = [
  { name: 'data-testid', description: 'Prefer data-testid/data-test attributes for stability', weight: 100 },
  { name: 'role+name', description: 'Use getByRole with accessible name when available', weight: 90 },
  { name: 'label', description: 'Use getByLabel for labeled form controls', weight: 80 },
  { name: 'placeholder', description: 'Use getByPlaceholder for inputs/textareas', weight: 70 },
  { name: 'text', description: 'Use getByText for static, unique text nodes', weight: 60 },
  { name: 'css-id-class', description: 'Use simple CSS ids/classes without nth-child', weight: 50 },
  { name: 'css-structure', description: 'Only use structural CSS selectors when stable', weight: 30 },
  { name: 'xpath', description: 'XPath is a last resort when no stable CSS or role selector exists', weight: 0 },
];

// Heuristics for flagging fragile selectors emitted by the LLM.
export const UNSTABLE_SELECTOR_PATTERNS = {
  xpath: /^\s*(xpath=|\/\/|\.\/\/)/i,
  nthChild: /nth-child\s*\(/i,
  numericNth: /:nth-of-type\s*\(/i,
  chainedIds: /#[^\s>]+#[^\s>]+/,
  textSearch: /text\s*=\s*['"]/i,
};
