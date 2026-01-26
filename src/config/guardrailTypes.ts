/**
 * Guardrail Types
 * 
 * Core types for validation issues raised by AgentGuardrails.
 */

export type GuardrailSeverity = 'error' | 'warning';

export interface GuardrailIssue {
  severity: GuardrailSeverity;
  message: string;
  line?: number;
  hint?: string;
}
