/**
 * Tunable balance constants of the turn simulation.
 * All values are deterministic: the engine has no randomness.
 */

/** Last turn (quarter) of the game. Surviving it with a stable country wins the game. */
export const FINAL_TURN = 12;

/** Minimum value of approval, loyalty and bank stability required for a win at the final turn. */
export const STABLE_MIN = 30;

/** Loss thresholds. */
export const HYPERINFLATION_LIMIT = 50; // inflation >= limit
export const BANK_RUN_LIMIT = 10; // bankStability <= limit
export const COUP_LIMIT = 10; // factionLoyalty <= limit
export const UPRISING_LIMIT = 10; // publicApproval <= limit

/** Budget model: revenue shrinks with unemployment and weak banks, expenses are fixed. */
export const BASE_REVENUE = 36;
export const BASE_EXPENSES = 31;

/** Thresholds that trigger the automatic (non-decision) drift of indicators. */
export const LOW_TREASURY = 20;
export const HIGH_INFLATION = 15;
export const VERY_HIGH_INFLATION = 20;
export const HIGH_UNEMPLOYMENT = 20;
export const WEAK_BANKS = 40;
export const LOW_APPROVAL = 30;

/** Inflation tends to return towards this value when the budget is balanced. */
export const INFLATION_TARGET = 5;

/** Revolution fatigue: public approval and loyalty erode every quarter without active effort. */
export const APPROVAL_FATIGUE = 2;
export const LOYALTY_FATIGUE = 2;
