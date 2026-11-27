import type { GameState } from './types.ts';

/** Creates the starting state of a new game: a country in ruins right after the revolution. */
export function createInitialState(): GameState {
  return {
    turn: 1,
    economics: {
      treasury: 100,
      inflation: 12,
      unemployment: 18,
      bankStability: 55,
    },
    politics: {
      publicApproval: 50,
      factionLoyalty: 55,
    },
    status: 'playing',
    endReason: null,
    resolvedDocumentIds: [],
  };
}
