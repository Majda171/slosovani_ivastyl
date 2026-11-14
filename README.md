# TESTOVACÍ VERZE — NEZVEŘEJŇOVAT JAKO SKUTEČNÉ LOSOVÁNÍ!

Datum testu: **14. 11. 2026 v 7:30 (Europe/Prague)**. Losování je ukázkové. Jsou vložena fiktivní jména, která můžeš nahradit v admin.html. Skutečná verze pro středu 18. 11. 2026 v 18:00 zůstává v předchozím ZIPu.

Pokud změníš jména v `admin.html`, stiskni **Stáhnout participants.json** a v GitHubu nahraď `data/participants.json`. **Samotné vyplnění administrace nestačí** – jde o generátor souboru, ne automatický zápis na server. Před 7:30 nahraj nový soubor a zkontroluj, že se načetla čísla.

Po 7:30 již testovací výsledek zůstane na stránce; celý průběh můžeš kdykoli přehrát pomocí `?demo=1`.

---

# IvaStyl – moderní soutěžní losování

Statický projekt pro **GitHub Pages**. Bez WordPressu a bez backendu; `index.html` je veřejná soutěž, `admin.html` je **lokální pomocník pro přípravu dat** (není zabezpečená administrace).

## Spuštění

1. Vytvoř prázdný veřejný GitHub repozitář, například `ivastyl-losovani`.
2. Nahraj **obsah** této složky do kořene repozitáře (`index.html`, `admin.html`, `app.js`, `styles.css`, `assets/`, `data/` atd.). Nenahrávej soubory o úroveň hlubší.
3. V GitHubu otevři **Settings → Pages → Deploy from a branch → main → / (root)** a ulož.
4. Otevři zveřejněnou adresu, zpravidla `https://TVUJ-UCET.github.io/ivastyl-losovani/`.
5. Ověř si předem vzhled na mobilu a desktopu.

## Přidání soutěžících

Otevři `admin.html` **na publikované URL**. Do dvou polí vlož soutěžící:

```text
1; Jana K.
2; @terezka
3; Aneta
```

Stejně pro kluka, s **odlišnými čísly**. Čísla musí být jedinečná mezi oběma skupinami. Můžeš vložit i samotná jména — admin jim číselné identifikátory automaticky přiřadí.

Klikni **Stáhnout participants.json** a nahraď jím `data/participants.json` v GitHubu. Potvrď commit. Soubor musí obsahovat obě neprázdné skupiny. Na veřejnou stránku dávej jen jména/přezdívky určené pro veřejné vyhlášení, **nikoli plná jména bez souhlasu, e-maily, adresy nebo jiné soukromé údaje**. Obsah JSON souboru je každému veřejně přístupný.

## Komentáře a odkazy

GitHub Pages **neposkytuje databázi**, a proto tato verze nemůže sama ukládat veřejné komentáře. Tlačítko **Přidat komentář** otevře panel pro napsání a zkopírování textu a odkaz na soutěžní příspěvek na Facebooku / Instagramu. Aby odkazy fungovaly, vlož v `admin.html` jejich **přesné URL**, stáhni `settings.json` a nahraď jím `data/settings.json`.

V téže stránce lze nastavit odkaz na e-shop, slevový kód a odkazy na sociální sítě MadlaArt. Pokud odkaz nevyplníš, nebude se příslušné tlačítko zobrazovat.

**SOUTEZ10 musí být zvlášť nastavený a aktivovaný v e-shopu.** Aplikace kód jen zobrazí a umožní kopírování; sama Shopify nenastaví.

## Čas a průběh

TEST: **14. listopadu 2026 v 7:30, čas Praha (CET)**. Aplikace používá pevný čas `2026-11-14T06:30:00Z`.

Losování se zobrazí podle reálného času, takže každý návštěvník sleduje **stejnou časovou osu** (s výhradou správně nastavených hodin v zařízení):

- 7:30:00 — úvod losování pro holčičku.
- 7:30:02 až cca 7:30:08 — růžové míčky se promíchávají.
- cca 7:30:08–7:30:15 — výherní číslo vypadne, objeví se jméno a gratulace.
- 7:30:15 — nový vstup do osudí, míčky přepnou na modrou.
- do cca 7:30:31 — losování a gratulace výherci klučičího setu.
- po cca 7:30:31 — oba výherci, poděkování, kód SOUTEZ10 a tlačítko do e-shopu.

Pokud někdo přijde až později, uvidí už zveřejněné výsledky — animace se při každé návštěvě neopakuje. Všichni vidí stejná výherní čísla, jsou-li na všech zařízeních totožné soubory účastníků.

## Jak funguje výběr výherců

Bez serveru by náhodné losování ve **každém prohlížeči zvlášť** vedlo k různým vítězům. Tato statická verze proto používá **deterministický výběr** (SHA-256 z `drawSeed`, pořadí zúčastněných a jejich jmen). Každý má jeden záznam, každý platný záznam má stejně velkou šanci *před určením seedu*; při nezměněných podkladech mají návštěvníci **stejný výsledek**.

**Důležité omezení:** Seznam i seed jsou veřejné a organizátor je může před slosováním změnit; jde tedy o prezentaci předem vypočitatelného výsledku, nikoliv o nezávisle auditované nebo kryptograficky nepředvídatelné veřejné losování. Pro soutěž, kde je nutné garantovat nezávislou náhodu až v okamžiku losování, je třeba použít backend nebo ověřitelný externí zdroj náhody a zaznamenat uzavřený seznam soutěžících.

**Nejpozději před 7:30 uzavři seznam účastníků i `drawSeed` a po zahájení je už neupravuj.** Pokud by byl seznam v okamžiku losování prázdný, aplikace místo výsledku zobrazí upozornění.

Při větším počtu soutěžících se v průhledném osudí zobrazuje jen vizuální výběr max. 35 míčků pro plynulou animaci. Výběr vítězného čísla ale proběhne ze **všech** zadaných platných účastníků v příslušné skupině.

## Zkouška animace

Veřejná adresa s `?demo=1` zapne testovací režim a tlačítko „Přehrát losování“. V tomto režimu jsou všechny výsledky **výslovně označeny jako ukázkové**. Tlačítko **Vyzkoušet s těmito jmény** v `admin.html` otevře demo s aktuálně vyplněnými jmény **jen v tomtéž prohlížeči** (přes jeho lokální úložiště).

## Vzhled, 100vh a zvuk

První obrazovka má minimálně `100svh` a obsah upravuje podle dostupné výšky. Na nízkých mobilech se z důvodu čitelnosti stránka může přirozeně posouvat; nic se nemá ořezávat. Vizuál: bílá, černé logo s malinovou jehlou, dvě fotografie setů a jedno centrální grafické osudí, ve kterém se generují pohyblivé očíslované míčky. Patička s logem MadlaArt a kontaktními odkazy.

Zvuky **zatím nejsou přidány**, jak bylo domluveno pro další úpravu. Automatické přehrávání zvuku bez předchozí interakce může být blokováno prohlížečem.

## Co zbývá ověřit

- TOTO JE POUZE TEST, datum zveřejněné skutečné soutěže neměň. Ostrá verze má datum 18. 11. 2026 v 18:00.
- Jména, čísla a pravidla soutěže.
- Správné odkazy na soutěžní FB/IG příspěvky a profily MadlaArt.
- Funkčnost slevového kódu `SOUTEZ10` v e-shopu.
- Před spuštěním živého losování proveď test režimu `?demo=1` a ujisti se, že `participants.json` skutečně obsahuje seznam.

Made by MadlaArt · https://madlaart.cz/
