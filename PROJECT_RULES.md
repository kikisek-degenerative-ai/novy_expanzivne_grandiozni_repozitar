# Project Rules & AI Agent Guidelines

Tento dokument je jediným zdrojem pravdy (Single Source of Truth) pro všechny vývojáře i AI agenty (Claude Code, Antigravity / Gemini) pracující na tomto repozitáři.

## Tým a přiřazení AI agentů
- **Kristian** – pracuje s **Antigravity (Gemini)** (aktuálně Track B: UI a pracovní stůl).
- **Štěpán** – pracuje s **Claude Code** (aktuálně Track A: simulační motor a data).

## 1. Jazyk a komunikace
- **Komunikace s uživatelem:** Vždy v češtině.
- **Vysvětlení provedené práce:** Po každém provedeném úkolu nebo příkazu vždy stručně a srozumitelně vysvětli, co se reálně stalo a proč (základní kontext, ne jen „hotovo“). Na požádání uživatele vysvětli postup ještě jednodušeji, laickým/amatérským jazykem bez technického žargonu.
- **Proaktivní vedení (Next Step):** Kdykoli dokončíš ucelený kus práce nebo se nakupí více úprav, aktivně uživateli navrhni další nejvhodnější krok (např. kdy je vhodný čas na `commit`, `push`, sloučení do `main` nebo spuštění kontroly) a stručně vysvětli proč.
- **Kód, názvy proměnných, souborů a commit messages:** Výhradně v angličtině.
- **Dokumentace (README, technické poznámky):** Česky.

## 2. Tech Stack & Nástroje
- **Jazyk / Framework:** React, TypeScript, Vite, Tailwind CSS
- **Package Manager:** `npm` — ZÁKAZ používat `yarn` nebo `pnpm`
- **Testování / Linting:** Vitest, ESLint

## 3. Struktura repozitáře a konvence
- `/src` – veškerý zdrojový kód aplikace
- `/docs` – projektová dokumentace, zadání a poznámky
- **Pojmenování souborů:** `kebab-case` (např. `user-profile.ts`), pro React komponenty `PascalCase` (např. `UserProfile.tsx`).
- **Zákaz duplicitních verzí:** Nikdy nevytvářej soubory jako `file_new.ts` nebo `file_v2.ts`. Vždy upravuj existující soubor.

## 4. Git Workflow & Práce ve dvou
- **Ochrana hlavní větve:** NIKDY necommituj ani nepushuj přímo do větve `main`.
- **Větve:** Každou novou funkci nebo opravu vyvíjej v samostatné větvi:
  - `feat/<kratky-popis>` (nová funkce)
  - `fix/<kratky-popis>` (oprava chyby)
  - `docs/<kratky-popis>` (úprava dokumentace)
- **Commit Messages:** Používej formát Conventional Commits (`feat: add login form`, `fix: resolve null pointer in parser`).
- **Před zahájením práce:** Vždy nejprve zkontroluj `git status` a aktuální větev.
- **Iterativní práce v jedné větvi:** Během rozpracovaného úkolu nebo ladění jedné funkce zůstávej v aktuální pracovní větvi (`feat/...`, `fix/...`, `docs/...`) a **neprováděj automaticky `git commit` ani `git push` po každém jednotlivém promptu**.
- **Lokální záchytné body (`commit`):** Lokální `git commit` navrhni nebo proveď až tehdy, když je dokončen ucelený funkční blok a prochází kontrola (`npm run lint` / `npm run build`), nebo když si o něj uživatel výslovně řekne.
- **Sdílení a záloha (`git push`):** `git push` a přípravu Pull Requestu navrhuj až ve chvíli, kdy je celá funkce/větev hotová, otestovaná a připravená ke sloučení do `main`, nebo na konci pracovního bloku.

## 5. Pravidla chování AI agenta (Autonomie a bezpečnost)
- **Minimální zásahy:** Měň pouze soubory, které přímo souvisí se zadaným úkolem. Nerefačtoruj nesouvisející kód bez vyžádání.
- **Kadence commitů a pushů:** Po běžných dílčích úpravách automaticky necommituj ani nepushuj; nejprve ověř funkční celek a před `git push` si vždy vyžádej potvrzení uživatele.
- **Potvrzení před kritickou akcí:** Vždy se zeptej uživatele před:
  1. Instalací nového balíčku / knihovny.
  2. Smazáním existujícího souboru nebo složky.
  3. Spuštěním `git push` nebo změnou Git větví.
- **Aktualizace kontextu:** Před zahájením práce si přečti `docs/PROGRESS.md` a `docs/TASKS.md` (sdílený datový kontrakt a rozdělení úkolů). Po dokončení většího úkolu zapiš stručné shrnutí (1–3 odrážky) do souboru `docs/PROGRESS.md`, aby druhý vývojář i druhý AI agent věděli, co se změnilo.

## 6. Kvalita kódu (Anti-patterns)
- Piš modulární kód (jedna funkce / komponenta = jedna jasná odpovědnost).
- Nepoužívej prázdné `catch` bloky; chyby vždy loguj nebo ošetři.
- Pokud si nejsi jistý architekturou nebo zadáním, zastav se a polož 1–2 konkrétní otázky předtím, než začneš psát kód.
