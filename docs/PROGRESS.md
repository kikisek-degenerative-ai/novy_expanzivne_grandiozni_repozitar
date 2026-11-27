# Progress Log

Průběžný záznam změn a stavu projektu pro synchronizaci mezi vývojáři a AI agenty.

## 2026-11-27 – Krok 1: Sjednocení dokumentace (`docs/setup-initial-docs`)
- Přesunut `game-design-document.md` do `docs/game-design-document.md` a doplněna sekce **MVP Scope**.
- Doplněn konkrétní tech stack v `PROJECT_RULES.md` (React, TypeScript, Vite, Tailwind CSS, `npm`, Vitest, ESLint).
- Založen `docs/PROGRESS.md` s úvodním stavem projektu.

## 2026-11-27 – Krok 2: Kostra aplikace (`feat/project-bootstrap`)
- Inicializován projekt v React + TypeScript + Vite + Tailwind CSS + Vitest + ESLint přes `npm` (včetně `.gitignore`).
- Vytvořena struktura složek `src/simulation/`, `src/components/` a `src/data/` dle konvencí (`kebab-case` pro soubory, `PascalCase` pro komponenty).
- Ověřen build, lint a základní test přes `npm run build`, `npm run lint` a `npm test`.
