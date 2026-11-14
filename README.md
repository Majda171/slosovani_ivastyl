## Supabase je již nakonfigurované
V `data/settings.json` je připojen projekt `dztajrgfbvqagzkuacft` pomocí veřejného `sb_publishable_` klíče. Pokud už jsi spustila `supabase-comments.sql` v tomtéž projektu, komentáře se mohou ukládat veřejně. Zkontroluj přes formulář v běžném režimu BEZ `?demo=1` a obnov stránku. Pokud bude chyba, zkontroluj tabulku a RLS.

# IvaStyl – TEST LOSOVÁNÍ 14. 11. 2026 v 9:00 (Praha)

Toto je **testovací ZIP**. Originální ostré losování 18. 11. v 18:00 zůstává mimo tento ZIP.

## Spuštění na GitHub Pages
1. Vlož všechny soubory a složky z tohoto ZIPu do kořene repozitáře (index.html musí být v kořeni).
2. GitHub → Settings → Pages → Deploy from branch `main` / `(root)`.
3. Otevři adresu GitHub Pages. Test probíhá 14. 11. 2026 v 9:00 českého času.
4. Pro ruční opakování ukázky kdykoli otevři `index.html?demo=1` a klikni na „Přehrát losování“.

## Zvuky (už jsou uvnitř ZIPu)
- `assets/audio/background.mp3` – podkres (Smooth Presentation)
- `assets/audio/draw.mp3` – míchání míčků (Lotto Ball), ve smyčce
- `assets/audio/fanfare.mp3` – vítězná fanfára (Tada Fanfare)
- Návštěvník musí kliknout na **Zapnout zvuk**: webové prohlížeče blokují automatické přehrávání hudby bez interakce. Hudba je decentní, míchání hlasitější.

## Loga a sety
- Použita přesná dodaná loga: `assets/logo-ivastyl.png` (černá + malinová jehla), `assets/logo-madlaart.webp`.
- Po stranách jsou skutečné sety na figurínách z bočního pohledu.

## Účastníci
- `admin.html` umožní připravit soutěžící (např. `27; Jana K.`), případně vložit jen jména.
- Stáhni `participants.json` a nahraj jej do `data/participants.json` v repozitáři **před losováním**.
- Pro obě skupiny lze vložit i více než 200 soutěžících; na obrazovce je jen vizuální část míčků, ale losuje se ze všech čísel.
- Výsledek se vypočítává deterministicky ze seznamu a seed. To zajistí shodu mezi návštěvníky, **není to auditovatelný nezávislý náhodný los**. Po začátku seznam už neměň.
- Pro ostrou soutěž s transparentním náhodným losováním doporučuji serverově potvrdit a veřejně uložit výsledky před jejich zveřejněním.

## Komentáře na stránce – vyžaduje Supabase
Formulář je **přímo na této stránce**. GitHub Pages ale nemá server ani databázi. Aby každý viděl stejné komentáře:
1. Vytvoř/otevři projekt Supabase.
2. V jeho **SQL Editor** spusť celý soubor `supabase-comments.sql`.
3. V Supabase → Project Settings / API Keys zjisti `Project URL` a **publishable/anon** key (nikdy service_role/secret).
4. Otevři `admin.html`, doplň URL a veřejný klíč, stáhni `settings.json` a nahraj jej jako `data/settings.json`.
5. Návštěvníci teď mohou přímo pod losováním psát jméno a gratulaci, která se přes Supabase uloží a ukáže všem. Stránka načítá nejnovější komentáře cca každých 20 sekund.
6. Než klíče doplníš, formulář je bezpečně vypnutý s informací, že čeká na připojení. V `?demo=1` se dá otestovat lokálně, ale komentáře nejsou sdílené.
7. Na veřejném webu počítej se spamem: přidej serverové omezení a CAPTCHA před velkou propagací. Nevhodný komentář skryješ nastavením `approved=false` v Supabase.
8. Veřejné komentáře se zobrazí ostatním; do podmínek webu / ochrany osobních údajů doplň použití Supabase a pravidla moderace.

## Závěrečná obrazovka
Ukáže obě výhry, jména, kód **SOUTEZ10** a odkaz na `ivastyl.cz`. Kód musíš samostatně aktivovat v e-shopu.

## Úprava data pro ostré losování
V `app.js` změň `DRAW_AT` z `2026-11-14T08:00:00Z` na `2026-11-18T17:00:00Z` (v listopadu je v ČR UTC+1), změň texty v `index.html` a nastav finální jména a `drawSeed`. Tento ZIP je záměrně **test**, ostrý soubor zatím neměň.
