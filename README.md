# Post-Revoluční Simulátor (`novy_expanzivne_grandiozni_repozitar`)

Amatérský týmový projekt politicko-ekonomického simulátoru v prohlížeči. Ujímáš se role hlavy státu v zemi po převratu, čteš příchozí spisy na svém stole a snažíš se vybalancovat ekonomiku i politiku tak, aby se stát nezhroutil.

---

## Jak si hru spustit u sebe na počítači

Stačí mít nainstalovaný **Node.js** (s nástrojem `npm`) a v terminálu ve složce projektu spustit:

1. `npm install` – stáhne potřebné knihovny (stačí udělat jednou na začátku).
2. `npm run dev` – spustí hru lokálně v prohlížeči (obvykle na adrese `http://localhost:5173/`).
3. Další užitečné příkazy pro kontrolu:
   - `npm run lint` – zkontroluje, jestli v kódu nejsou formální chyby.
   - `npm run build` – ověří, že jde celý projekt bez chyb přeložit a zabalit.
   - `npm test` – spustí automatické testy.

---

## Jak jsou teď rozdělené složky a soubory

### 1. Hlavní složka projektu (nastavení a pravidla)
- **`PROJECT_RULES.md`** – hlavní pravidla spolupráce pro oba vývojáře i AI asistenty (jak pojmenovávat soubory, jak používat Git větve a kdy commitovat/pushovat).
- **`CLAUDE.md`** – krátké instrukce pro AI asistenta Claude Code (odkazují na `PROJECT_RULES.md` a `docs/PROGRESS.md`).
- **`README.md`** – tento přehled projektu.
- **`package.json`** a **`package-lock.json`** – seznam použitých technologií (React, TypeScript, Vite, Tailwind CSS, Vitest, ESLint) a definice příkazů `npm run ...`.
- **`index.html`** – základní HTML stránka, do které se celá hra vykreslí.
- **`vite.config.ts`**, **`tsconfig.json`**, **`eslint.config.js`** – technická nastavení pro sestavení aplikace, kontrolu TypeScriptu a kontrolu kvality kódu.

### 2. Složka `docs/` (dokumentace a plánování)
- **`docs/game-design-document.md`** – herní návrh: o čem hra je, jakou má atmosféru (*Papers, Please* / *Boom and Bust*), jaké sleduje ukazatele a co je cílem první hratelné verze (MVP).
- **`docs/PROGRESS.md`** – společný deník změn, kam se stručně zapisuje každý hotový krok, aby oba vývojáři i AI agenti věděli, co je nového.
- **`docs/TASKS.md`** – rozdělení práce pro MVP a sdílený datový kontrakt mezi simulačním motorem a uživatelským rozhraním.

### 3. Složka `src/` (samotný kód hry)
- **`src/main.tsx`** a **`src/index.css`** – startovní soubor aplikace a napojení stylování (Tailwind CSS).
- **`src/App.tsx`** – hlavní „spojka“ hry: drží aktuální stav kola a propojuje obrazovku pracovny s herní logikou (`advanceTurn`).

#### `src/components/` (vzhled a ovládání pracovny hlavy státu)
- **`DeskShell.tsx`** – hlavní rozložení pracovny (horní lišta, hlášení z minulého kola, aktuální spis a tlačítko pro posun do dalšího kola).
- **`TopStatusBar.tsx`** – horní lišta s číslem kola/čtvrtletí a 6 hlavními ukazateli (*Pokladna*, *Inflace*, *Nezaměstnanost*, *Stabilita bank*, *Veřejné mínění*, *Loajalita aparátu*), včetně varovných barev a náhledu dopadu vybrané volby.
- **`PolicyDocumentCard.tsx`** – karta příchozího spisu s odesílatelem, popisem problému a tlačítky možných rozhodnutí.
- **`GameEndOverlay.tsx`** – závěrečná obrazovka při výhře nebo prohře s konkrétním důvodem konce vlády a tlačítkem pro restart.

#### `src/simulation/` a `src/data/` (mozek hry a data)
- **`src/simulation/types.ts`**, **`constants.ts`**, **`initial-state.ts`** – sdílené datové typy, balanční konstanty (12 čtvrtletí, prahy výhry a prohry) a počáteční stav státu.
- **`src/simulation/advance-turn.ts`** – čistá simulační funkce `advanceTurn`, která vyhodnocuje rozhodnutí, ekonomicko-politický vývoj i konec hry.
- **`src/simulation/*.test.ts`** – automatické jednotkové testy ve Vitestu.
- **`src/data/documents.ts`** – sada 8 ukázkových herních spisů a rozhodnutí.

### 4. Technické složky (neupravují se ručně)
- **`node_modules/`** – stažené knihovny třetích stran (vytvoří se příkazem `npm install`, do Gitu nepatří).
- **`dist/`** – finální sestavená verze webu (vytvoří se příkazem `npm run build`, do Gitu nepatří).
- **`.gemini/`** – interní konfigurace pro AI asistenta.
