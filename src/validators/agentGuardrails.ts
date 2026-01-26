/**
 * Agent Guardrails Engine
 * 
 * Validates generated Playwright code before persistence.
 * Enforces: TypeScript syntax, Playwright API safety, selector stability heuristics.
 */
import ts from 'typescript';
import { logger } from '../utils/logger';
import { LOCATOR_PRIORITY, UNSTABLE_SELECTOR_PATTERNS, GuardrailIssue } from '../config';

/**
 * AgentGuardrails validates generated Playwright code before it is persisted.
 * Concerns addressed:
 * 1) TypeScript syntax safety
 * 2) Unsupported Playwright Locator APIs
 * 3) Selector stability heuristics
 */
export class AgentGuardrails {
  validate(code: string): GuardrailIssue[] {
    const issues: GuardrailIssue[] = [];
    issues.push(...this.checkSyntax(code));
    issues.push(...this.checkUnsupportedLocatorApis(code));
    issues.push(...this.checkSelectorStability(code));
    return issues;
  }

  enforceOrThrow(code: string): GuardrailIssue[] {
    const issues = this.validate(code);
    const errors = issues.filter((issue) => issue.severity === 'error');

    if (errors.length > 0) {
      const summary = errors
        .map((issue) => `- ${issue.message}${issue.line ? ` (line ${issue.line})` : ''}${issue.hint ? ` | ${issue.hint}` : ''}`)
        .join('\n');

      logger.error(`Guardrails blocked generated test code:\n${summary}`);
      throw new Error(`Guardrails blocked generated test code:\n${summary}`);
    }

    issues
      .filter((issue) => issue.severity === 'warning')
      .forEach((issue) =>
        logger.warn(`Guardrail warning: ${issue.message}${issue.line ? ` (line ${issue.line})` : ''}${issue.hint ? ` | ${issue.hint}` : ''}`),
      );

    return issues;
  }

  private checkSyntax(code: string): GuardrailIssue[] {
    const diagnostics = ts.transpileModule(code, {
      reportDiagnostics: true,
      fileName: 'generated.spec.ts',
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2020,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        jsx: ts.JsxEmit.Preserve,
      },
    }).diagnostics;

    if (!diagnostics || diagnostics.length === 0) return [];

    return diagnostics.map((diag) => {
      const message = ts.flattenDiagnosticMessageText(diag.messageText, ' ');
      const position = diag.file?.getLineAndCharacterOfPosition(diag.start ?? 0);

      return {
        severity: diag.category === ts.DiagnosticCategory.Error ? 'error' : 'warning',
        message,
        line: position ? position.line + 1 : undefined,
      } satisfies GuardrailIssue;
    });
  }

  private checkUnsupportedLocatorApis(code: string): GuardrailIssue[] {
    const issues: GuardrailIssue[] = [];
    const lines = code.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (line.includes('.firstChild(')) {
        issues.push({
          severity: 'error',
          message: "Locator does not expose firstChild(); use locator.first() or locator.locator(':scope > *').first().",
          line: index + 1,
        });
      }

      if (line.match(/\.text\s*\(/)) {
        issues.push({
          severity: 'error',
          message: "Locator does not expose text(); use textContent() or innerText().",
          line: index + 1,
        });
      }
    });

    return issues;
  }

  private checkSelectorStability(code: string): GuardrailIssue[] {
    const issues: GuardrailIssue[] = [];
    const locatorCall = /locator\(([^)]+)\)/gi;
    const lines = code.split(/\r?\n/);

    lines.forEach((line, index) => {
      const matches = [...line.matchAll(locatorCall)];
      for (const match of matches) {
        const rawSelector = match[1].trim();
        const selector = rawSelector.replace(/^['"`]/, '').replace(/['"`]$/, '');

        if (UNSTABLE_SELECTOR_PATTERNS.xpath.test(selector)) {
          issues.push({
            severity: 'warning',
            message: 'XPath detected; prefer testId/role/label/text selectors before XPath.',
            line: index + 1,
            hint: this.describeLocatorPriority(),
          });
        }

        if (UNSTABLE_SELECTOR_PATTERNS.nthChild.test(selector) || UNSTABLE_SELECTOR_PATTERNS.numericNth.test(selector)) {
          issues.push({
            severity: 'warning',
            message: 'nth-child/nth-of-type detected; ensure the structure is stable or replace with a semantic selector.',
            line: index + 1,
            hint: this.describeLocatorPriority(),
          });
        }
      }
    });

    return issues;
  }

  private describeLocatorPriority(): string {
    const ordered = [...LOCATOR_PRIORITY].sort((a, b) => b.weight - a.weight);
    return ordered.map((rule) => `${rule.name}`).join(' > ');
  }
}
