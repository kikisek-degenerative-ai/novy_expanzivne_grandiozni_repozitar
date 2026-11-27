# Rozdělení práce pro první hratelný prototyp (MVP)

Tento dokument definuje paralelní rozdělení práce mezi dva vývojáře a jejich AI agenty (Claude Code a Antigravity) tak, aby se navzájem neblokovali a neměnili stejné soubory.

---

## 1. Sdílený datový kontrakt (hranice mezi moduly)

Oba moduly komunikují výhradně přes rozhraní definovaná v `src/simulation/types.ts`.

### Přesné názvy souborů a rozhraní (`src/simulation/types.ts`)

```ts
export type GameStatus = 'playing' | 'won' | 'lost';

export interface EconomicIndicators {
  readonly treasury: number;      // Státní pokladna / rozpočet
  readonly inflation: number;     // Inflace (%)
  readonly unemployment: number;  // Nezaměstnanost (%)
  readonly bankStability: number; // Stabilita bank a institucí (0–100)
}

export interface PoliticalIndicators {
  readonly publicApproval: number; // Spokojenost veřejnosti (0–100)
  readonly factionLoyalty: number; // Loajalita / podpora aparátu a armády (0–100)
}

export interface GameState {
  readonly turn: number; // Číslo kola / čtvrtletí (začíná na 1)
  readonly economics: EconomicIndicators;
  readonly politics: PoliticalIndicators;
  readonly status: GameStatus;
  readonly endReason: string | null; // Konkrétní důvod výhry nebo prohry
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
```

> **Pravidlo pro změny sdílených typů:** Jakákoliv úprava rozhraní v `src/simulation/types.ts` musí být okamžitě zapsána do `docs/PROGRESS.md` i do tohoto souboru (`docs/TASKS.md`), aby na ni mohl druhý agent reagovat.

---

## 2. Track A — Simulační motor (Claude Code / Vývojář A)

- **Větev:** `feat/turn-simulation-engine`
- **Vlastněné složky:** `src/simulation/` a `src/data/`
- **Zákaz úprav:** `src/components/` a `src/App.tsx`

### Úkoly
1. Definovat sdílené typy (`GameState`, `PolicyDocument`, `DecisionOption`, `TurnResult`) v `src/simulation/types.ts` podle kontraktu výše.
2. Implementovat čistou funkci `advanceTurn(state: GameState, chosenDecisions: readonly DecisionOption[]): TurnResult` bez jakékoli závislosti na Reactu nebo UI.
3. Zapojit vyvážený set ekonomických a politických ukazatelů:
   - **Ekonomika:** pokladna/rozpočet (`treasury`), inflace (`inflation`), nezaměstnanost (`unemployment`), stabilita bank/institucí (`bankStability`).
   - **Politika:** loajalita/podpora (`factionLoyalty`), spokojenost veřejnosti (`publicApproval`).
   - Definovat jasné podmínky výhry (např. přežití do cílového kola při udržení stability) a konkrétní důvody prohry (bankrot, hyperinflace, run na banky, převrat/ztráta loajality, lidové povstání) zapisované do `endReason`.
4. Vytvořit prvních 5–8 ukázkových spisů v `src/data/` (např. `src/data/documents.ts`) a základní jednotkové testy ve Vitestu (`src/simulation/*.test.ts`).

---

## 3. Track B — Pracovní stůl a UI prototypu (Antigravity / Vývojář B)

- **Větev:** `feat/desk-prototype-ui`
- **Vlastněné složky:** `src/components/` a propojení v `src/App.tsx`
- **Zákaz úprav:** Výpočetní logika v `src/simulation/` (případné dočasné mocky držet odděleně mimo `src/simulation/`, např. přímo v UI vrstvě nebo lokálním adaptéru, dokud není Track A sloučen).

### Úkoly
1. Vytvořit jednoduché a přehledné rozhraní pracovny hlavy státu v `src/components/` (`PascalCase` soubory):
   - Horní lišta s aktuálními ekonomickými a politickými ukazateli a číslem kola/čtvrtletí.
   - Karta aktuálního spisu (`PolicyDocument`) se zobrazením odesílatele, popisu a tlačítek pro jednotlivá rozhodnutí (`DecisionOption`).
   - Tlačítko pro posun do dalšího kola.
2. Napojit UI na dočasná mock data odpovídající sdíleným typům (`GameState`, `PolicyDocument`, `DecisionOption`, `TurnResult`) a po sloučení Tracku A přepojit přímo na `advanceTurn`.
3. Zobrazit přehledný konec hry (stav `won` / `lost` včetně konkrétního důvodu z `endReason` a možnosti restartu).

---

## 4. Postup pro oba agenty (Prompt-ready instrukce)

Každý vývojář si nejprve z aktualizované větve `main` vytvoří svou větev a poté zkopíruje příslušný prompt do svého AI nástroje.

### Startovní prompt pro Track A (Claude Code)

```text
Přečti si PROJECT_RULES.md, CLAUDE.md, docs/PROGRESS.md a docs/TASKS.md. Zkontroluj git status a ověř, že jsi na větvi feat/turn-simulation-engine.
Pracuješ na Tracku A (vlastníš pouze src/simulation/ a src/data/, neupravuj src/components/ ani src/App.tsx).
Implementuj sdílené typy v src/simulation/types.ts podle kontraktu v docs/TASKS.md, čistou funkci advanceTurn(state, chosenDecisions) vracící TurnResult (včetně všech ekonomických a politických ukazatelů i podmínek výhry/prohry), vytvoř 5–8 ukázkových spisů v src/data/documents.ts a napiš jednotkové testy ve Vitestu.
Po dokončení spusť npm run lint, npm run build a npm test, zapiš stručné shrnutí do docs/PROGRESS.md a zeptej se mě před git push.
```

### Startovní prompt pro Track B (Antigravity)

```text
Přečti si PROJECT_RULES.md, docs/PROGRESS.md a docs/TASKS.md. Zkontroluj git status a ověř, že jsi na větvi feat/desk-prototype-ui.
Pracuješ na Tracku B (vlastníš pouze src/components/ a propojení v src/App.tsx, neupravuj výpočetní logiku v src/simulation/).
Vytvoř v src/components/ přehledné UI pracovny hlavy státu (horní lišta s ukazateli a číslem kola/čtvrtletí, karta aktuálního spisu s možnostmi rozhodnutí, tlačítko pro posun do dalšího kola a obrazovka konce hry s důvodem výhry/prohry).
Použij datové struktury podle kontraktu v docs/TASKS.md (dokud není sloučen Track A, napoj UI na lokální mock podle těchto typů).
Po dokončení spusť npm run lint a npm run build, zapiš stručné shrnutí do docs/PROGRESS.md a zeptej se mě před git push.
```
