# Sturing in lagen

Statische werkvorm-tool voor het college **Sturing in lagen** uit de module
Informatiemanagement (HBO Bedrijfskunde, HAN). Studenten ervaren in 45 minuten dat
informatie in een organisatie verspreid zit over meerdere systemen, en dat
elke managementlaag andere data kan zien — gebaseerd op echte XAF-auditfile-data
van EnYoi ICT Services B.V. (boekjaar 2016).

🌐 **Live:** [hanbedrijfskunde.github.io/stuurinformatie](https://hanbedrijfskunde.github.io/stuurinformatie/)

## Sitestructuur

| Pagina | Voor welke fase | Wat doet het |
|---|---|---|
| `index.html` | **Tijdsblok 1** · intro + hub | Casus-intro, QR-code voor studenten, navigatie naar alle fases |
| `heatmap.html` | **Tijdsblok 3** · 10–25 min | 3-staps-flow voor studenten: random niveau → Data Understanding → vraagkaartjes-matrix |
| `plottwist.html` | **Tijdsblok 5** · 36–45 min | 11-slide presentatie: marge-tabel, contributiemarge-nuance, reflectie, slot |

```
platform/
├── index.html          ← Hub: intro casus + QR + docent-navigatie
├── heatmap.html        ← Fase 3 student/docent tool
├── plottwist.html      ← Fase 5 slide deck
├── data/
│   ├── strategisch.zip     (4 KB)
│   ├── tactisch.zip        (76 KB)
│   └── operationeel.zip    (113 KB)
├── README.md
└── .nojekyll
```

## Flow per persona

### Voor studenten

1. **Scan de QR-code** op de beamer (of typ de URL)
2. Land direct op `heatmap.html` → **random niveau toegewezen** (Strategisch/Tactisch/Operationeel)
3. Klik op je actieve tegel → **Data Understanding-fase** (CRISP-DM stap 2):
   download de dataset, open in Excel/Sheets, vorm beeld van wat erin zit
4. Klik "Verder naar de vragen" → **matrix** met alleen jouw kolom interactief
5. Classificeer per vraag: JA / MISSCHIEN / NEE — kun je deze met ónze data beantwoorden?

### Voor docent

1. Open `index.html` op laptop → projecteer op beamer
2. **Tijdsblok 1**: gebruik landing voor casus-intro (4 kerncijfers + prikkel-vraag)
3. **Tijdsblok 2/3 start**: toon QR-code op beamer → studenten scannen en starten
4. **Tijdsblok 3 actief**: navigeer naar `heatmap.html?docent` voor docent-modus
   (alle 3 kolommen interactief, antwoordsleutel beschikbaar via `K`)
5. **Tijdsblok 5**: navigeer naar `plottwist.html`, druk `F` voor fullscreen

## Bediening

### Plot twist (`plottwist.html`)

| Toets | Wat |
|---|---|
| → · spatie · klik | Volgende slide |
| ← | Vorige slide |
| F | Fullscreen aan/uit |
| 1–9 | Direct naar slide |
| Home / End | Eerste / laatste slide |

### Heatmap (`heatmap.html`)

| Actie | Wat |
|---|---|
| Klik op cel | Cycle: leeg → JA → MISSCHIEN → NEE → leeg |
| K | Toon/verberg antwoordsleutel (alleen in docent-modus) |
| R | Reset antwoorden (binnen huidige sessie) |
| F | Fullscreen aan/uit |
| "Begin opnieuw" knop | Wis localStorage volledig — start vanaf niveau-toewijzing |

## Datasets

Per niveau een eigen ZIP. Studenten downloaden bij Data Understanding-fase en
importeren in **MS PowerBI** (Excel/Sheets als alternatief).

| ZIP | Inhoud | Merge-puzzel |
|---|---|---|
| `strategisch.zip` (4 KB) | rekeningschema + balans + V&W | Balans/V&W tonen alleen rekening-IDs — leg relatie met rekeningschema voor omschrijvingen |
| `tactisch.zip` (76 KB) | A_crm + B_inkoop + D_grootboek | Idem + klantnummer/leveranciernummer → relatie met klanten/leveranciers voor namen |
| `operationeel.zip` (113 KB) | A_crm + B_inkoop + C_bank | Tegenpartij_id in bankmutaties heeft prefix C of S → conditioneel koppelen met klanten óf leveranciers |

Elk niveau heeft een eigen merge-puzzel: in PowerBI via *Model view → Manage
Relationships* (of *Power Query → Merge Queries*), in Excel via VLOOKUP/XLOOKUP.
Strategisch lijkt "makkelijk" qua omvang (4 KB) maar dwingt direct database-
normalisatie-denken af; operationeel heeft het meeste detail maar grotendeels
simpele 1-op-1 lookups.

### PowerBI-startsuggestie

```
1. PowerBI Desktop openen (gratis op Microsoft Store of powerbi.microsoft.com)
2. Get Data → Folder → wijs naar de uitgepakte ZIP-map
3. Combine & Transform Data → laad alle CSVs in
4. Switch naar Model view → sleep relaties op de gemeenschappelijke ID-velden
5. Bouw je eerste visual: hoe je structuur voelt, wat je ziet, wat je mist
```

## Lokaal draaien

```bash
open index.html
```

Geen build, geen server, geen database. Tailwind via CDN, qrcode-library via CDN,
state via `localStorage`.

## Customisatie voor andere casussen

De inhoud staat inline in de HTML-bestanden:

- **Casus-intro cijfers** → `index.html` (de 4-cijfers-grid bovenin)
- **Plot twist tabellen** → `plottwist.html` (slides 3 en 7)
- **Vraagkaartjes + antwoordsleutel** → `heatmap.html` (variabelen `VRAGEN` en
  `ANTWOORDEN` bovenin het `<script>`-blok)
- **Datasets** → regenereer met een eigen XAF (zie `genereer_datasets.py` in
  het brondocument), zip de mappen per niveau, vervang de ZIPs in `data/`

## Architectuur-keuzes

- **GitHub Pages compatible** — alles statisch, geen backend
- **Geen accounts, geen sync** — `localStorage` per device. Studenten werken
  op hun eigen telefoon, docent verzamelt plenair via verbaal of walk-and-show
- **Random niveau-toewijzing per device** — eerlijke spreiding bij voldoende studenten
- **Custom delights, geen scoring** — bewust geen Kahoot-stijl gamification:
  data-onthullingen en kleurpatronen leveren de "ah-ja"-momenten

## Licentie

Ontwikkeld voor onderwijs aan HAN University of Applied Sciences.
Hergebruik en aanpassing voor onderwijsdoeleinden welkom.
