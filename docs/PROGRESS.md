# Progress Log

Průběžný záznam změn a stavu projektu pro synchronizaci mezi vývojáři a AI agenty.

## 2026-11-27 – Krok 1: Sjednocení dokumentace (`docs/setup-initial-docs`)
- Přesunut `game-design-document.md` do `docs/game-design-document.md` a doplněna sekce **MVP Scope**.
- Doplněn konkrétní tech stack v `PROJECT_RULES.md` (React, TypeScript, Vite, Tailwind CSS, `npm`, Vitest, ESLint).
- Založen `docs/PROGRESS.md` s úvodním stavem projektu.

## 2026-11-27 – Rozdělení paralelní práce (`docs/tasks-plan`)
- Vytvořen `docs/TASKS.md` se sdíleným datovým kontraktem (`src/simulation/types.ts`), rozdělením práce na Track A (`feat/turn-simulation-engine`) a Track B (`feat/desk-prototype-ui`) a startovními prompty pro oba agenty.
- Doplněn odkaz na `docs/TASKS.md` do `CLAUDE.md` a `PROJECT_RULES.md`.
## 2026-11-27 – Krok 2: Kostra aplikace (`feat/project-bootstrap`)
- Inicializován projekt v React + TypeScript + Vite + Tailwind CSS + Vitest + ESLint přes `npm` (včetně `.gitignore`).
- Vytvořena struktura složek `src/simulation/`, `src/components/` a `src/data/` dle konvencí (`kebab-case` pro soubory, `PascalCase` pro komponenty).
- Ověřen build, lint a základní test přes `npm run build`, `npm run lint` a `npm test`.

## 2026-11-27 – Track A: Simulační motor (`feat/turn-simulation-engine`)
- Implementován kontrakt v `src/simulation/types.ts` (beze změny rozhraní oproti `docs/TASKS.md`) a čistá funkce `advanceTurn(state, chosenDecisions)` v `src/simulation/advance-turn.ts`; počáteční stav vrací `createInitialState()`, ladicí konstanty jsou v `src/simulation/constants.ts`.
- Pravidla hry: výhra = přežít 12 čtvrtletí s bankami, veřejností i aparátem na ≥ 30; prohra = bankrot, hyperinflace (≥ 50 %), run na banky (≤ 10), převrat (loajalita ≤ 10), povstání (spokojenost ≤ 10) nebo nestabilní země po 12. čtvrtletí. Důvod je v `endReason`, po konci hry zůstává `turn` na posledním odehraném kole.
- Pro Track B: ID možnosti má tvar `<idSpisu>.<klic>` (z něj motor skládá `resolvedDocumentIds`). Spisy a `getDocumentById` jsou v `src/data/documents.ts` (8 spisů). Hra je vyvážená na 2–3 spisy za kolo; bez rozhodnutí hráč prohrává.
- Přidány testy ve Vitestu (`advance-turn.test.ts`, `documents.test.ts`). Pozor: v prostředí agenta nebyla síť, takže `npm run lint`, `npm run build` a `npm test` zatím nebyly spuštěny. Ověřeno jen přes `tsc` (strict) a testy se zástupnou náhradou Vitestu, vše prošlo (31/31).
## 2026-11-27 – Track B: Pracovní stůl a UI prototypu (`feat/desk-prototype-ui`)
- Vytvořeno UI pracovny hlavy státu v `src/components/` (`TopStatusBar.tsx`, `PolicyDocumentCard.tsx`, `GameEndOverlay.tsx`, `DeskShell.tsx`) a napojeno v `src/App.tsx`.
- Přidán dočasný lokální mock adaptér `src/components/mock-desk-engine.ts` podle sdíleného kontraktu (bez zásahů do `src/simulation/`), včetně náhledu dopadů, posunu kol a obrazovky konce hry (`won`/`lost` + restart).
- Ověřeno přes `npm run lint` a `npm run build`.
