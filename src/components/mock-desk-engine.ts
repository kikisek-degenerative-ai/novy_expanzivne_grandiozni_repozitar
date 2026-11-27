/**
 * Temporary Track B types and local mock simulation adapter.
 * Matches the shared contract in docs/TASKS.md (`src/simulation/types.ts`).
 * Will be replaced by Track A's simulation engine once merged.
 */

export type GameStatus = 'playing' | 'won' | 'lost';

export interface EconomicIndicators {
  readonly treasury: number;
  readonly inflation: number;
  readonly unemployment: number;
  readonly bankStability: number;
}

export interface PoliticalIndicators {
  readonly publicApproval: number;
  readonly factionLoyalty: number;
}

export interface GameState {
  readonly turn: number;
  readonly economics: EconomicIndicators;
  readonly politics: PoliticalIndicators;
  readonly status: GameStatus;
  readonly endReason: string | null;
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

export const TARGET_SURVIVAL_TURNS = 8;

export const INITIAL_GAME_STATE: GameState = {
  turn: 1,
  economics: {
    treasury: 120,
    inflation: 14,
    unemployment: 11,
    bankStability: 62,
  },
  politics: {
    publicApproval: 54,
    factionLoyalty: 58,
  },
  status: 'playing',
  endReason: null,
  resolvedDocumentIds: [],
};

export const MOCK_DOCUMENTS: readonly PolicyDocument[] = [
  {
    id: 'doc-01-currency-reform',
    title: 'Dekret o stabilizaci státní měny',
    sender: 'Ministerstvo financí',
    description:
      'Po revolučním převratu ztrácí stará měna důvěru. Centrální banka navrhuje okamžité zmrazení mezd a omezení výběrů, nebo naopak krytí nových bankovek státními rezervami.',
    options: [
      {
        id: 'opt-01-austerity',
        label: 'Schválit měnovou restrikci a zmrazení mezd',
        summary: 'Sníží inflaci a posílí pokladnu, ale vyvolá nevoli obyvatelstva.',
        effects: {
          treasury: 25,
          inflation: -4,
          unemployment: 2,
          bankStability: 6,
          publicApproval: -10,
        },
      },
      {
        id: 'opt-01-reserves',
        label: 'Uvolnit rezervy na podporu likvidity bank',
        summary: 'Zklidní bankovní sektor a veřejnost za cenu výrazného výdaje z pokladny.',
        effects: {
          treasury: -30,
          inflation: 1,
          bankStability: 12,
          publicApproval: 5,
        },
      },
      {
        id: 'opt-01-defer',
        label: 'Odložit reformu na příští čtvrtletí',
        summary: 'Krátkodobě nenaruší loajalitu aparátu, ale inflace dále poroste.',
        effects: {
          inflation: 5,
          bankStability: -8,
          factionLoyalty: 3,
        },
      },
    ],
  },
  {
    id: 'doc-02-steelworks-strike',
    title: 'Hlášení o stávce ve Státních ocelárnách',
    sender: 'Ministerstvo vnitra',
    description:
      'Dělnické výbory v severním průmyslovém pásu vyhlásily stávkovou pohotovost kvůli zpožděným výplatám. Vedení armády žádá povolení k zásahu.',
    options: [
      {
        id: 'opt-02-negotiate',
        label: 'Vyplatit dlužné mzdy a jednat s odbory',
        summary: 'Uklidní veřejnost a zabrání propouštění, ale zatíží rozpočet.',
        effects: {
          treasury: -25,
          publicApproval: 10,
          factionLoyalty: -4,
        },
      },
      {
        id: 'opt-02-crackdown',
        label: 'Nasazení pořádkových jednotek a obnovení směny',
        summary: 'Ukáže sílu aparátu, ale prudce poškodí veřejné mínění.',
        effects: {
          treasury: -5,
          publicApproval: -14,
          factionLoyalty: 8,
        },
      },
    ],
  },
  {
    id: 'doc-03-regional-banks',
    title: 'Žádost o záchranu regionálních spořitelen',
    sender: 'Guvernér Státní banky',
    description:
      'Tři regionální spořitelny hlásí prudký odliv vkladů. Bez státní záruky hrozí do konce týdne řetězová panika.',
    options: [
      {
        id: 'opt-03-bailout',
        label: 'Poskytnout plnou státní záruku za vklady',
        summary: 'Stabilizuje bankovní systém, ale citelně odčerpá státní pokladnu.',
        effects: {
          treasury: -35,
          bankStability: 16,
          publicApproval: 4,
        },
      },
      {
        id: 'opt-03-nationalize',
        label: 'Zestátnit spořitelny a omezit denní výběry',
        summary: 'Udrží kontrolu s menšími náklady, ale znepokojí střadatele.',
        effects: {
          treasury: -10,
          inflation: 2,
          bankStability: 4,
          publicApproval: -6,
          factionLoyalty: 5,
        },
      },
      {
        id: 'opt-03-market',
        label: 'Nezasahovat a nechat slabé ústavy padnout',
        summary: 'Ušetří rozpočet, ale dramaticky oslabí důvěru v banky.',
        effects: {
          bankStability: -18,
          unemployment: 3,
          publicApproval: -8,
        },
      },
    ],
  },
  {
    id: 'doc-04-border-tariffs',
    title: 'Návrh nouzových cel na dovoz spotřebního zboží',
    sender: 'Ministerstvo zahraničního obchodu',
    description:
      'Domácí závody nestíhají konkurovat levnému dovozu. Zavedení cel podpoří domácí zaměstnanost, ale zvýší ceny základních potravin.',
    options: [
      {
        id: 'opt-04-tariffs',
        label: 'Zavést ochranná cla na dovoz',
        summary: 'Zvýší příjmy z cel a sníží nezaměstnanost, ale zrychlí inflaci.',
        effects: {
          treasury: 20,
          inflation: 4,
          unemployment: -3,
          publicApproval: -4,
        },
      },
      {
        id: 'opt-04-free-trade',
        label: 'Ponechat otevřené hranice pro levnější zboží',
        summary: 'Zpomalí růst cen pro občany, ale ohrozí domácí továrny.',
        effects: {
          inflation: -2,
          unemployment: 3,
          publicApproval: 4,
        },
      },
    ],
  },
  {
    id: 'doc-05-security-budget',
    title: 'Požadavek na mimořádné prémie pro velitelský sbor',
    sender: 'Rada národní bezpečnosti',
    description:
      'Generální štáb upozorňuje na nízkou morálku posádek v pohraničí a požaduje navýšení rozpočtu obrany ještě v tomto čtvrtletí.',
    options: [
      {
        id: 'opt-05-approve',
        label: 'Schválit mimořádné armádní výdaje',
        summary: 'Upevní loajalitu ozbrojených složek za cenu rozpočtového schodku.',
        effects: {
          treasury: -25,
          factionLoyalty: 12,
          publicApproval: -3,
        },
      },
      {
        id: 'opt-05-audit',
        label: 'Nařídit audit a vyplatit jen polovinu částky',
        summary: 'Kompromisní řešení s mírným dopadem na oba ukazatele.',
        effects: {
          treasury: -12,
          factionLoyalty: 3,
        },
      },
      {
        id: 'opt-05-reject',
        label: 'Zamítnout a přesměrovat peníze do veřejných prací',
        summary: 'Sníží nezaměstnanost a potěší veřejnost, ale oslabí podporu armády.',
        effects: {
          treasury: -15,
          unemployment: -3,
          publicApproval: 7,
          factionLoyalty: -12,
        },
      },
    ],
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function evaluateEndCondition(
  nextTurn: number,
  economics: GameState['economics'],
  politics: GameState['politics'],
): { status: GameStatus; endReason: string | null } {
  if (economics.treasury <= 0) {
    return { status: 'lost', endReason: 'Státní bankrot: pokladna je prázdná a stát nemůže dostát svým závazkům.' };
  }
  if (economics.inflation >= 50) {
    return { status: 'lost', endReason: 'Hyperinflace: měna se zhroutila a trh přestal fungovat.' };
  }
  if (economics.bankStability <= 0) {
    return { status: 'lost', endReason: 'Run na banky: finanční sektor zkolaboval pod vlnou výběrů.' };
  }
  if (politics.factionLoyalty <= 0) {
    return { status: 'lost', endReason: 'Státní převrat: armáda a aparát vám vypověděly poslušnost.' };
  }
  if (politics.publicApproval <= 0) {
    return { status: 'lost', endReason: 'Lidové povstání: masové protesty svrhly přechodovou vládu.' };
  }
  if (nextTurn > TARGET_SURVIVAL_TURNS) {
    return {
      status: 'won',
      endReason: `Stabilizoval jste stát po dobu ${TARGET_SURVIVAL_TURNS} čtvrtletí a úspěšně dovedl zemi k řádným volbám.`,
    };
  }
  return { status: 'playing', endReason: null };
}

export function getDocumentForTurn(turn: number): PolicyDocument {
  const index = (turn - 1) % MOCK_DOCUMENTS.length;
  return MOCK_DOCUMENTS[index];
}

export function mockAdvanceTurn(
  state: GameState,
  chosenDecisions: readonly DecisionOption[],
  resolvedDocumentId?: string,
): TurnResult {
  let treasury = state.economics.treasury;
  let inflation = state.economics.inflation;
  let unemployment = state.economics.unemployment;
  let bankStability = state.economics.bankStability;
  let publicApproval = state.politics.publicApproval;
  let factionLoyalty = state.politics.factionLoyalty;

  for (const decision of chosenDecisions) {
    const fx = decision.effects;
    treasury += fx.treasury ?? 0;
    inflation += fx.inflation ?? 0;
    unemployment += fx.unemployment ?? 0;
    bankStability += fx.bankStability ?? 0;
    publicApproval += fx.publicApproval ?? 0;
    factionLoyalty += fx.factionLoyalty ?? 0;
  }

  const nextEconomics = {
    treasury: Math.round(treasury),
    inflation: clamp(Math.round(inflation), 0, 100),
    unemployment: clamp(Math.round(unemployment), 0, 100),
    bankStability: clamp(Math.round(bankStability), 0, 100),
  };

  const nextPolitics = {
    publicApproval: clamp(Math.round(publicApproval), 0, 100),
    factionLoyalty: clamp(Math.round(factionLoyalty), 0, 100),
  };

  const nextTurn = state.turn + 1;
  const { status, endReason } = evaluateEndCondition(nextTurn, nextEconomics, nextPolitics);

  const resolvedDocumentIds = resolvedDocumentId
    ? [...state.resolvedDocumentIds, resolvedDocumentId]
    : state.resolvedDocumentIds;

  const decisionSummary =
    chosenDecisions.length > 0
      ? chosenDecisions.map((d) => d.label).join('; ')
      : 'Bez vydaného rozhodnutí';

  return {
    nextState: {
      turn: status === 'playing' ? nextTurn : state.turn,
      economics: nextEconomics,
      politics: nextPolitics,
      status,
      endReason,
      resolvedDocumentIds,
    },
    summary: `Kolo ${state.turn} uzavřeno: ${decisionSummary}.`,
  };
}
