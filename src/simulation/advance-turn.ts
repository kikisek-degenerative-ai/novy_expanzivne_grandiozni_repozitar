import {
  APPROVAL_FATIGUE,
  BANK_RUN_LIMIT,
  BASE_EXPENSES,
  BASE_REVENUE,
  COUP_LIMIT,
  FINAL_TURN,
  HIGH_INFLATION,
  HIGH_UNEMPLOYMENT,
  HYPERINFLATION_LIMIT,
  INFLATION_TARGET,
  LOW_APPROVAL,
  LOW_TREASURY,
  LOYALTY_FATIGUE,
  STABLE_MIN,
  UPRISING_LIMIT,
  VERY_HIGH_INFLATION,
  WEAK_BANKS,
} from './constants.ts';
import type {
  DecisionOption,
  EconomicIndicators,
  GameState,
  IndicatorDelta,
  PoliticalIndicators,
  TurnResult,
} from './types.ts';

type Indicators = EconomicIndicators & PoliticalIndicators;
type IndicatorKey = keyof Indicators;

const INDICATOR_LABELS: Readonly<Record<IndicatorKey, string>> = {
  treasury: 'pokladna',
  inflation: 'inflace',
  unemployment: 'nezaměstnanost',
  bankStability: 'stabilita bank',
  publicApproval: 'spokojenost veřejnosti',
  factionLoyalty: 'loajalita aparátu',
};

const INDICATOR_KEYS = Object.keys(INDICATOR_LABELS) as IndicatorKey[];

interface Outcome {
  readonly status: GameState['status'];
  readonly endReason: string | null;
}

const round1 = (value: number): number => Math.round(value * 10) / 10;
const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * Option ids follow the convention `<documentId>.<optionKey>`, so the engine can tell
 * which document a decision resolves. Document ids therefore must not contain a dot.
 */
export function getDocumentIdFromOptionId(optionId: string): string {
  const separatorIndex = optionId.indexOf('.');
  return separatorIndex === -1 ? optionId : optionId.slice(0, separatorIndex);
}

function toIndicators(state: GameState): Indicators {
  return { ...state.economics, ...state.politics };
}

/** Keeps every indicator inside its valid range and removes floating point noise. */
function normalize(indicators: Indicators): Indicators {
  return {
    treasury: round1(indicators.treasury),
    inflation: round1(clamp(indicators.inflation, 0, 1000)),
    unemployment: round1(clamp(indicators.unemployment, 0, 100)),
    bankStability: round1(clamp(indicators.bankStability, 0, 100)),
    publicApproval: round1(clamp(indicators.publicApproval, 0, 100)),
    factionLoyalty: round1(clamp(indicators.factionLoyalty, 0, 100)),
  };
}

function applyDelta(indicators: Indicators, delta: IndicatorDelta): Indicators {
  const next = { ...indicators };
  for (const key of INDICATOR_KEYS) {
    next[key] += delta[key] ?? 0;
  }
  return normalize(next);
}

/** Automatic development of the country during one quarter, independent of decisions. */
function applyDrift(i: Indicators): Indicators {
  const revenue = BASE_REVENUE * (1 - i.unemployment / 100) * (0.5 + i.bankStability / 200);
  const netBudget = revenue - BASE_EXPENSES;

  const inflationDrift =
    (netBudget < 0 ? 0.5 : -0.3) + (INFLATION_TARGET - i.inflation) * 0.05;
  const unemploymentDrift =
    (i.inflation > HIGH_INFLATION ? 0.5 : -0.2) + (i.bankStability < WEAK_BANKS ? 0.5 : 0);
  const bankDrift =
    (i.inflation > VERY_HIGH_INFLATION ? -2 : 0.5) + (i.treasury < LOW_TREASURY ? -1 : 0);
  const approvalDrift =
    -APPROVAL_FATIGUE +
    (i.unemployment > HIGH_UNEMPLOYMENT ? -1.5 : 0) +
    (i.inflation > HIGH_INFLATION ? -1.5 : 0) +
    (i.unemployment <= 15 && i.inflation <= 10 ? 1 : 0);
  const loyaltyDrift =
    -LOYALTY_FATIGUE + (i.publicApproval < LOW_APPROVAL ? -1 : 0) + (i.treasury < LOW_TREASURY ? -1 : 0);

  return normalize({
    treasury: i.treasury + netBudget,
    inflation: i.inflation + inflationDrift,
    unemployment: i.unemployment + unemploymentDrift,
    bankStability: i.bankStability + bankDrift,
    publicApproval: i.publicApproval + approvalDrift,
    factionLoyalty: i.factionLoyalty + loyaltyDrift,
  });
}

/** Checks loss conditions first (most severe first), then the win condition at the final turn. */
function evaluateOutcome(i: Indicators, turn: number): Outcome {
  if (i.treasury < 0) {
    return { status: 'lost', endReason: 'Státní bankrot: pokladna je prázdná a stát nemá z čeho platit.' };
  }
  if (i.inflation >= HYPERINFLATION_LIMIT) {
    return { status: 'lost', endReason: 'Hyperinflace: měna je téměř bezcenná a lidé se vracejí k výměnnému obchodu.' };
  }
  if (i.bankStability <= BANK_RUN_LIMIT) {
    return { status: 'lost', endReason: 'Run na banky: lidé vybírají úspory a bankovní systém se zhroutil.' };
  }
  if (i.factionLoyalty <= COUP_LIMIT) {
    return { status: 'lost', endReason: 'Převrat: armáda a aparát vám vypověděly poslušnost.' };
  }
  if (i.publicApproval <= UPRISING_LIMIT) {
    return { status: 'lost', endReason: 'Lidové povstání: rozzuřený dav obsadil ulice a vláda padla.' };
  }
  if (turn >= FINAL_TURN) {
    const stable =
      i.bankStability >= STABLE_MIN && i.publicApproval >= STABLE_MIN && i.factionLoyalty >= STABLE_MIN;
    return stable
      ? {
          status: 'won',
          endReason: `Přežili jste ${FINAL_TURN} čtvrtletí a zemi se podařilo stabilizovat.`,
        }
      : {
          status: 'lost',
          endReason: `Režim sice přežil ${FINAL_TURN} čtvrtletí, ale zemi se nepodařilo stabilizovat (banky, veřejnost nebo aparát jsou příliš slabé).`,
        };
  }
  return { status: 'playing', endReason: null };
}

function formatNumber(value: number): string {
  return value.toFixed(1);
}

function buildSummary(
  turn: number,
  before: Indicators,
  after: Indicators,
  decisionCount: number,
  outcome: Outcome,
): string {
  const changes = INDICATOR_KEYS.filter((key) => before[key] !== after[key]).map(
    (key) => `${INDICATOR_LABELS[key]} ${formatNumber(before[key])} → ${formatNumber(after[key])}`,
  );
  const parts = [
    `Čtvrtletí ${turn} uzavřeno (schválených rozhodnutí: ${decisionCount}).`,
    changes.length > 0 ? `Změny: ${changes.join(', ')}.` : 'Ukazatele se nezměnily.',
  ];
  if (outcome.endReason !== null) {
    parts.push(outcome.endReason);
  }
  return parts.join(' ');
}

/**
 * Pure function: applies the chosen decisions to the state, lets the country develop for one
 * quarter and evaluates win/loss conditions. Does not mutate its inputs and has no randomness.
 *
 * - When the game has ended (`status !== 'playing'`), the state is returned unchanged.
 * - `turn` increases by one while the game is running and stays on the last played turn when
 *   the game ends, so the UI can show "turn N of FINAL_TURN" at the end screen.
 */
export function advanceTurn(
  state: GameState,
  chosenDecisions: readonly DecisionOption[],
): TurnResult {
  if (state.status !== 'playing') {
    return {
      nextState: state,
      summary: `Hra již skončila. ${state.endReason ?? ''}`.trim(),
    };
  }

  const before = toIndicators(state);
  let indicators = before;
  for (const decision of chosenDecisions) {
    indicators = applyDelta(indicators, decision.effects);
  }
  const after = applyDrift(indicators);
  const outcome = evaluateOutcome(after, state.turn);

  const resolvedDocumentIds = [...state.resolvedDocumentIds];
  for (const decision of chosenDecisions) {
    const documentId = getDocumentIdFromOptionId(decision.id);
    if (!resolvedDocumentIds.includes(documentId)) {
      resolvedDocumentIds.push(documentId);
    }
  }

  const nextState: GameState = {
    turn: outcome.status === 'playing' ? state.turn + 1 : state.turn,
    economics: {
      treasury: after.treasury,
      inflation: after.inflation,
      unemployment: after.unemployment,
      bankStability: after.bankStability,
    },
    politics: {
      publicApproval: after.publicApproval,
      factionLoyalty: after.factionLoyalty,
    },
    status: outcome.status,
    endReason: outcome.endReason,
    resolvedDocumentIds,
  };

  return {
    nextState,
    summary: buildSummary(state.turn, before, after, chosenDecisions.length, outcome),
  };
}
