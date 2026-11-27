# Game Design Document (Koncept): Post-revoluční politicko-ekonomický simulátor

## 1. O čem hra je (Premisa a Lore)
Hra je hluboký politicko-ekonomický simulátor inspirovaný tituly **Papers, Please** a **Boom and Bust**. 

* **Zasazení:** Fiktivní region (inspirovaný 70. až 80. lety 20. století a atmosférou země *Arstotzka*), který není ani extrémně chudý, ani super vyspělý.
* **Výchozí situace:** V jedné ze smyšlených zemí právě proběhl převrat/revoluce a země je v ekonomickém i společenském rozkladu.
* **Role hráče:** Ujímáš se role hlavy státu (nebo klíčového představitele přechodové vlády). Tvým úkolem je nejen stabilizovat ekonomiku, ale také přežít politické intriky a udržet stát pohromadě.
* **Svět a příběh (Lore):** Okolní státy mají vlastní historii, dlouhodobé územní spory a historické křivdy. Uvnitř země existují hluboce zakořeněné tradice a zájmové skupiny, na které musíš brát ohled.

---

## 2. Jak bude hra vypadat (Vizuál a UI)
Vizuální stránka a uživatelské rozhraní (UI) staví na minimalistickém, byrokraticko-taktilním stylu (vibe jako *Papers, Please*), ale odstraňuje jeho čistou statičnost pomocí přepínání pohledů.

* **Dynamické pracoviště (Přepínání lokací):** Základní rozhraní zůstává konzistentní, ale mění se podle toho, na jakém „ministerstvu“ se právě nacházíš:
  1. **Pracovna hlavy státu:** Pohled na pracovní stůl. Zde čteš dokumenty, připomínkuješ, schvaluješ nebo zamítáš zákony a dekrety.
  2. **Ministerstvo financí:** Zobrazení makroekonomických přehledů, detailních grafů, státního rozpočtu a klíčových ekonomických ukazatelů.
  3. **Ministerstvo zahraničí:** Mapa regionu se sousedními zeměmi, přehled diplomatických vztahů a možnost odesílat/přijímat telegramy od cizích lídrů.

---

## 3. Klíčové herní atributy a mechaniky

Hratelnost stojí na balancování dvou hlavních rovin – **ekonomické** a **politické** – přičemž každé rozhodnutí má řetězové důsledky.

### Ekonomické atributy (Makroekonomická stabilita)
Hráč sleduje a koriguje zhruba 6 hlavních ukazatelů, aby odvrátil totální kolaps státu (hyperinflaci, bankrot nebo run na banky):
* **HDP (Hrubý domácí produkt):** Celková výkonnost a růst/pokles ekonomiky.
* **Inflace:** Míra znehodnocování měny a cenová stabilita.
* **Nezaměstnanost:** Podíl lidí bez práce (přímo ovlivňuje sociální nepokoje).
* **Státní rozpočet / Dluh:** Příjmy z daní vs. vládní výdaje a devizové rezervy.
* **Důvěra v bankovní sektor:** Stabilita finančních institucí a riziko runu na banky.

### Politické a společenské atributy (Moc a přežití)
Aby hra nebyla jen čistým „tabulkovým“ simulátorem, obsahuje silnou vrstvu politického boje a diplomacie:
* **Stabilita státu (Veřejné mínění):** Míra spokojenosti obyvatelstva a riziko dalších nepokojů či proti-revoluce.
* **Loajalita a vnitrostranická politika:** Vztahy s klíčovými frakcemi, armádou a členy vlády; boj o moc uvnitř vlastních řad.
* **Zahraniční vztahy a diplomacie:** Napětí na hranicích, obchodní dohody, historické křivdy a reakce sousedních mocností na tvé vnitropolitické kroky.

---

## 4. Cílová skupina a technické pojetí
* **Formát:** Singleplayerová strategie / simulátor pro PC (webová nebo desktopová aplikace).
* **Cílová skupina:** Fanoušci komplexních strategií, politiky a ekonomie (inspirováno mody do *Hearts of Iron*).
* **Vývojový stack:** Vytvářeno za pomoci AI nástrojů (**Antigravity** a **Claude Code**) se synchronizací kódu přes **GitHub**.
