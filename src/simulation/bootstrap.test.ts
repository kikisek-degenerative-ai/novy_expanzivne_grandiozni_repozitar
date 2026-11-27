import { describe, expect, it } from 'vitest';
import { DATA_MODULE_READY } from '../data/documents.ts';

describe('project bootstrap', () => {
  it('loads data module placeholder', () => {
    expect(DATA_MODULE_READY).toBe(true);
  });
});
