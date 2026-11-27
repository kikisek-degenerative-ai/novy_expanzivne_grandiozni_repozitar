import { describe, expect, it } from 'vitest';
import { documents } from '../data/documents.ts';
import { FINAL_TURN } from './constants.ts';
import { advanceTurn, getDocumentIdFromOptionId } from './advance-turn.ts';
import { createInitialState } from './initial-state.ts';
import type { DecisionOption, EconomicIndicators, GameState, PoliticalIndicators } from './types.ts';

interface StateOverrides {
  readonly turn?: number;
  readonly economics?: Partial<EconomicIndicators>;
  readonly politics?: Partial<PoliticalIndicators>;
}

function makeState(overrides: StateOverrides = {}): GameState {
  const base = createInitialState();
  return {
    ...base,
    turn: overrides.turn ?? base.turn,
    economics: { ...base.economics, ...overrides.economics },
    politics: { ...base.politics, ...overrides.politics },
  };
}

function makeOption(effects: DecisionOption['effects'], id = 'test-doc.option'): DecisionOption {
  return { id, label: 'Test option', summary: 'Test option summary', effects };
}

function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

describe('createInitialState', () => {
  it('starts a running game on turn 1 with valid indicators', () => {
    const state = createInitialState();
    expect(state.turn).toBe(1);
    expect(state.status).toBe('playing');
    expect(state.endReason).toBeNull();
    expect(state.resolvedDocumentIds).toEqual([]);
    expect(state.economics.treasury).toBeGreaterThan(0);
    expect(state.politics.publicApproval).toBeGreaterThan(0);
  });
});

describe('advanceTurn – basics', () => {
  it('moves to the next turn while the game is running', () => {
    const { nextState } = advanceTurn(createInitialState(), []);
    expect(nextState.turn).toBe(2);
    expect(nextState.status).toBe('playing');
    expect(nextState.endReason).toBeNull();
  });

  it('does not mutate its inputs', () => {
    const state = deepFreeze(makeState());
    const decisions = deepFreeze([makeOption({ treasury: -5, publicApproval: 3 })]);
    expect(() => advanceTurn(state, decisions)).not.toThrow();
  });

  it('is deterministic', () => {
    const decisions = [makeOption({ inflation: 2, unemployment: -1 })];
    const first = advanceTurn(createInitialState(), decisions);
    const second = advanceTurn(createInitialState(), decisions);
    expect(second).toEqual(first);
  });

  it('applies the effects of chosen decisions to the indicators', () => {
    const state = makeState();
    const withoutDecision = advanceTurn(state, []).nextState;
    const withDecision = advanceTurn(state, [makeOption({ treasury: 10 })]).nextState;
    expect(withDecision.economics.treasury - withoutDecision.economics.treasury).toBe(10);
  });

  it('sums the effects of several decisions', () => {
    const state = makeState();
    const withoutDecision = advanceTurn(state, []).nextState;
    const withDecisions = advanceTurn(state, [
      makeOption({ treasury: 10 }, 'a.one'),
      makeOption({ treasury: -4 }, 'b.two'),
    ]).nextState;
    expect(withDecisions.economics.treasury - withoutDecision.economics.treasury).toBe(6);
  });

  it('keeps bounded indicators inside their valid range', () => {
    const { nextState } = advanceTurn(makeState(), [
      makeOption({ publicApproval: 1000, unemployment: -1000, inflation: -1000, bankStability: 1000 }),
    ]);
    expect(nextState.politics.publicApproval).toBeLessThanOrEqual(100);
    expect(nextState.economics.bankStability).toBeLessThanOrEqual(100);
    expect(nextState.economics.unemployment).toBeGreaterThanOrEqual(0);
    expect(nextState.economics.inflation).toBeGreaterThanOrEqual(0);
  });

  it('describes the turn in the summary', () => {
    const { summary } = advanceTurn(createInitialState(), [makeOption({ treasury: -10 })]);
    expect(summary).toContain('Čtvrtletí 1');
    expect(summary).toContain('pokladna');
  });

  it('lets the country decay when the player does nothing', () => {
    let state = createInitialState();
    while (state.status === 'playing') {
      state = advanceTurn(state, []).nextState;
    }
    expect(state.status).toBe('lost');
  });
});

describe('advanceTurn – resolved documents', () => {
  it('derives the document id from the option id', () => {
    expect(getDocumentIdFromOptionId('bread-subsidy.approve')).toBe('bread-subsidy');
    expect(getDocumentIdFromOptionId('plain')).toBe('plain');
  });

  it('records resolved documents once and keeps earlier ones', () => {
    const state: GameState = { ...createInitialState(), resolvedDocumentIds: ['old-doc'] };
    const { nextState } = advanceTurn(state, [
      makeOption({}, 'new-doc.a'),
      makeOption({}, 'new-doc.b'),
      makeOption({}, 'old-doc.c'),
    ]);
    expect(nextState.resolvedDocumentIds).toEqual(['old-doc', 'new-doc']);
  });
});

describe('advanceTurn – loss conditions', () => {
  it('loses by bankruptcy when the treasury goes negative', () => {
    const { nextState } = advanceTurn(makeState({ economics: { treasury: 5 } }), [
      makeOption({ treasury: -100 }),
    ]);
    expect(nextState.status).toBe('lost');
    expect(nextState.endReason).toContain('bankrot');
  });

  it('loses by hyperinflation', () => {
    const { nextState } = advanceTurn(makeState({ economics: { inflation: 49 } }), [
      makeOption({ inflation: 10 }),
    ]);
    expect(nextState.status).toBe('lost');
    expect(nextState.endReason).toContain('Hyperinflace');
  });

  it('loses by a bank run', () => {
    const { nextState } = advanceTurn(makeState({ economics: { bankStability: 12 } }), [
      makeOption({ bankStability: -5 }),
    ]);
    expect(nextState.status).toBe('lost');
    expect(nextState.endReason).toContain('Run na banky');
  });

  it('loses by a coup when loyalty collapses', () => {
    const { nextState } = advanceTurn(makeState({ politics: { factionLoyalty: 12 } }), [
      makeOption({ factionLoyalty: -5 }),
    ]);
    expect(nextState.status).toBe('lost');
    expect(nextState.endReason).toContain('Převrat');
  });

  it('loses by a popular uprising when approval collapses', () => {
    const { nextState } = advanceTurn(makeState({ politics: { publicApproval: 12 } }), [
      makeOption({ publicApproval: -5 }),
    ]);
    expect(nextState.status).toBe('lost');
    expect(nextState.endReason).toContain('povstání');
  });

  it('keeps the turn number when the game ends', () => {
    const { nextState } = advanceTurn(makeState({ turn: 4, economics: { treasury: 1 } }), [
      makeOption({ treasury: -50 }),
    ]);
    expect(nextState.status).toBe('lost');
    expect(nextState.turn).toBe(4);
  });

  it('includes the end reason in the summary', () => {
    const { nextState, summary } = advanceTurn(makeState({ economics: { treasury: 1 } }), [
      makeOption({ treasury: -50 }),
    ]);
    expect(summary).toContain(nextState.endReason ?? 'missing end reason');
  });
});

describe('advanceTurn – win condition', () => {
  const healthy = {
    economics: { treasury: 80, inflation: 5, unemployment: 10, bankStability: 80 },
    politics: { publicApproval: 70, factionLoyalty: 70 },
  };

  it('keeps playing before the final turn', () => {
    const { nextState } = advanceTurn(makeState({ ...healthy, turn: FINAL_TURN - 1 }), []);
    expect(nextState.status).toBe('playing');
    expect(nextState.turn).toBe(FINAL_TURN);
  });

  it('wins when the final turn is survived with a stable country', () => {
    const { nextState } = advanceTurn(makeState({ ...healthy, turn: FINAL_TURN }), []);
    expect(nextState.status).toBe('won');
    expect(nextState.endReason).not.toBeNull();
    expect(nextState.turn).toBe(FINAL_TURN);
  });

  it('loses at the final turn when the country is not stabilized', () => {
    const { nextState } = advanceTurn(
      makeState({
        ...healthy,
        politics: { publicApproval: 29, factionLoyalty: 70 },
        turn: FINAL_TURN,
      }),
      [],
    );
    expect(nextState.status).toBe('lost');
    expect(nextState.endReason).toContain('nepodařilo stabilizovat');
  });
});

describe('advanceTurn – finished game', () => {
  it('returns the finished state unchanged', () => {
    const finished: GameState = { ...createInitialState(), status: 'lost', endReason: 'Státní bankrot' };
    const { nextState, summary } = advanceTurn(finished, [makeOption({ treasury: 50 })]);
    expect(nextState).toBe(finished);
    expect(summary).toContain('skončila');
  });
});

describe('game balance', () => {
  /** Simple bot: each turn resolves `perTurn` documents, choosing the option combination that keeps the weakest indicator highest. */
  function playGreedy(perTurn: number): GameState {
    const weakestIndicator = (state: GameState): number => {
      const { economics: e, politics: p } = state;
      return Math.min(Math.min(e.treasury, 60) / 0.6, p.publicApproval, p.factionLoyalty, e.bankStability, 100 - e.inflation * 2);
    };
    let state = createInitialState();
    while (state.status === 'playing') {
      const turnDocuments = Array.from(
        { length: perTurn },
        (_, i) => documents[(perTurn * (state.turn - 1) + i) % documents.length],
      );
      let best: readonly DecisionOption[] = [];
      let bestScore = -Infinity;
      const search = (index: number, chosen: readonly DecisionOption[]): void => {
        if (index === turnDocuments.length) {
          const next = advanceTurn(state, chosen).nextState;
          const score = next.status === 'lost' ? -1e6 : weakestIndicator(next);
          if (score > bestScore) {
            bestScore = score;
            best = chosen;
          }
          return;
        }
        for (const option of turnDocuments[index].options) {
          search(index + 1, [...chosen, option]);
        }
      };
      search(0, []);
      state = advanceTurn(state, best).nextState;
    }
    return state;
  }

  it('is winnable when the player resolves three documents per turn', () => {
    const finalState = playGreedy(3);
    expect(finalState.status).toBe('won');
    expect(finalState.turn).toBe(FINAL_TURN);
  });

  it('is not won by ignoring the documents', () => {
    let state = createInitialState();
    while (state.status === 'playing') {
      state = advanceTurn(state, []).nextState;
    }
    expect(state.status).not.toBe('won');
  });
});
