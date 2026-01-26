/**
 * Test Writer
 * 
 * Persists generated test code to disk with organized directory structure.
 * Creates site-specific subdirectories and timestamped file names.
 */
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

export interface WriteResult {
  filepath: string;
  lines: number;
}

export class TestWriter {
  write(url: string, code: string): WriteResult {
    const cleanCode = this.stripCodeFences(code.trim());

    const testsDir = path.join(process.cwd(), 'tests');
    if (!fs.existsSync(testsDir)) {
      fs.mkdirSync(testsDir, { recursive: true });
      logger.info('Created tests/ directory');
    }

    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '').replace(/\./g, '-');
    const siteDir = path.join(testsDir, hostname);
    if (!fs.existsSync(siteDir)) {
      fs.mkdirSync(siteDir, { recursive: true });
      logger.info(`Created tests/${hostname}/ directory`);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T');
    const dateStr = timestamp[0];
    const timeStr = timestamp[1].split('-')[0];
    const filename = `${hostname}-${dateStr}-${timeStr}.spec.ts`;
    const filepath = path.join(siteDir, filename);

    fs.writeFileSync(filepath, cleanCode, 'utf-8');

    return { filepath, lines: cleanCode.split('\n').length };
  }

  private stripCodeFences(code: string): string {
    let cleaned = code;
    if (cleaned.startsWith('```typescript') || cleaned.startsWith('```ts') || cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(typescript|ts)?\n?/g, '');
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/```$/g, '');
    }
    return cleaned.trim();
  }
}
