# CLAUDE.md

Pokyny pro Claude Code při práci v tomto repozitáři.

## O projektu
Malý game design projekt tvořený dvěma lidmi. Jde o post-revoluční politicko-ekonomický simulátor inspirovaný hrami *Papers, Please* a *Boom and Bust*: hráč je hlavou státu ve fiktivní zemi po převratu a stabilizuje ekonomiku i politickou situaci.

Podrobný koncept je v `game-design-document.md`. To je hlavní zdroj pravdy o designu hry, před změnou mechanik ho nejdřív přečti.

## Klíčové body designu (shrnutí)
- **Zasazení:** fiktivní region inspirovaný 70.–80. lety 20. století, ekonomicky průměrný.
- **Role hráče:** hlava státu / přechodová vláda.
- **Pohledy (UI):** pracovna hlavy státu, ministerstvo financí, ministerstvo zahraničí.
- **Ekonomické ukazatele:** HDP, inflace, nezaměstnanost, státní rozpočet/dluh, důvěra v bankovní sektor.
- **Politické ukazatele:** stabilita státu, loajalita frakcí a armády, zahraniční vztahy.
- **Formát:** singleplayerová hra pro PC (webová nebo desktopová).

## Pravidla pro práci
- Komunikace a dokumentace jsou česky, pokud není řečeno jinak.
- Změny designu dělej v `game-design-document.md` a drž se jeho struktury (číslované sekce).
- Nové mechaniky popiš tak, aby bylo jasné, které ukazatele ovlivňují a jaké mají řetězové důsledky.
- Do hlavní větve nepushuj přímo. Změny navrhuj přes větev a pull request, ať je může druhý člen týmu schválit.
- Neměň `README.md`, pokud o to autoři výslovně nepožádají.

## Technologie
Zatím není zvolený konkrétní stack ani struktura zdrojového kódu. Až vznikne, doplň sem příkazy pro spuštění, build a testy.
