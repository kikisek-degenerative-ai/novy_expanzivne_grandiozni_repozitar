# Plán dalších prací (Post-MVP Roadmapa – 5 hlavních tasků)

První hratelný prototyp (MVP: propojení simulačního motoru `Track A` a pracovny hlavy státu `Track B`) je hotový v `main`. Tento dokument definuje **5 navazujících tasků**, jejich prioritu, závislosti a rozdělení mezi **Kristiana (Antigravity)** a **Štěpána (Claude Code)** tak, aby mohli pracovat co nejvíce paralelně.

---

## Přehled priorit a paralelismu

| Priorita | Task | Kdo na něm dělá | Paralelismus a závislosti |
| :--- | :--- | :--- | :--- |
| **P1** | **Task 1:** Více spisů za kolo + 20+ událostí a řetězové následky | Štěpán (motor & data) + Kristian (UI stolu) | **Ihned paralelně** (jen si předem potvrdí případný nový typ pro historii/balíček) |
| **P2** | **Task 2:** Přepínání ministerstev + Ministerstvo financí (grafy) | Štěpán (historie & rozpočet) + Kristian (navigace & grafy) | **Paralelně** po Tasku 1 (nebo souběžně s Taskem 3) |
| **P2** | **Task 3:** Taktilní byrokratický vizuál (*Papers, Please* vibe) a audio | Kristian (pouze UI & CSS) | **Zcela paralelně** kdykoliv – nezasahuje do `src/simulation/` |
| **P3** | **Task 4:** Ministerstvo zahraničí (mapa regionu + telegramy) | Štěpán (diplomacie v motoru) + Kristian (mapa & telegramy) | **Navazuje na Task 2** (využívá přepínání ministerstev) |
| **P3** | **Task 5:** Ukládání hry (`localStorage`), briefing a balanční testy | Kristian (uložení & briefing) + Štěpán (simulační testy rovnováhy) | **Průběžně / před vydáním** – finální doladění hratelnosti |

### Doporučené pořadí v čase
1. **Vlna 1 (teď):** Oba paralelně na **Tasku 1** (Štěpán data a výběr spisů, Kristian podpora více spisů na stole).
2. **Vlna 2:** Paralelně **Task 2** (Ministerstvo financí) a **Task 3** (vizuální atmosféra a razítka).
3. **Vlna 3:** **Task 4** (Ministerstvo zahraničí) a finální **Task 5** (ukládání a balanc).

---

## Task 1 (P1): Více spisů za kolo, zásoba 20+ událostí a řetězové následky

**Proč je to priorita 1:** Simulační motor je vyvážený na 2–3 spisy za kolo, ale UI zatím posílá jen 1 spis za kolo a po 8 kolech se spisy opakují.

### Část pro Štěpána (Claude Code)
- **Větev:** `feat/document-deck-and-chains`
- **Vlastněné soubory:** `src/simulation/`, `src/data/`
- **Úkoly:**
  1. Rozšířit `src/data/documents.ts` ze 8 na **20–24 tematických spisů** (ekonomika, armáda/aparát, veřejné služby, krize).
  2. Vytvořit čistou funkci `selectDocumentsForTurn(state: GameState, pool: readonly PolicyDocument[], count?: number): readonly PolicyDocument[]`, která vybere 2–3 neřešené spisy pro aktuální kolo.
  3. Přidat podporu pro **podmíněné/následné spisy** (např. pokud hráč dříve vybral konkrétní volbu nebo nějaký ukazatel klesl pod kritickou mez, objeví se specifický krizový spis).
  4. Pokrýt výběr spisů a následné řetězce testy ve Vitestu.

### Část pro Kristiana (Antigravity)
- **Větev:** `feat/multi-document-desk`
- **Vlastněné soubory:** `src/components/`, `src/App.tsx`
- **Úkoly:**
  1. Upravit `App.tsx` a `DeskShell.tsx`, aby v jednom kole leželo na stole **2–3 spisů najednou** (přepínání mezi nimi pomocí záložek / obálek na stole).
  2. Umožnit hráči vybrat rozhodnutí u každého spisu v kole zvlášť (s vizuálním označením, které spisy už mají vybranou volbu a které ještě čekají).
  3. Tlačítko **„Podepsat a posunout kolo“** aktivovat až po vyřešení všech spisů v kole a předat funkci `advanceTurn(state, chosenDecisions)` celé pole rozhodnutí.
  4. V horní liště (`TopStatusBar.tsx`) zobrazit **souhrnný náhled dopadů** ze všech vybraných rozhodnutí v daném kole.

---

## Task 2 (P2): Přepínání ministerstev a Ministerstvo financí (grafy & rozpočet)

**Proč je to priorita 2:** Podle herního návrhu (*Game Design Document*) hra staví na přepínání lokací místo jednoho statického stolu.

### Část pro Štěpána (Claude Code)
- **Větev:** `feat/finance-history-model`
- **Vlastněné soubory:** `src/simulation/`
- **Úkoly:**
  1. Rozšířit `GameState` o historii ukazatelů po kolech (`history: readonly TurnSnapshot[]`), aby bylo z čeho kreslit grafy vývoje.
  2. Vyexportovat čistou funkci pro přehled rozpočtu v aktuálním kole (základní příjmy, daňový dopad nezaměstnanosti a bank, pevné výdaje, čisté saldo).
  3. Zapsat změnu `GameState` do `docs/PROGRESS.md` a aktualizovat testy.

### Část pro Kristiana (Antigravity)
- **Větev:** `feat/ministry-of-finance-ui`
- **Vlastněné soubory:** `src/components/`, `src/App.tsx`
- **Úkoly:**
  1. Přidat do `DeskShell.tsx` horní/boční přepínač lokací: **Pracovna hlavy státu** ↔ **Ministerstvo financí**.
  2. Vytvořit komponentu `MinistryOfFinanceView.tsx`:
     - Přehledové grafy vývoje ukazatelů v čase (SVG křivky pro pokladnu, inflaci, nezaměstnanost a stabilitu bank).
     - Rozpis státního rozpočtu (příjmy vs. výdaje a varování před deficitem).

---

## Task 3 (P2): Taktilní byrokratický vizuál (*Papers, Please* / 70.–80. léta)

**Proč je to priorita 2:** Současné rozhraní je čistý funkční prototyp. Chybí mu nezaměnitelná atmosféra starého úředního stolu a „úřednického“ napětí.

- **Vlastník:** **Kristian (Antigravity)** *(lze dělat zcela paralelně bez zásahu do simulace)*
- **Větev:** `feat/tactile-bureaucracy-ui`
- **Vlastněné soubory:** `src/components/`, `src/index.css`
- **Úkoly:**
  1. Stylizovat spisy jako autentické úřední dokumenty (papírová textura, hlavička ministerstva, strojopisná typografie, pořadové číslo spisu).
  2. Přidat taktilní interakci podpisu: po vybrání možnosti a posunu kola zobrazit vizuální **razítko** (*SCHVÁLENO* / *ROZHODNUTO*) s krátkou animací.
  3. Přetvořit strohé `Hlášení:` na stylizovaný **Úřední věstník / Zprávu z kola**, která srozumitelně shrne, co se změnilo.
  4. *(Volitelné)* Přidat jednoduché syntetizované zvuky přes Web Audio API (cvaknutí razítka, šustění papíru) s tlačítkem pro ztlumení v liště.

---

## Task 4 (P3): Ministerstvo zahraničí a diplomacie (mapa regionu + telegramy)

**Proč je to priorita 3:** Třetí plánovaná lokace z *Game Design Documentu*, která propojuje domácí politiku se sousedními státy. Navazuje na hotové přepínání lokací z Tasku 2.

### Část pro Štěpána (Claude Code)
- **Větev:** `feat/diplomacy-simulation`
- **Vlastněné soubory:** `src/simulation/`, `src/data/`
- **Úkoly:**
  1. Definovat 3 sousední státy (např. průmyslový soused, vojenský rival, obchodní partner) se stavem vztahů (`-100` až `+100`) a obchodními vazbami.
  2. Propojit zahraniční vztahy s ekonomikou a loajalitou armády (např. sankce zvedají inflaci, obchodní dohoda pomáhá pokladně).
  3. Přidat diplomatické telegramy / události s vlastními volbami odpovědi.

### Část pro Kristiana (Antigravity)
- **Větev:** `feat/ministry-of-foreign-affairs-ui`
- **Vlastněné soubory:** `src/components/`
- **Úkoly:**
  1. Přidat třetí záložku **Ministerstvo zahraničí** do přepínače lokací.
  2. Vytvořit komponentu `ForeignAffairsView.tsx` se stylizovanou mapou regionu (SVG), stavem vztahů se sousedy a schránkou příchozích/odchozích telegramů.

---

## Task 5 (P3): Ukládání hry, herní briefing a balanční testy

**Proč je to priorita 3:** Zajišťuje, aby hra fungovala jako kompletní zážitek pro hráče i po obnovení stránky a byla férově vyvážená.

### Část pro Kristiana (Antigravity)
- **Větev:** `feat/save-and-briefing`
- **Vlastněné soubory:** `src/App.tsx`, `src/components/`
- **Úkoly:**
  1. Automatické ukládání rozehrané hry do `localStorage` (při F5 hráč pokračuje tam, kde skončil) + bezpečné tlačítko **„Nová hra“** s potvrzením.
  2. Krátký úvodní **briefing před 1. kolem** (kontext po revoluci, jak fungují ukazatele a cíl přežít 12 čtvrtletí).

### Část pro Štěpána (Claude Code)
- **Větev:** `feat/balance-simulations`
- **Vlastněné soubory:** `src/simulation/`
- **Úkoly:**
  1. Napsat v Vitestu simulační testy pro celé 12kolové průchody (vyvážená strategie musí umožnit výhru, extrémní nebo pasivní strategie musí vést k očekávaným typům prohry).
  2. Na základě výsledků doladit hodnoty v `src/simulation/constants.ts` a v `src/data/documents.ts`.
