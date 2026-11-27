/**
 * Shared simulation contract between the turn engine (Track A) and the UI (Track B).
 * Keep in sync with docs/TASKS.md. Any change must be logged in docs/PROGRESS.md.
 */

export type GameStatus = 'playing' | 'won' | 'lost';

export interface EconomicIndicators {
  readonly treasury: number; // State treasury / budget
  readonly inflation: number; // Inflation (%)
  readonly unemployment: number; // Unemployment (%)
  readonly bankStability: number; // Stability of banks and institutions (0–100)
}

export interface PoliticalIndicators {
  readonly publicApproval: number; // Public approval (0–100)
  readonly factionLoyalty: number; // Loyalty of the apparatus and the army (0–100)
}

export interface GameState {
  readonly turn: number; // Turn / quarter number (starts at 1)
  readonly economics: EconomicIndicators;
  readonly politics: PoliticalIndicators;
  readonly status: GameStatus;
  readonly endReason: string | null; // Concrete reason for the win or loss
  readonly resolvedDocumentIds: readonly string[];
}

export interface IndicatorDelta {
  readonly treasury?: number;
  readonly inflation?: number;
  readonly unemployment?: number;
  readonly bankStability?: number;
  readonly publicApproval?: number;
  readonly factionLoyalty?: number;
}

export interface DecisionOption {
  readonly id: string;
  readonly label: string;
  readonly summary: string;
  readonly effects: IndicatorDelta;
}

export interface PolicyDocument {
  readonly id: string;
  readonly title: string;
  readonly sender: string;
  readonly description: string;
  readonly options: readonly DecisionOption[];
}

export interface TurnResult {
  readonly nextState: GameState;
  readonly summary: string;
}
