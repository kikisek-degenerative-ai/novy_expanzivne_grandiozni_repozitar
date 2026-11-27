import type { PolicyDocument } from '../simulation/types.ts';

/**
 * Static game data: sample policy documents for the head-of-state desk.
 *
 * Conventions:
 * - document ids are kebab-case and contain no dot,
 * - option ids follow `<documentId>.<optionKey>` (see getDocumentIdFromOptionId in the engine).
 */

export const DATA_MODULE_READY = true;

export const documents: readonly PolicyDocument[] = [
  {
    id: 'bread-subsidy',
    title: 'Dotace na chléb a mouku',
    sender: 'Ministerstvo zemědělství',
    description:
      'Po revoluci prudce zdražily základní potraviny. Ministr žádá o státní dotaci na chléb a mouku, jinak hrozí fronty před pekárnami.',
    options: [
      {
        id: 'bread-subsidy.approve',
        label: 'Schválit dotaci',
        summary: 'Fronty zmizí a lidé si oddechnou, ale stát za to zaplatí a ceny mírně vzrostou.',
        effects: { treasury: -15, publicApproval: 8, inflation: 1 },
      },
      {
        id: 'bread-subsidy.reject',
        label: 'Zamítnout dotaci',
        summary: 'Státní pokladna ušetří, ale veřejnost to vezme jako zradu revoluce.',
        effects: { treasury: 8, publicApproval: -8 },
      },
      {
        id: 'bread-subsidy.partial',
        label: 'Dotovat jen mouku',
        summary: 'Kompromis: menší výdaj i menší spokojenost.',
        effects: { treasury: -6, publicApproval: 3 },
      },
    ],
  },
  {
    id: 'central-bank-independence',
    title: 'Nezávislost národní banky',
    sender: 'Guvernér národní banky',
    description:
      'Guvernér žádá, aby banka směla samostatně určovat měnovou politiku. Vláda by přišla o snadný přístup k peněžnímu lisu.',
    options: [
      {
        id: 'central-bank-independence.grant',
        label: 'Udělit nezávislost',
        summary: 'Banky i měna získají důvěru, ale část aparátu se obává ztráty vlivu.',
        effects: { bankStability: 10, inflation: -3, factionLoyalty: -3 },
      },
      {
        id: 'central-bank-independence.keep-control',
        label: 'Ponechat banku pod kontrolou vlády',
        summary: 'Vláda získá rezervu na krizi, ale investoři ztrácejí důvěru.',
        effects: { treasury: 5, bankStability: -8, inflation: 2 },
      },
    ],
  },
  {
    id: 'army-pay-raise',
    title: 'Žádost o navýšení žoldu',
    sender: 'Generální štáb',
    description:
      'Důstojníci upozorňují, že vojáci nedostali plný žold už dvě čtvrtletí. Bez zlepšení nemohou ručit za klid v kasárnách.',
    options: [
      {
        id: 'army-pay-raise.raise',
        label: 'Zvýšit žold',
        summary: 'Armáda zůstane věrná, pokladna to pocítí.',
        effects: { treasury: -12, factionLoyalty: 12 },
      },
      {
        id: 'army-pay-raise.refuse',
        label: 'Odmítnout',
        summary: 'Lidé ocení šetrnost, generálové ne.',
        effects: { factionLoyalty: -10, publicApproval: 2 },
      },
      {
        id: 'army-pay-raise.honors',
        label: 'Nabídnout vyznamenání a funkce',
        summary: 'Levné gesto, které generály jen částečně uklidní.',
        effects: { treasury: -4, factionLoyalty: 4 },
      },
    ],
  },
  {
    id: 'factory-ownership',
    title: 'Osud státních továren',
    sender: 'Odborový svaz',
    description:
      'Velké továrny po bývalém režimu stojí. Odbory žádají jejich znárodnění, ekonomičtí poradci tlačí na rychlou privatizaci.',
    options: [
      {
        id: 'factory-ownership.nationalize',
        label: 'Znárodnit továrny',
        summary: 'Lidé dostanou práci, ale stát přijde o peníze a banky o jistotu.',
        effects: { unemployment: -4, treasury: -10, bankStability: -4, publicApproval: 4 },
      },
      {
        id: 'factory-ownership.privatize',
        label: 'Rychle privatizovat',
        summary: 'Pokladna dostane hotovost, ale propouštění rozhněvá veřejnost.',
        effects: { unemployment: 3, treasury: 14, publicApproval: -4, bankStability: 3 },
      },
      {
        id: 'factory-ownership.wait',
        label: 'Odložit rozhodnutí',
        summary: 'Nic se nezmění, ale ani nic nezhorší.',
        effects: {},
      },
    ],
  },
  {
    id: 'foreign-loan',
    title: 'Nabídka zahraniční půjčky',
    sender: 'Velvyslanectví sousedního státu',
    description:
      'Soused nabízí výhodnou půjčku výměnou za vojenskou spolupráci a přístup k vašim přístavům. Domácí aparát je nedůvěřivý.',
    options: [
      {
        id: 'foreign-loan.accept',
        label: 'Přijmout půjčku',
        summary: 'Pokladna se naplní, ale část elit vás vnímá jako loutku sousedů.',
        effects: { treasury: 30, factionLoyalty: -6, inflation: 1 },
      },
      {
        id: 'foreign-loan.decline',
        label: 'Odmítnout',
        summary: 'Zachováte suverenitu, ale přijdete o peníze.',
        effects: { publicApproval: 3, factionLoyalty: 2 },
      },
    ],
  },
  {
    id: 'amnesty-decree',
    title: 'Dekret o amnestii',
    sender: 'Ministerstvo spravedlnosti',
    description:
      'Věznice jsou plné politických vězňů i nižších funkcionářů starého režimu. Ministr navrhuje amnestii, aparát požaduje soudy.',
    options: [
      {
        id: 'amnesty-decree.amnesty',
        label: 'Vyhlásit amnestii',
        summary: 'Rodiny vězňů vás ocení, bezpečnostní složky jsou naštvané.',
        effects: { publicApproval: 6, factionLoyalty: -6 },
      },
      {
        id: 'amnesty-decree.trials',
        label: 'Uspořádat veřejné soudy',
        summary: 'Aparát je spokojen, ale lid se obává nového teroru.',
        effects: { factionLoyalty: 5, publicApproval: -5 },
      },
    ],
  },
  {
    id: 'currency-reform',
    title: 'Měnová reforma',
    sender: 'Ministerstvo financí',
    description:
      'Stará měna rychle ztrácí hodnotu. Ministr financí navrhuje výměnu měny, alternativou je dotisknout peníze a získat čas.',
    options: [
      {
        id: 'currency-reform.reform',
        label: 'Provést měnovou reformu',
        summary: 'Inflace klesne, ale zpočátku to bolí banky, rozpočet i lidi.',
        effects: { inflation: -6, bankStability: -5, publicApproval: -3, treasury: -5 },
      },
      {
        id: 'currency-reform.print-money',
        label: 'Dotisknout peníze',
        summary: 'Rychlý příjem pro stát za cenu vyšších cen a slabších bank.',
        effects: { treasury: 20, inflation: 6, bankStability: -3 },
      },
    ],
  },
  {
    id: 'bank-bailout',
    title: 'Záchrana krachujících bank',
    sender: 'Komise pro bankovní dohled',
    description:
      'Dvě největší banky nemají hotovost na výplaty vkladů. Komise žádá státní záchranu, jinak hrozí run na banky.',
    options: [
      {
        id: 'bank-bailout.bailout',
        label: 'Zachránit banky',
        summary: 'Panika ustane, ale pokladna to pocítí.',
        effects: { treasury: -20, bankStability: 15 },
      },
      {
        id: 'bank-bailout.let-fail',
        label: 'Nechat banky padnout',
        summary: 'Stát ušetří, ale důvěra v bankovní sektor se propadne a přibude nezaměstnaných.',
        effects: { bankStability: -12, unemployment: 2 },
      },
    ],
  },
];

/** Returns the document with the given id, or undefined when it does not exist. */
export function getDocumentById(documentId: string): PolicyDocument | undefined {
  return documents.find((document) => document.id === documentId);
}
