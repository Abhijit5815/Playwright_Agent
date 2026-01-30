/**
 * Domain Types
 * 
 * Core TypeScript interfaces and types for page analysis, state management, and configuration.
 */
export interface PageAnalysis {
  title: string;
  url: string;
  elements: PageElement[];
  screenshots?: {
    full: string;
    elements: Record<string, string>;
  };
  metadata: {
    timestamp: Date;
    userAgent: string;
  };
}

export interface PageElement {
  id: string;
  type: "button" | "input" | "link" | "form" | "text" | "image" | "other";
  text: string;
  selector: string;
  ariaLabel?: string;
  placeholder?: string;
  value?: string;
}

export interface TestGenerationOptions {
  url: string;
  outputDir: string;
  usePageObjects: boolean;
  includeForms: boolean;
  includeNavigations: boolean;
}

export interface AgentState {
  pageAnalysis?: PageAnalysis;
  analysisSummary?: string;
  testPlan?: string;
  testCode?: string;
  errors?: string[];
}

export interface LLMConfig {
  model: string;
  baseUrl: string;
  temperature: number;
  maxTokens: number;
}

export interface ToolInput {
  url: string;
  timeout?: number;
}

export interface ToolOutput {
  success: boolean;
  data?: unknown;
  error?: string;
}