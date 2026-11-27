import { describe, expect, it } from 'vitest';
import { documents, getDocumentById } from '../data/documents.ts';
import { getDocumentIdFromOptionId } from './advance-turn.ts';

const INDICATOR_KEYS = [
  'treasury',
  'inflation',
  'unemployment',
  'bankStability',
  'publicApproval',
  'factionLoyalty',
];

describe('sample policy documents', () => {
  it('contains between 5 and 8 documents', () => {
    expect(documents.length).toBeGreaterThanOrEqual(5);
    expect(documents.length).toBeLessThanOrEqual(8);
  });

  it('uses unique kebab-case document ids without dots', () => {
    const ids = documents.map((document) => document.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('has complete texts and at least two options per document', () => {
    for (const document of documents) {
      expect(document.title.length).toBeGreaterThan(0);
      expect(document.sender.length).toBeGreaterThan(0);
      expect(document.description.length).toBeGreaterThan(0);
      expect(document.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('uses unique option ids prefixed with the document id', () => {
    const optionIds = documents.flatMap((document) => document.options.map((option) => option.id));
    expect(new Set(optionIds).size).toBe(optionIds.length);
    for (const document of documents) {
      for (const option of document.options) {
        expect(getDocumentIdFromOptionId(option.id)).toBe(document.id);
        expect(option.label.length).toBeGreaterThan(0);
        expect(option.summary.length).toBeGreaterThan(0);
      }
    }
  });

  it('only uses known indicators with finite, moderate effects', () => {
    for (const document of documents) {
      for (const option of document.options) {
        for (const [key, value] of Object.entries(option.effects)) {
          expect(INDICATOR_KEYS).toContain(key);
          expect(Number.isFinite(value)).toBe(true);
          expect(Math.abs(value)).toBeLessThanOrEqual(30);
        }
      }
    }
  });

  it('finds documents by id', () => {
    expect(getDocumentById('bread-subsidy')?.id).toBe('bread-subsidy');
    expect(getDocumentById('does-not-exist')).toBeUndefined();
  });
});
