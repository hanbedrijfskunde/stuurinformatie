# Sturing in lagen

Statische werkvorm-tool voor het college **Sturing in lagen** uit de module
Informatiemanagement (HBO Bedrijfskunde, HAN). Studenten ervaren in 45 minuten
hoe informatie in een organisatie verspreid zit over meerdere systemen, en
spelen een mini-stage als bedrijfskundig adviseur op een random toegewezen
managementniveau. Gebaseerd op echte boekhoudgegevens van Vento ICT B.V.
(boekjaar 2016).

🌐 **Live:** [hanbedrijfskunde.github.io/stuurinformatie](https://hanbedrijfskunde.github.io/stuurinformatie/)

📚 **Documentatie:**
- [Docentenhandleiding](DOCENTENHANDLEIDING.md) — 11-secties guide met didactische uitgangspunten, competenties, voorbereiding, begeleiding, FAQ en troubleshooting
- [PRD v0.4](PRD-v0.4.md) — functionele specificatie en roadmap

---

## Highlights v0.4 (game-mode)

- **Random rol-toewijzing** als Strategy Consultant (€ 250/u), Management Consultant (€ 150/u) of Junior Business Analyst (€ 100/u)
- **Honorarium-doel € 3.000** dat onhaalbaar is zonder samenwerking — cross-niveau-bonus van +2 uren maakt de drempel haalbaar
- **Auto-compute engine** — 11 business-vragen worden live uit de CSVs berekend met methode-uitleg
- **Twee-routes-feedback** voor vragen 8 + 11: beide uitkomsten worden naast elkaar getoond met de waarschuwing *"beiden kloppen"*
- **Vraag-taxonomie** Strategisch/Tactisch/Operationeel met kleur-badges en uitleg-paneel
- **Live fee-meter** met voortgangsbalk + drempel-cue ("vraag een collega")
- **5-states cell-cycle** incl. 🤝 COLLEGA voor expliciete samenwerking
- **Reflectie-modal** met drie meta-vragen bij drempel-bereiken
- **Samenwerkings-log** in docent-modus voor analytics achteraf
- **PowerBI-georiënteerd** met fallback naar Excel/Power Query

---

## Sitestructuur

| Pagina | Voor welke fase | Wat doet het |
|---|---|---|
| `index.html` | **Tijdsblok 1** · intro + hub | Casus-intro, QR-code, navigatie naar alle fases, link naar handleiding |
| `heatmap.html` | **Tijdsblok 3** · 10–25 min | 4-staps-flow: random niveau → rolkaart → Data Understanding → vragen-matrix met live antwoord-engine |
| `plottwist.html` | **Tijdsblok 5** · 36–45 min | 11-slide presentatie: marge-tabel, contributiemarge-nuance, reflectie, slot |

```
platform/
├── index.html                  ← Hub: intro + QR + docent-navigatie
├── heatmap.html                ← Fase 3 game-tool (~1300 regels)
├── plottwist.html              ← Fase 5 slide deck
├── js/
│   └── engine.js               ← Auto-compute engine met 11 answer-functies
├── data/
│   ├── strategisch.zip         (4 KB) ← student-download
│   ├── tactisch.zip            (78 KB)
│   ├── operationeel.zip        (116 KB)
│   └── csv/                    ← uitgepakte CSVs voor browser fetch
├── README.md                   (dit bestand)
├── DOCENTENHANDLEIDING.md      ← 11-secties uitgebreide guide
├── PRD-v0.4.md                 ← functionele specificatie
└── .nojekyll
```

---

## Flow per persona

### Voor studenten

1. **Scan de QR-code** op de beamer of klik *Begin de werkvorm* op `index.html`
2. **Random toewijzing** — krijg een rol toegewezen (Strategy / Management / Junior)
3. Klik je actieve tegel → zie je **rolkaart** met persona, tarief, opdracht, frustratie en kracht
4. **Data Understanding** — download je dataset-ZIP, importeer in PowerBI, leg relaties tussen tabellen
5. Klik *Verder naar de vragen* → **matrix** met 11 vragen (gelabeld S/T/O)
6. Per cel: klik door **leeg → JA → MISSCHIEN → NEE → 🤝 COLLEGA → leeg**
7. Antwoord-paneel toont **berekend antwoord uit jouw data** met methode-uitleg
8. Twee-routes-vragen (8 + 11) tonen **beide uitkomsten** zonder dat één "juist" is
9. Bij solo-max bereikt: **vraag een collega** voor +2u bonus (cross-niveau-samenwerking)
10. Bij € 3.000 bereikt: **reflectie-modal** met drie meta-vragen

### Voor docent

1. Open `index.html` op laptop → projecteer op beamer
2. **Tijdsblok 1**: gebruik landing voor casus-intro (4 kerncijfers + prikkel-vraag)
3. **Tijdsblok 2/3 start**: toon QR-code op beamer → studenten scannen
4. **Tijdsblok 3 actief**: navigeer naar `heatmap.html?docent` voor docent-modus:
   - Alle 3 kolommen interactief
   - Antwoordsleutel via `K`-toets (toggle)
   - Samenwerkings-log-export-knop voor analytics
5. **Tijdsblok 5**: navigeer naar `plottwist.html`, druk `F` voor fullscreen

---

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
| Klik op cel | Cycle: leeg → JA → MISSCHIEN → NEE → 🤝 COLLEGA → leeg |
| K | Toon/verberg antwoordsleutel *(docent-modus)* |
| R | Reset antwoorden (binnen huidige sessie) |
| F | Fullscreen aan/uit |
| *Begin opnieuw* knop | Wis localStorage volledig — start vanaf niveau-toewijzing |
| *Exporteer samenwerkings-log* knop | Kopieert log naar klembord *(docent-modus)* |

---

## Game-mechaniek (v0.4)

### Tarieven & honorarium-doel

| Niveau | Persona | Uurtarief | Max solo | Tekort tot € 3.000 |
|---|---|--:|--:|--:|
| Strategy Consultant | Directie / DGA | € 250 | € 2.000 | € 1.000 |
| Management Consultant | Manager Finance / Sales | € 150 | € 2.700 | € 300 |
| Junior Business Analyst | Debiteurenbeheerder / Magazijnchef | € 100 | € 2.600 | € 400 |

Geen niveau haalt het € 3.000-doel zonder samenwerking — dat is een
**ontwerp-keuze**, geen bug. Cross-niveau-samenwerking levert +2 uur ×
je tarief op (€ 200–500 per samenwerking).

### Vraag-types

Elke vraag krijgt een gekleurde badge naast het vraagnummer:

- **S** Strategisch (donkerblauw) — *"Wat bedreigt ons voortbestaan?"*
- **T** Tactisch (paars) — *"Wat doet ons beter scoren?"*
- **O** Operationeel (groen) — *"Wat doet ons soepeler draaien?"*

Het vraagtype is **onafhankelijk** van het niveau van de student — een
operationeel medewerker kan prima een strategische vraag stellen. Verdeling
in v0.4: 3 strategisch (vragen 4, 9, 11) · 3 tactisch (2, 8, 10) ·
5 operationeel (1, 3, 5, 6, 7).

### Twee-routes-discussie (vragen 8 + 11)

Voor *omzet per businesslijn* (8) en *productconcentratie* (11) bestaan
twee geldige berekenroutes die andere getallen opleveren:

- Via **businesslijn** (verkoopfacturen): 5 buckets — HHI 5.190
- Via **omzetrekening** (resultatenrekening + rekeningschema): 11 buckets — HHI 4.909

De engine toont beide uitkomsten met de waarschuwing dat **beiden kloppen**.
Dit is het didactische hart van het college: aggregatieniveau is een keuze,
geen feit.

---

## Datasets

Per niveau een eigen ZIP. Studenten downloaden bij Data Understanding-fase en
importeren in **MS PowerBI** (Excel/Sheets als alternatief).

| ZIP | Inhoud | Merge-puzzel |
|---|---|---|
| `strategisch.zip` (4 KB) | rekeningschema + balans + V&W | Balans/V&W bevatten alleen rekening-IDs — koppel met rekeningschema voor omschrijvingen en rapport-categorieën |
| `tactisch.zip` (78 KB) | A_crm + B_inkoop + D_grootboek | Idem + klantnummer/leveranciernummer → relatie met klanten/leveranciers |
| `operationeel.zip` (116 KB) | A_crm + B_inkoop + C_bank | Tegenpartij_id in bankmutaties heeft prefix C of S → conditioneel koppelen met klanten óf leveranciers |

Elk niveau heeft een eigen merge-puzzel: in PowerBI via *Model view → Manage
Relationships* (of *Power Query → Merge Queries*), in Excel via VLOOKUP/XLOOKUP.

### PowerBI-startsuggestie

```
1. PowerBI Desktop openen (gratis op Microsoft Store of powerbi.microsoft.com)
2. Get Data → Folder → wijs naar de uitgepakte ZIP-map
3. Combine & Transform Data → laad alle CSVs in
4. Switch naar Model view → sleep relaties op de gemeenschappelijke ID-velden
5. Bouw je eerste visual
```

---

## Lokaal draaien

```bash
# In de platform/ folder:
python3 -m http.server 8000

# Open in browser:
http://localhost:8000/
```

> **Belangrijk**: `index.html` direct openen via `file://` werkt **niet**
> voor de auto-compute engine — `fetch()` heeft een HTTP-server nodig.
> Een lokale server (Python's `http.server`, `npx http-server`, of een
> VS Code Live Server-extensie) is voldoende.
>
> Op GitHub Pages werkt alles direct zonder lokale setup.

---

## Customisatie voor andere casussen

Alle config-keys staan bovenin het `<script>`-blok van `heatmap.html`
voor eenvoudige aanpassing:

| Wat | Locatie | Vorm |
|---|---|---|
| Casus-intro cijfers | `index.html` | 4-cijfers-grid bovenin |
| Plot twist tabellen | `plottwist.html` | Slides 3 en 7 |
| Vragen | `heatmap.html` | `VRAGEN` array (11 items) |
| Verwachte antwoorden per niveau | `heatmap.html` | `ANTWOORDEN` 2D-array |
| Vraag-types S/T/O | `heatmap.html` | `VRAAG_TYPES` array |
| Punten per vraag per niveau | `heatmap.html` | `POINTS_CONFIG` 2D-array |
| Uurtarieven + drempel | `heatmap.html` | `TARIEVEN` + `FEE_DREMPEL` |
| Rolkaart-teksten | `heatmap.html` | `ROLKAARTEN` object |
| Answer-functies | `js/engine.js` | `vraag1_omzet()` t/m `vraag11_productconcentratie()` |
| Datasets | `data/csv/` + ZIPs | Vervang CSVs (zelfde kolomnamen) en hergenereer ZIPs |

Voor master-data hernoemingen (bedrijfsnaam, holding, e-mails): pas de
`RENAMES`-dictionary in `../datasets/genereer_datasets.py` aan en
regenereer.

---

## Architectuur-keuzes

- **GitHub Pages compatible** — alles statisch, geen backend, geen build-step
- **Geen accounts, geen sync** — `localStorage` per device. Studenten werken
  op hun eigen telefoon, docent verzamelt plenair via verbaal of walk-and-show
- **Random niveau-toewijzing per device** — eerlijke spreiding bij ≥9 studenten;
  bij scheve verdeling kunnen studenten "Begin opnieuw" klikken voor herrandomisatie
- **Custom delights, geen leaderboard** — bewust geen Kahoot-stijl scoring tussen
  studenten; data-onthullingen en kleurpatronen leveren de "ah-ja"-momenten
- **Auto-compute via PapaParse** — CSVs worden in browser geparsed bij eerste
  bezoek; daarna gecached in localStorage voor sub-seconde response-tijd
- **5-states cell-cycle** — naast JA/MISSCHIEN/NEE is 🤝 COLLEGA een aparte
  state voor cross-niveau-samenwerking (+2u bonus)
- **Mobile-first** — werkt op telefoonschermen ≥320px; touch-targets ≥44×44px

---

## Licentie

Ontwikkeld voor onderwijs aan HAN University of Applied Sciences.
Hergebruik en aanpassing voor onderwijsdoeleinden welkom — open een
PR of issue op [github.com/hanbedrijfskunde/stuurinformatie](https://github.com/hanbedrijfskunde/stuurinformatie).
