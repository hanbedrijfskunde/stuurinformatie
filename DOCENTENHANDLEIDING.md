# Docentenhandleiding — Sturing in lagen

> **Doel van dit document**: een complete gids voor HBO-docenten die de
> werkvorm *Sturing in lagen* willen draaien. Aanvullend op het [`draaiboek.md`](../draaiboek.md)
> (lesson plan: *wat en wanneer*) en de [`PRD-v0.4.md`](PRD-v0.4.md) (technische
> specificatie). Dit document beantwoordt **waarom** de werkvorm zo is
> ontworpen en **hoe** je 'm uitvoert.
>
> **Status**: scaffold v0.1 — wordt iteratief uitgebreid na elk college met
> nieuwe casuïstiek en troubleshooting.

## Inhoud

1. [Didactische uitgangspunten](#1-didactische-uitgangspunten)
2. [Competenties en skills voor de docent](#2-competenties-en-skills-voor-de-docent)
3. [Voorbereiding (uitgebreid)](#3-voorbereiding-uitgebreid)
4. [Uitleg en introductie](#4-uitleg-en-introductie)
5. [Begeleiding tijdens de game](#5-begeleiding-tijdens-de-game)
6. [Nabespreking](#6-nabespreking)
7. [Uitgewerkte voorbeelden](#7-uitgewerkte-voorbeelden)
8. [FAQ — studenten](#8-faq--studenten)
9. [Troubleshooting voor docent](#9-troubleshooting-voor-docent)
10. [Customisatie voor andere casussen](#10-customisatie-voor-andere-casussen)
11. [Bijlage: didactische literatuur](#11-bijlage-didactische-literatuur)

---

## 1. Didactische uitgangspunten

### 1.1 PAMS-architectuur (Purpose · Autonomy · Mastery · Social)

De werkvorm is gestructureerd rond vier motivationele dimensies. Elk fase
activeert primair één of twee pijlers — herken ze, en je kunt tijdens college
sturen op wat ontbreekt.

| Pijler | Hoe ingebakken | Wanneer activeren |
|---|---|---|
| **Purpose** | Consultant-frame (echt beroep, echt tarief, echte deliverable) — zie F5.7 in PRD | Tijdsblok 1 (intro) en 5d (identity-reflectie) |
| **Autonomy** | Studenten kiezen vraag-volgorde, route (high-tarief vs. veel-laag-tarief), wel/niet samenwerken | Hele tijdsblok 3 |
| **Mastery** | Live fee-meter, antwoord-feedback per vraag, drempel-bereiken | Tijdsblok 3, 4 |
| **Social** | Cross-niveau-bonus dwingt samenwerking af — drempel onhaalbaar zonder | Tijdsblok 3c (samenwerkings-moment) |

### 1.2 CRISP-DM Data Understanding-frame

Tijdsblok 3a (Data Understanding in PowerBI) is bewust een aparte fase **vóór**
het beantwoorden van vragen. CRISP-DM (Cross-Industry Standard Process for
Data Mining) is een internationaal gestandaardiseerd 6-stappen-proces voor
data-analyse — Data Understanding is stap 2.

Pedagogische winst: studenten leren dat *je niet aan vragen begint* voordat je
weet wat er in je data zit. Dat is een professionele basis-vaardigheid die
in HBO Bedrijfskunde-curricula vaak ondergesneeuwd raakt door directe
analyse-opdrachten.

### 1.3 Consultant-frame als identity-bridge

De student speelt geen werkvorm, maar voert een mini-versie van zijn
toekomstige beroep uit. Dit is geen cosmetische gamification-laag maar een
*structureel pedagogisch element* — zie F5.7 in de PRD voor de drie niveaus
waarop dit werkt (vocational alignment, sense-making, identity formation).

**Praktische implicatie**: spreek studenten tijdens de hele werkvorm aan met
hun rol-titel (*"Strategy consultant — wat is jouw advies?"*), niet als
*"jij" of "[voornaam]"*. Het versterkt de identity-formation-laag.

### 1.4 Drie didactische aandachtspunten per fase

| Fase | Niet doen | Wel doen |
|---|---|---|
| **1. Intro** | Veel theorie over Vento ICT geven | Snel overschakelen naar consultant-frame en drempel |
| **2. Toewijzing** | Studenten laten klagen over hun niveau | Reframe: *"Iedereen krijgt een rol, ook in een echt advies-team"* |
| **3a. Data Understanding** | Ze pushen naar de vragen | Laten exploreren — *"Wat zie je? Wat verbaast je?"* |
| **3b. Vragen beantwoorden** | Antwoorden geven | Vragen stellen: *"Hoe zou je dat aanpakken? Wat heb je nodig?"* |
| **3c. Samenwerking** | Wachten tot het vanzelf gebeurt | Forceren als nodig — zie sectie 5 |
| **4. Dashboard** | Mooi maken | Het moet kloppen — niet mooi |
| **5. Plenair** | Hardlopend door alle slides | Tijd nemen voor de plot twist, twee-routes-discussie én DuPont-triangulatie |

### 1.5 Triangulatie als pedagogisch hart van v0.5+

Vanaf v0.5.1 bevat de werkvorm **vier ratio-vragen** (12-15: Profit Margin, ROA,
ROE, Cash Conversion Cycle) die expliciet gemaakt zijn voor **triangulatie-
ervaringen**. De pedagogische winst zit in twee soorten momenten:

| Soort | Wat gebeurt | Wanneer activeren |
|---|---|---|
| **Algebraïsche identiteit** (vraag 13, 14) | ROE = PM × TAT × EM klopt op rondingsruimte. Drie groepen, drie ratio's, één getal — wiskundige sluitcontrole. | Tijdsblok 5 · DuPont-Challenge |
| **Bewuste mismatch** (vraag 3, 8, 11, 15) | Twee routes geven verschillende getallen — beide kloppen, maar meten een ander ding. Methodologie-gesprek. | Tijdsblok 5b plot-twist + 5c nuance |

De vier ratio-vragen tonen samen dat een ratio-systeem zowel **intern
consistent** moet zijn (algebraïsch) als **extern betekenisvol** (interpretatief).
Bij Vento-2016 falen de standaardratio's op het tweede vlak: ROE is wiskundig
correct -443% maar betekenis-arm omdat het EV negatief is. Dat is het centrale
leer-moment van Tijdsblok 5d.

---

## 2. Competenties en skills voor de docent

Deze werkvorm vraagt vier soorten competenties van de docent. Geen daarvan
is "nice-to-have" — alle vier dragen direct bij aan de pedagogische impact.
Per categorie staan **bronnen voor zelf-aanvulling** waar je deficiënties
gericht kunt verkleinen.

### 2.1 Domein-kennis (bedrijfseconomie + informatiemanagement)

**Wat je moet kunnen**:

- Onderscheid tussen **financial accounting** en **management accounting** in
  1 minuut uitleggen
- **HHI** (Herfindahl-Hirschman Index) interpreteren en de drempels noemen
  (<1.500 laag, 1.500–2.500 matig, >2.500 hoog)
- **Werkkapitaal-cyclus** (DSO, DPO, DSI, CCC) op hoofdlijnen begrijpen, plus
  het verschil tussen **snapshot-DPO** (balans/COGS×365) en **mediaan-DPO**
  (per-factuur-distributie) — deze leveren bij dienstverleners totaal
  verschillende getallen op
- **DuPont-identiteit** (ROE = PM × TAT × EM) kunnen uitleggen als algebraïsche
  sluitcontrole, en weten wanneer de ratio betekenis-arm wordt (negatief EV)
- Verschil tussen **EV begin** (pre-closing balans) en **EV eind** (na NI-
  toevoeging) doorzien — closing-entry-concept
- Onderscheid **bruto-marge / contributiemarge / operationele marge** kunnen
  toelichten
- **ERP versus BI / OLTP versus OLAP** op architectuur-niveau begrijpen —
  waarom het ene het andere nooit kan vervangen
- **Aggregatie-niveaus** als concept kunnen articuleren (en waarom hetzelfde
  concept anders heet bij anderen)

**Aanvullen waar nodig**:

| Bron | Niveau | Tijd |
|---|---|--:|
| [Investopedia](https://investopedia.com) — quick-reference voor HHI, CCC, EBIT | Beginner | 30 min/begrip |
| [AccountingTools.com](https://accountingtools.com) — financial vs. management accounting | Tussen | 1 uur |
| Coursera — *Financial Accounting Fundamentals* (UVA) | Tussen | 12 uur |
| Boek: Drs. P. Zonneveldt — *Bedrijfseconomie voor toekomstige managers* | Beginner-Tussen | bron-naslagwerk |

### 2.2 Tool-vaardigheden (PowerBI + CSV)

**Wat je moet kunnen**:

- PowerBI Desktop openen, *Get Data → Folder*, een CSV-import doen
- *Manage Relationships* gebruiken om tabellen te koppelen via gemeenschappelijke ID's
- Een eenvoudige visual maken (bar chart, kaart, of measure)
- Snel inschatten wat een student fout doet bij PowerBI-import
- Excel + Power Query als fallback kunnen gebruiken
- CSV-bestand openen en kolomstructuur "lezen"

**Aanvullen waar nodig**:

| Bron | Niveau | Tijd |
|---|---|--:|
| [Microsoft Learn — PowerBI](https://learn.microsoft.com/training/powerplatform/power-bi) | Beginner | 4 uur basis |
| [SQLBI YouTube](https://youtube.com/@SQLBI) (Marco Russo + Alberto Ferrari) | Tussen-Expert | naar behoefte |
| [DataCamp — Introduction to PowerBI](https://datacamp.com) | Beginner | 4 uur |
| Mr. Excel (Bill Jelen) tutorials voor Power Query | Beginner-Tussen | naar behoefte |

> **Geruststellende noot**: je hoeft geen expert te zijn. Kunnen
> *"Get Data → Folder → Combine"* uitvoeren en relaties leggen is ruim
> voldoende. Voor de rest mag je samen met studenten ontdekken — dat
> versterkt zelfs de Mastery-pijler (*"docent leert ook nog steeds"*).

### 2.3 Didactische competenties

**Wat je moet kunnen**:

- **Activerend lesgeven** — vragen stellen i.p.v. antwoorden geven
- **Constructivisme toepassen** — studenten laten ontdekken, niet vertellen
- **Klassikale facilitatie** — groepsdynamiek lezen, ingrijpen waar nodig
- **Reflectief lesgeven** — open vragen stellen die niet binair beantwoord
  hoeven te worden
- **Adaptief lesgeven** — meebewegen met klas-energie
- **Bloom-niveaus herkennen** — weten wanneer je op Apply zit en wanneer op
  Evaluate (en daarop kunnen sturen)
- **Stilte gebruiken als pedagogisch instrument** — 3 seconden pauze na een
  belangrijke uitspraak ("kernzin laten landen")

**Aanvullen waar nodig**:

| Bron | Niveau | Tijd |
|---|---|--:|
| Wiggins & McTighe — *Understanding by Design* | Tussen | bron-naslagwerk |
| Marzano — *Effective Teaching Strategies* | Tussen | research-based |
| Pink — *Drive* (motivationele theorie achter PAMS) | Beginner | 4 uur lezen |
| HAN-DocentUniversiteit — interne bijscholing facilitatie | Variabel | curricula-cyclus |
| Vereniging Hogescholen — workshops activerend onderwijs | Variabel | losse sessies |

### 2.4 Soft skills en persoonlijke kwaliteiten

**Wat helpt**:

- **Improvisatievermogen** — niet uit het lood laten slaan door onverwachte
  studenten-vragen of escalaties
- **Empathie** — herkennen wanneer een student afhaakt door de inhoud vs.
  iets persoonlijks (en weten dat het verschil ertoe doet)
- **Authentieke aanwezigheid** — de Sinek-pitch geloofwaardig brengen
  vereist dat jij zelf gelooft dat dit relevant is voor studenten
- **Tolerantie voor ambiguïteit** — de twee-routes-discussie vereist dat je
  zelf comfortabel bent met *"geen enkel antwoord is écht juist"*
- **Coaching-mindset** — niet de expert-rol, maar de begeleider-rol
- **Growth mindset over jezelf** — "ik weet het niet" plenair durven zeggen,
  als modelling-gedrag voor studenten

**Aanvullen waar nodig**:

| Bron | Niveau | Tijd |
|---|---|--:|
| Schein — *Humble Inquiry* (vragen stellen i.p.v. vertellen) | Tussen | 3 uur lezen |
| Heron — *Six-Category Intervention Analysis* | Tussen-Expert | facilitatiekader |
| Dweck — *Mindset* (growth mindset cultiveren) | Beginner | 4 uur lezen |
| HAN MA Educatie / NHL Hogeschool MA Leren&Innoveren | Expert | meerjaars-traject |

### 2.5 Specifieke oefen-vaardigheden voor déze werkvorm

Voorafgaand aan het eerste college zijn dit de zes vaardigheden om bewust op
te oefenen:

| Vaardigheid | Hoe te oefenen | Tijd |
|---|---|--:|
| HHI in 1 minuut uitleggen | Schrijf het op, oefen voor de spiegel of een collega | 30 min |
| ZIP downloaden + uitpakken + importeren in PowerBI | Doe het zelf eenmalig met de demo-set | 30 min |
| Marge-tabel uit het hoofd kennen | Print 'm uit, herinner de hoofdlijnen | 15 min |
| 3-seconden-stilte na een uitspraak | Oefen met collega's of vrienden | onbewust |
| Twee-routes-discussie modereren zonder antwoord te geven | Speel mentaal het scenario af | 1 uur |
| Identity-reflectie open stellen zonder normatief te zijn | Schrijf je vraag uit, oefen neutrale toon | 30 min |

### 2.6 Zelf-evaluatie: ben ik klaar?

Drie indicatoren om eerlijk tegen jezelf op te lossen:

1. **Kun je in 30 seconden uitleggen wat het verschil is tussen *financial*
   en *management* accounting?**
   - Zo niet → eerst 1 uur AccountingTools lezen of een YouTube-uitleg kijken.

2. **Kun je een PowerBI-import zelfstandig doen, met inbegrip van *Manage
   Relationships*?**
   - Zo niet → eerst de Microsoft Learn quickstart doorlopen (~2 uur).

3. **Voel je je comfortabel met *"ik weet het niet"* plenair zeggen voor
   24 studenten?**
   - Zo niet → de twee-routes-discussie wordt lastig voor je. Oefen het in
     een minder kritische context (bijv. een case-bespreking of werkgroep)
     vóór deze werkvorm.

> Als het antwoord op een van deze drie *"nee"* is — geen reden om af te
> zien van het college. Wel reden om gericht bij te scholen voordat je voor
> 24 studenten gaat staan. Een werkvorm met deze gevolgen voor PAMS-pijlers
> verdient een goed-voorbereide docent.

### 2.7 Wanneer mede-begeleider waardevol is

Voor docenten die **zowel** weinig domein-ervaring **als** weinig PowerBI-
ervaring hebben: overweeg een mede-begeleider in te zetten voor het eerste
college. Bijvoorbeeld:

- Een collega-docent uit accountancy (voor financial vs. management accounting)
- Een student-assistent uit Bedrijfskunde-Informatica (voor PowerBI-tooling)
- Een externe stagiair-consultant van een advies-bureau (voor consultant-frame
  authenticiteit)

Mede-begeleiders zijn vooral waardevol in tijdsblok 3a (Data Understanding —
PowerBI-import) en 5b (plot twist — financial detail). Twee mensen lopen
sneller rond, en de docent-rol blijft pedagogisch coherent terwijl tools
elders worden opgelost.

---

## 3. Voorbereiding (uitgebreid)

### 3.1 Vooraankondiging aan studenten (één week vooraf)

Stuur deze e-mail of Brightspace-bericht:

> *Volgende week werken we met de game **Sturing in lagen**. Je analyseert
> echte boekhoudgegevens van een Nederlandse IT-dienstverlener. Twee dingen
> om voor te bereiden:*
>
> 1. *Installeer **PowerBI Desktop** (gratis op Windows via Microsoft Store of
>    via powerbi.microsoft.com/desktop). Mac-gebruikers: gebruik Excel + Power
>    Query of Parallels.*
> 2. *Neem je laptop mee. Een telefoon is niet genoeg.*
>
> *Geen voorbereiding nodig qua kennis. We gaan vanaf 0 uitleggen.*

### 3.2 Mentale voorbereiding docent — drie momenten die niet gemist mogen worden

1. **Tijdsblok 1 minute 4**: na de uitleg over de drempel, even stilte. Dat
   moment waarop studenten beseffen *"oh — dit is geen makkie"* — dat moet
   landen voordat je doorgaat.

2. **Tijdsblok 3c minute 22**: het moment waarop je samenwerking forceert.
   Stilte is je vriend. Laat studenten zelf bedenken wie ze nodig hebben.
   Niet helpen.

3. **Tijdsblok 5b minute 40**: na de marge-tabel. *Pauze*. Laat het bezinken.
   Als je gelijk doorratelt verlies je het effect.

### 3.3 Materialen-checklist

**Direct vóór college:**

- [ ] Klastool open op laptop: [hanbedrijfskunde.github.io/stuurinformatie](https://hanbedrijfskunde.github.io/stuurinformatie/)
- [ ] Beamer aangesloten, fullscreen-test gedaan (`F`-toets)
- [ ] Heatmap-docent-modus getest: [`/heatmap.html?docent`](https://hanbedrijfskunde.github.io/stuurinformatie/heatmap.html?docent)
- [ ] Whiteboard of flipover voor tijdsblok 4
- [ ] Wifi-test in de zaal — heb je 24 simultaneous connections?

**Hybride backup (analoog):**

- [ ] Geprinte rolkaarten (10 sets — 3 niveaus)
- [ ] Geprinte vraagkaartjes (3 stapels van 11)
- [ ] Datasets op USB-stick (zip per niveau) als wifi uitvalt

### 3.4 Trouble-shooting vooraf

| Probleem | Oplossing |
|---|---|
| Wifi-signaal zwak in zaal | Test minstens 1 dag van te voren met vol mobiel-internet als backup |
| PowerBI niet geïnstalleerd | Bij intake — geef 5-min installatietijd (niet meer) |
| GitHub Pages traag/niet up | Print fallback: rolkaarten + vraagkaartjes uit dit document |
| Klein groep (< 9 studenten) | Twee niveaus per persoon mogelijk — verwacht meer overleg |

---

## 4. Uitleg en introductie

### 4.1 De 5-minuten-pitch (verbatim suggestie)

> *"Welkom. Vandaag worden jullie ingehuurd door Vento ICT — een
> Nederlandse IT-dienstverlener uit Leusden. In 2016 maakten ze € 7,3 miljoen
> omzet, maar begonnen het jaar met een eigen vermogen van min € 1,75 miljoen.*
>
> *Jullie werken vandaag voor hen als adviesbureau. Drie niveaus: strategy
> consultant tegen € 250 per uur, management consultant tegen € 150, of
> junior business analyst tegen € 100. Jullie krijgen willekeurig een rol
> toegewezen.*
>
> *Doel: € 3.500 honorarium verdienen door business-vragen van Vento ICT te
> beantwoorden. Maar één regel: dat doel ga je niet alleen halen. Sommige
> vragen vereisen data die jouw niveau niet heeft. Dan moet je samenwerken
> met een collega van een ander niveau. Net als in de echte wereld."*
>
> *(stilte — 3 seconden)*
>
> *"Pakken jullie je laptops? We beginnen."*

### 4.2 Veelgestelde studenten-vragen tijdens introductie

| Vraag | Antwoord-suggestie |
|---|---|
| *"Mag ik een ander niveau kiezen?"* | *"Nee — random krijgen is deel van het experiment. Je leert ook iets door een rol te krijgen die je niet had gekozen."* |
| *"Werken we in groepen of individueel?"* | *"Individueel je rol, samen werken indien nodig — net als in een advies-team."* |
| *"Kunnen we samenwerken?"* | *"Sterker nog: dat moet, anders haal je de € 3.500 niet."* |
| *"Telt dit voor een cijfer?"* | *(Afhankelijk van curriculum — wees eerlijk. Bij 'nee' is dat OK; de game heeft eigen drempel.)* |

### 4.3 Wat te doen als studenten zich verzetten tegen de rol-toewijzing

Soms gebeurt het: een student wil per se "strategisch" zijn omdat dat het
hoogste klinkt. Reframe:

> *"In een echt adviesbureau ga je ook als junior beginnen. Strategy klinkt
> sexy, maar Junior Analyst heeft de meeste data en kan de meeste vragen
> beantwoorden. Geef je rol een eerlijke kans — je kunt later 'Begin opnieuw'
> klikken als je echt een ander niveau wilt proberen."*

---

## 5. Begeleiding tijdens de game

### 5.1 Wat te doen als studenten vastlopen op Data Understanding

**Symptoom**: 5 minuten in fase 3a, en de student zit nog steeds met PowerBI
te kloten zonder data te zien.

**Aanpak**:
1. Loop naar de student
2. Vraag: *"Heb je het ZIP-bestand uitgepakt?"*
3. Vraag: *"Wat zie je nu in PowerBI?"*
4. Loop ze stap-voor-stap door: Get Data → Folder → uitgepakte map → Combine
5. Niet de muisknoppen overnemen — laat ze klikken

### 5.2 Wanneer ingrijpen, wanneer laten gaan

| Situatie | Ingrijpen? | Hoe |
|---|---|---|
| Student weet niet hoe PowerBI te openen | Ja, direct | Stap-voor-stap demo |
| Student raadt op de vragen | Nee, laten gebeuren | Antwoord-engine corrigeert vanzelf |
| Student werkt al 10 min alleen aan onmogelijke vraag | Ja, met vraag | *"Heb je een collega van een ander niveau nodig?"* |
| Student haalt al € 2.500 in 12 min | Nee, complimenteren | *"Goed bezig. Welke vragen zijn nog open?"* |
| Twee studenten ruzie over wie iets doet | Ja, mediëren | *"In een advies-team verdeel je het werk. Wat is logisch?"* |

### 5.3 Concrete escalatie-scenarios

**Scenario A — Klas is stil, niemand zoekt samenwerking**

Bij minute 22, plenair:
> *"OK, even pauze. Strategy consultants: handen omhoog. Operationeel: wie
> heeft data over [vraag]? Match jezelf. Tactisch: jullie zijn de bemiddelaar
> tussen de twee."*

**Scenario B — Eén niveau is "klaar" terwijl andere nog vastlopen**

> *"Wie al € 2.500 heeft: jullie hebben nog 5 minuten. Help iemand van een
> ander niveau met een vraag — dat levert jullie ook bonus-uren op via
> coördinatie."*

**Scenario C — Een student is helemaal afgehaakt**

Loop naar ze toe. *"Wat is moeilijk? Niet de tool? Dan iets anders."* Soms
is het frustratie over PowerBI, soms over de rol, soms is er iets buiten
het college. Erken het, geef korte hulp, niet doorbomen.

### 5.4 Hoe samenwerking forceren als die niet vanzelf ontstaat

Drie escalatie-niveaus:

1. **Zacht** (minute 18): plenair zeggen *"Wie heeft al € 2.000? Wie zit op
   € 1.000? Dan weet je vast dat samenwerking nodig is."*
2. **Medium** (minute 22): expliciet matching forceren — zie scenario A
   hierboven.
3. **Hard** (minute 24): zeg *"Vragen 3, 6, 11 zijn niet voor één niveau alleen
   te beantwoorden. Wie nog niet samengewerkt heeft, doe het nu."*

---

## 6. Nabespreking

### 6.1 Plot twist en nuance (al in draaiboek tijdsblok 5b–c)

Verbatim opgenomen in het draaiboek. Lees deze opnieuw vlak voor het college
zodat de timing in je hoofd zit.

**Belangrijkste detail**: na de marge-tabel **3 seconden stilte** voordat je
de zinger uitspreekt. Pauzes zijn pedagogische gereedschap.

### 6.2 Twee-routes-discussie (HHI 5.190 vs. 4.909)

Dit is een **nieuwe** plenaire moment in v0.4 (PRD F3.5). Verloop:

1. Vraag elke groep: *"Wat is jullie HHI voor productconcentratie?"*
2. Verschillende getallen verschijnen: Strategisch 4.909 · Operationeel 5.190
3. *"Wie heeft gelijk?"* — laat discussie ontstaan
4. *"Beiden. Want jullie meten een ander ding."*
5. Toon de twee routes (5 buckets vs. 11 buckets)
6. *"Welke is de echte HHI? Er is geen 'echte'. Er is alleen een HHI per
   gekozen indeling."*

**Drie take-aways die hier landen** (verbatim uitspreken):

> *"Eerste les: aggregatieniveau is een keuze, geen feit. Bij elk getal hoort
> een definitie."*

> *"Tweede les: verschillende rapporten geven verschillende getallen door
> methodologie, niet door fouten."*

> *"Derde les: beslissingen op verschillende niveaus vereisen verschillende
> aggregaties."*

### 6.3 DuPont-triangulatie — algebraïsche identiteit (vraag 13 + 14)

Dit is een **plenair moment** in v0.5.1, gepland voor de DuPont-Challenge-pagina.
Verloop:

1. Toon `/dupont.html` op de beamer — live-data status moet groen zijn
2. Drie groepen leveren elk één ratio:
   - **Junior Analyst** → Profit Margin (PM = NI / Omzet ≈ 19,48%)
   - **Management Consultant** → Asset Turnover (TAT = Omzet / TA ≈ 1,89×)
   - **Strategy Consultant** → Equity Multiplier (EM = TA / EV ≈ −12,03×)
3. Klik *"Bereken ROE via DuPont"* — het systeem checkt of PM × TAT × EM = NI / EV
4. Bij Vento klopt de identiteit perfect (Δ < 0,01 procentpunt) — **maar het
   resultaat is −443%**. Wiskundig gevalideerd, betekenis-arm.

**Drie take-aways die hier landen** (verbatim uitspreken):

> *"Eerste les: triangulatie is een sluitcontrole. Drie onafhankelijke metingen,
> één getal — als ze samen kloppen, weet je dat tientallen tussenstappen
> consistent zijn."*

> *"Tweede les: wiskundig correct ≠ pedagogisch zinvol. ROE-direct = ROE-DuPont
> = -443% bij Vento. De ratio klopt, maar zegt niets meer over rendement op
> aandeelhouders — er is geen aandeelhouders-kapitaal meer."*

> *"Derde les: wanneer een ratio betekenis-arm wordt, is dat zelf het signaal.
> ROA blijft hier wèl betekenisvol (36,9%) — daar zit de operationele prestatie."*

**Drie debug-vragen voor de matchcheck** (gebruik bij mismatch):

| Symptoom | Oorzaak | Fix |
|---|---|---|
| Δ > 100pp | PM in decimaal i.p.v. % ingevoerd (0,1948 i.p.v. 19,48) | Met % invoeren |
| EM is positief 12× | EV begin gebruikt (−1,75M) i.p.v. EV eind (−322k) | Closing-entry: EV eind = balans + NI |
| Δ ~ 0,5pp | Afronding op te weinig decimalen | Gebruik *"Toon werkelijke Vento-waarden"* voor exact match |

### 6.4 Cash Conversion Cycle — snapshot vs hybrid (vraag 15)

Vraag 15 toont **twee routes naar dezelfde KPI**, met dramatisch verschillende
uitkomsten:

| Route | Berekening | Vento-uitkomst |
|---|---|---|
| **Snapshot** (alleen balans + V&W) | DSI + DSO − DPO via crediteuren/COGS×365 | **−178 dagen** (negatieve cyclus) |
| **Hybrid** (factuur-distributies) | DSI + DSO_med − DPO_med | **+76 dagen** (positieve cyclus) |

**De twist**: snapshot suggereert dat leveranciers de cyclus financieren — een
sterk werkkapitaal-positief signaal. **Caveat**: de DPO van **291 dagen** is een
snapshot-ratio die de werkelijkheid bij dienstverleners overschat. De
crediteurenpost van € 748.838 (rek 1600) bestaat slechts deels uit COGS-
gerelateerde inkopen; veel niet-COGS-uitgaven (overige bedrijfskosten ≈ € 3,85M)
lopen óók via 1600. De per-factuur-distributie (sectie 2.2 PRD) onthult dat de
werkelijke mediaan-betaaltermijn aan leveranciers maar **27 dagen** is.

**Plenaire opbouw** (3-4 minuten):

1. *"Wat is jullie CCC?"* — Tactische groep: snapshot −178d. Operationeel: weten
   het niet (hebben geen voorraden). Strategy: snapshot via D-data ook −178d.
2. *"Welke is correct?"* — beide. Het zijn andere definities.
3. *"Welke gebruikt een echte CFO?"* — voor IT-dienstverlener: hybrid. De
   snapshot-DPO is methodologisch verkeerd voor bedrijven waar 1600 méér bevat
   dan COGS-leveranciers.
4. *"Welke les?"* — methodologie matters. Bij elk getal hoort een definitie. Een
   snapshot-ratio zonder validatie via factuur-distributies kan misleiden.

> Dit is structureel hetzelfde inzicht als de HHI-twee-routes (sectie 6.2), maar
> dan op werkkapitaal-niveau. Zelfde meta-les: aggregatieniveau is een keuze.

### 6.5 Identity-reflectie (1 minuut, plenair)

> *"Tot slot — vandaag heb je een rol gespeeld als consultant op één niveau.
> Stak het strategische werk je het meest? Of zou je liever Junior Analyst
> blijven? Of Manager? Reflecteer voor jezelf — over een paar jaar moet je
> deze keuze écht maken."*

**Geef geen antwoord-suggestie**. De vraag werkt alleen als hij open blijft.
Een minuut bezinking. Daarna: huiswerkvraag mee voor de volgende les.

### 6.6 Hoe oogst je leerwinst — concrete vragen om te stellen

Aan het eind, kies 1–2 van deze vragen om plenair te stellen:

- *"Wat heeft je het meest verrast vandaag?"*
- *"Welk inzicht ga je morgen al gebruiken?"*
- *"Welke vraag zou je nog willen kunnen beantwoorden, en welke data zou je
  daarvoor nodig hebben?"*

---

## 7. Uitgewerkte voorbeelden

> **Status**: deze sectie bevat **hypothetische voorbeelden** geschreven vóór
> het eerste college. Na elke daadwerkelijke sessie kunnen ze worden vervangen
> of aangevuld met echte casuïstiek. De scenario's zijn ontworpen om te tonen
> hoe een ideaal-typische werkvorm verloopt en welke afwijkingen kunnen
> optreden.

### 7.1 Voorbeeld-sessie: 24 studenten, evenwichtige 8-8-8-verdeling

**Context**: woensdagochtend 09:00, jaar 2 Bedrijfskunde, blok 4 module
Informatiemanagement. 24 studenten met laptop. PowerBI vooraf geïnstalleerd
(checkpoint één week eerder).

**00:00–00:05 — Intro casus + consultant-frame**
- Docent toont landing op de beamer: *"Welkom bij Vento ICT"*
- Spreekt de 5-minuten-pitch uit (zie sectie 4.1)
- Studenten letten op: 4 cijfers + 3 tarieven + drempel € 3.500

**00:05–00:10 — Random toewijzing**
- Studenten scannen QR
- Eerste verdeling valt: 9-7-8 (S-T-O)
- Docent: *"Goed verdeeld."* Geen rebalancing nodig.
- Een student protesteert: *"Mag ik liever Strategy?"* Docent: *"Geef Junior eerst een eerlijke kans — over 5 minuten weet je waarom."*

**00:10–00:14 — PowerBI import**
- Een paar studenten hebben PowerBI-installatie-issues. Docent loopt rond, helpt
- Junior-studenten zijn als eersten klaar (kleinste dataset paradox: minste files maar meest content)
- Strategy-studenten hebben moeite met het feit dat balans/V&W alleen rekening-IDs bevatten — *"Waar is mijn omschrijving?"* — eerste merge-puzzle ontdekt

**00:14–00:22 — Vragen beantwoorden**
- Studenten klikken door de vragen
- Junior begint snel punten te scoren (eigen niveau dekt veel)
- Strategy raakt achter — fee-meter staat na 5 minuten op € 1.000 / € 3.500
- Tactisch zit ertussenin: € 1.500 ongeveer
- Eerste samenwerkings-tekens: een Strategy student loopt naar een Junior buurman: *"Hé, kan jij voor mij vraag 3 berekenen?"*

**00:22–00:25 — Plenaire samenwerkings-cue**
- Docent: *"Wie heeft al € 3.500? Niemand? Goed. Strategy consultants: handen omhoog. Wie hebben jullie nodig?"*
- Geforceerde matching: drie pairs van Strategy + Junior, twee pairs van Tactisch + Operationeel
- Binnen 2 minuten begint iedereen 🤝 COLLEGA-cellen aan te klikken
- Fee-meters lopen op naar € 2.500-3.500 bij meerderheid

**00:25–00:36 — Adviesdashboard**
- Studenten tekenen op A4 hun KSF + 2 KPIs
- Docent loopt rond, daagt uit met *"Hoe weet je dat?"*
- Drie groepen van 3-4 studenten formeren spontaan op basis van niveau

**00:36–00:39 — Korte presentaties**
- Drie groepen presenteren elk 1 minuut
- Strategy: focus op kapitaalstructuur
- Tactisch: werkkapitaal + DSI
- Operationeel: voorraadrotatie + late betalers

**00:39–00:42 — Plot twist**
- Docent toont marge-tabel
- 3 seconden stilte
- Zinger: *"Hardware is 21% van de omzet maar slechts 8% van de marge"*
- Zichtbare reactie: vier studenten van Junior-niveau leunen achterover
- *"Welke groep had de data om dit zelf te ontdekken?"* — discussie

**00:42–00:44 — Twee-routes-discussie (vraag 11)**
- Docent vraagt: *"Wat was jullie HHI voor productconcentratie?"*
- Junior: *"5.190."* Strategy: *"4.909."*
- Vraagteken in de zaal
- Docent: *"Wie heeft gelijk? — beiden. Want jullie meten een ander ding."*
- Aha-moment, vooral bij de Tactische groep

**00:44–00:45 — Slot + identity-reflectie**
- *"Stak het strategische werk je het meest? Of zou je liever Junior blijven?"*
- Stilte voor 30 seconden bezinning
- Reflectie-modal verschijnt voor wie € 3.500 haalde — drie vragen
- Huiswerk-vraag mee voor volgende les

**Resultaten op fee-meter na college**:
- 18 van 24 studenten haalden € 3.500 of meer (samenwerking werkte)
- 4 zaten op € 2.500-2.999 (bijna)
- 2 op € 1.500-2.000 (haakten af tijdens PowerBI-import)

**Achteraf**: 17 studenten vulden de reflectie-vragen in. De *"identity"-vraag*
leverde de mooiste antwoorden — drie studenten schreven dat ze nu twijfelen of
ze naar Strategy of naar Operationeel willen voor hun stage.

### 7.2 Voorbeeld-sessie: scheve 12-6-6-verdeling

**Context**: zelfde college, maar de random toewijzing pakt scheef uit:
12 Strategy, 6 Tactisch, 6 Operationeel.

**Waarom dit gebeurt**: pure random toewijzing kan met 24 trekkingen scheef
uitpakken — de wiskunde zegt dat 12-6-6 of erger optreedt in ~5% van de
gevallen.

**Tijdsblok 2 — herrandomisatie**:
- Docent ziet 12 Strategy en 6 elk voor andere niveaus
- Vraagt: *"Wie heeft Strategy gekregen — wie van jullie wil opnieuw randomizen?"*
- 4 studenten klikken "Begin opnieuw" → 1 wordt T, 2 worden O, 1 blijft S
- Nieuwe verdeling: 9-7-8. Goed genoeg.

**Pedagogische winst van deze rondselverwarring**:
- Studenten ervaren dat *"random"* niet altijd *"eerlijk"* uitvalt
- Mooi haakje voor een mini-discussie over *steekproeven en kansrekening* —
  zonder dat je het didactisch hebt gepland
- *"In de echte wereld zijn projectteams ook nooit perfect verdeeld"*

**Alternatief — geen rebalancing**:
Als de docent zegt *"laat maar staan, 12-6-6 werkt ook"*, dan:
- Strategy is overrepresented → meer concurrentie binnen die groep
- Operationeel & Tactisch worden cruciaal — er staan meer mensen in de rij voor hun data
- Samenwerkings-momenten worden intensiever per persoon

Beide werken. Welke je kiest hangt af van de groepsdynamiek.

### 7.3 Voorbeeld plenair gesprek (verbatim transcript)

**Setting**: tijdsblok 5b, plot twist, 24 studenten.

> **Docent**: *"Goed. Hier zien jullie de marge-tabel. Eén minuut stil
> kijken — wat valt op?"*
>
> *(stilte, 60 seconden, studenten lezen de tabel)*
>
> **Docent**: *"Junior consultants — wat zien jullie?"*
>
> **Student 1 (Junior)**: *"Hardware is 33-40% marge, consultancy is 99%."*
>
> **Docent**: *"Goed. Wat betekent dat?"*
>
> **Student 1**: *"Hardware is bijna niet winstgevend?"*
>
> **Docent**: *"Niet helemaal — 33% marge is op zich gezond. Maar..."*
>
> *(wacht)*
>
> **Student 2 (Strategy)**: *"Het is maar 8% van de totale marge?"*
>
> **Docent**: *"Precies. Hardware is 21% van de omzet maar slechts 8% van
> de marge. En het bindt al ons voorraad-cash. Wat is de strategische
> conclusie?"*
>
> **Student 3 (Tactisch)**: *"Stop met hardware?"*
>
> **Docent**: *"Misschien. Of optimaliseer het. Maar hier is de werkelijke
> vraag: WIE had de data om dit zelf te ontdekken?"*
>
> **Student 1 (Junior)**: *"Wij?"*
>
> **Docent**: *"Jullie. Niet Strategy — die had de data niet. Niet Tactisch
> — die had het maar half. Strategisch inzicht ontstaat hier in de meest
> atomaire data van het operationele niveau. De piramide klopt niet."*
>
> *(stilte, ~5 seconden)*
>
> **Student 2 (Strategy)**: *"Maar hoe weet de directie dit dan?"*
>
> **Docent**: *"Vraag. Vandaar dat goede directies vaak een Business
> Analyst hebben — iemand die voor hen door de operationele data graaft."*

### 7.4 Voorbeeld typisch samenwerkings-moment

**Setting**: tijdsblok 3c, ~22 minuten in.

Strategy student "Daan" heeft fee-meter op € 1.500. Junior-buurman "Lina"
heeft fee-meter op € 2.400. Daan loopt naar Lina:

> **Daan**: *"Hé, kun je voor mij vraag 6 doen? Welke klanten moeten samen
> die € 534.000 betalen?"*
>
> **Lina**: *(opent haar PowerBI-rapport)* *"Even kijken... Top-3 zijn:
> Rijder Autogroep met € 41.000, Bema Betonmortel met € 32.000, en
> Tijhuis Market met € 28.000. Plus nog een lange staart."*
>
> **Daan**: *"OK, kan ik dat hier invullen?"*
>
> *(Daan klikt door op vraag 6 in zijn matrix tot 🤝 COLLEGA — blauwe cel)*
> *(Daan's fee-meter springt naar € 2.000 — +2u × € 250 = € 500 bonus)*
>
> **Daan**: *"Mooi. Drie meer en ik haal de drempel."*
>
> **Lina**: *(grijnst)* *"Welkom bij Operationeel — de echte werkwerkers."*
>
> **Daan**: *"Ja ja. Bedankt."* *(loopt terug, gaat verder met andere
> vragen)*

**Wat docent observeert**: het samenwerkings-moment is informeel,
professioneel, en duurt < 2 minuten. Lina heeft niets verloren — haar eigen
matrix blijft compleet. Daan heeft alleen wat hij al wist (vraag 6 kan
hij niet alleen) bevestigd én een bonus binnengehaald.

**Pedagogische winst**: studenten ervaren *consulting as a profession* —
data ophalen voor een collega is normaal werk, geen "verraad" of "hulp
vragen". Dat is de Social-pijler in actie.

---

### 7.5 Voorbeeld-sessie: de DuPont-triangulatie als plenair hoogtepunt

**Setting**: tijdsblok 5b, na de plot-twist (marge-tabel). De docent navigeert
naar `dupont.html` op de beamer.

**Live-data status verschijnt**:
> ✓ Live datasets geladen — Omzet € 7.335.530 · NI € 1.428.688 · TA € 3.873.710 · EV eind € −322.018

**00:00–00:01 — Setup**
- Docent: *"Drie groepen, drie ratio's. Niemand heeft alle data. Junior:
  Profit Margin uit verkoopfacturen + V&W. Tactisch: Asset Turnover uit balans
  + V&W. Strategy: Equity Multiplier puur uit balans."*

**00:01–00:03 — Studenten leveren ratio's aan**
- Junior (na rekenen): PM = 19,48%
- Tactisch: TAT = 1,89×
- Strategy: EM = ??? — *"Wacht, EV is negatief?"* (eerste hint van edge-case)
- Strategy uit balans: TA = 3,87M, EV begin = −1,75M. Maar... EV eind?
- Docent: *"Wat heb je nog nodig?"*
- Strategy: *"De NI? Want closing-entry."*
- Docent: *"Bingo. Vraag het Junior."*
- Cross-niveau-overleg: NI = 1,43M. EV eind = −1,75M + 1,43M = −0,32M.
  EM = 3,87M / −0,32M = −12,03×

**00:03–00:04 — De match**
- PM × TAT × EM = 19,48% × 1,89 × −12,03 = **−442,9%**
- ROE direct = NI / EV eind = 1,43M / −0,32M = **−443,7%**
- Δ = 0,003 procentpunt → **MATCH** (groen paneel verschijnt)

**00:04–00:06 — De interpretatie**
- Docent: *"Wiskundig perfect. Drie groepen, drie ratio's, één getal. Wat
  betekent ROE = -443% in praktijk?"*
- Stilte
- Strategy: *"Dat we 4× de winst verliezen op het EV?"*
- Docent: *"Bijna. Het betekent dat de noemer onderwater staat. Een ratio die
  'rendement op aandeelhouders' meet, is leeg als er geen aandeelhouders-kapitaal
  meer is om op te renderen. Wiskundig correct, betekenis-arm."*
- *"Wat blijft wel betekenisvol?"*
- Junior: *"ROA?"*
- Docent: *"Ja. ROA = 36,9% — dat is operationele prestatie zonder hefboom.
  Daar zit de echte performance van Vento."*

**Pedagogische winst**: studenten ervaren in 6 minuten dat (1) triangulatie
werkt, (2) niet alle correcte wiskunde betekenisvolle informatie produceert,
en (3) verschillende ratio's verschillende vragen beantwoorden. Drie
abstracties die in een hoorcollege 30 minuten zouden kosten — hier in een
gesprek opgelost.

### 7.6 Voorbeeld-sessie: de CCC-caveat als methodologie-les

**Setting**: tijdsblok 5c (nuance-fase), na DuPont-Challenge.

**Trigger-vraag** (docent): *"Vraag 15. Tactisch consultants — wat is jullie
Cash Conversion Cycle?"*

**Antwoord**: *"Snapshot is −178 dagen. Hybrid is +76 dagen."*

**Docent**: *"Een verschil van 254 dagen. Welke gebruikt de CFO?"*

*(stilte)*

**Junior**: *"Hybrid lijkt logischer? -178 dagen klinkt absurd."*

**Docent**: *"Goede intuïtie. Waarom is snapshot −178d misleidend?"*

**Tactisch**: *"Omdat... DPO van 291 dagen kan niet kloppen. Niemand betaalt
zijn leveranciers na 10 maanden."*

**Docent**: *"Precies. Dus waar komt die 291 vandaan?"*

**Tactisch**: *"Crediteurenpost ÷ COGS × 365... maar de crediteurenpost van
€ 749K bevat veel meer dan COGS-leveranciers. Overige bedrijfskosten zijn ook
€ 3,85M en lopen ook via 1600."*

**Docent**: *"Pak. De snapshot-ratio overschat zwaar bij dienstverleners.
De per-factuur-distributie laat zien dat we onze leveranciers gewoon na
27 dagen betalen — een normale termijn. Hybrid CCC = +76 dagen is veel
betrouwbaarder."*

**Take-away**: *"Voor IT-dienstverleners: vertrouw nooit een snapshot-DPO
zonder validatie via factuur-distributies. Het is een methodologie-keuze met
beleidsimpact — als je hier op stuurt, stuur je op een illusie."*

**Pedagogische winst**: studenten leren dat een ratio kan misleiden niet door
fout maar door **definitie**. Methodologie is geen academische luxe maar
beslissings-kritisch.

---

## 8. FAQ — studenten

| Vraag | Antwoord-suggestie |
|---|---|
| *"Waarom random toewijzen? Mag ik niet kiezen?"* | *"Random is deel van het experiment — je leert ook iets door een rol te krijgen die je niet had gekozen. Bovendien: in een echte advies-team kies je ook niet altijd je eigen project."* |
| *"Wat als ik geen PowerBI heb?"* | *"Excel + Power Query werkt ook. Of werk samen met iemand die wél PowerBI heeft."* |
| *"Mijn ZIP downloadt niet, wat nu?"* | *"Probeer een andere browser. Werkt het nog niet? Vraag een buurman om de uitgepakte map te delen."* |
| *"Wat is HHI? Ik begrijp het niet."* | *"Herfindahl-Hirschman Index — meet concentratie. Hoe hoger, hoe meer afhankelijk van weinig partijen. Tussen 0 en 10.000."* |
| *"Mag ik een vraag overslaan?"* | *"Ja. Sla 'm over en kies een andere die je tijd waard is. Je hoeft niet alles te beantwoorden — je hoeft alleen € 3.500 te halen."* |
| *"Klopt mijn antwoord?"* | *"De tool berekent zelf het werkelijke antwoord. Klassificeer eerst, dan zie je hoe je het deed."* |
| *"Mag ik de antwoorden van iemand anders kopiëren?"* | *"Voor cross-niveau-vragen wel — dat is samenwerking. Binnen je eigen niveau leer je niets door te kopiëren."* |
| *"Wat als we de drempel niet halen?"* | *"Dat is OK. Het gaat niet om winnen. Het gaat om wat je leert tijdens het proberen."* |
| *"Klopt mijn Profit Margin als ik 19,48 invul i.p.v. 0,1948?"* | *"De DuPont-tool verwacht **%** — dus 19,48 is goed. Als je 0,1948 invult, kom je 100× lager uit en mismatcht alles."* |
| *"Waarom is ROE −443% bij Vento? Heb ik een fout gemaakt?"* | *"Nee. ROE = NI / EV. Bij Vento is EV negatief (−€322k). De wiskunde klopt — het is alleen niet betekenisvol meer als 'rendement op aandeelhouders'. Dat is precies de les."* |
| *"De CCC zegt −178 dagen. Klopt dat?"* | *"Snapshot-CCC: ja, wiskundig. Maar het komt door een DPO van 291d die niet realistisch is voor dienstverleners. Hybride-CCC (+76d) is betrouwbaarder."* |

---

## 9. Troubleshooting voor docent

### 9.1 Klas is stil — niemand zoekt samenwerking

Zie sectie 5.4. Drie escalatie-niveaus.

### 9.2 Drempel niet haalbaar binnen tijd

Symptoom: minute 23, niemand komt boven € 1.500.

**Diagnose**: PowerBI-installatie of merge-puzzel nam te veel tijd.

**Oplossing**:
1. Verlaag drempel ad-hoc: *"Vandaag is € 2.000 voldoende — we hebben
   technische tegenslag gehad."*
2. Of: docent kan via `?config` URL-parameter de drempel aanpassen *(in
   v0.4.x als geïmplementeerd)*.
3. Verleng fase 3 met 5 minuten — kort fase 4 in.

### 9.3 PowerBI-import faalt op meerdere apparaten

Schakel over naar groeps-import: één laptop met werkende PowerBI per niveau,
de rest kijkt mee. Vraag-classificatie blijft individueel via de tool.

### 9.4 Wifi-uitval

Schakel over naar analoge fallback:
1. Print rolkaarten (achterin draaiboek) en deel uit
2. Print vraagkaartjes
3. Datasets op USB-stick — laat circuleren
4. Antwoorden verzamelen via plenair klassikaal — gebruik whiteboard als
   matrix-vervanger

### 9.5 Antwoord-paneel toont *"Data wordt geladen — antwoord verschijnt zometeen"* en blijft hangen

**Symptoom**: student klikt cel, ziet de "data wordt geladen"-melding en het antwoord verschijnt nooit.

**Diagnose**: het is mogelijk dat de browser de oude versie van de tool uit cache gebruikt — vóór bug-fix `d7cb5e0` (mei 2026) was er een laad-volgorde-issue waarbij de auto-compute engine niet op tijd geladen was bij refresh.

**Oplossing**:
1. Hard refresh in de browser: Cmd+Shift+R (Mac) of Ctrl+Shift+R (Windows/Linux)
2. Als dat niet werkt: open DevTools (F12), tab Network, vink *"Disable cache"* aan, refresh
3. Als dat niet werkt: open DevTools, tab Console — kopieer eventuele JavaScript-fouten en stuur ze door naar de docent of GitHub-issue

**Preventie**: in de tool zit nu een retry-mechanisme dat bij eerste klik zelf de datasets probeert te laden als ze nog niet beschikbaar zijn. Een tweede klik op dezelfde cel ~1-2 seconden later zou meestal het antwoord tonen.

### 9.6 PowerBI op Mac werkt niet (geen native versie)

**Symptoom**: Mac-studenten kunnen PowerBI Desktop niet installeren — die is alleen voor Windows.

**Oplossingen** (meerdere opties, kies wat past):
1. **Excel + Power Query**: native op Mac, ondersteunt dezelfde merge-functionaliteit als PowerBI's Power Query. Slechts iets minder visueel.
2. **Parallels Desktop / VMware**: virtuele Windows-omgeving met PowerBI — overkill voor één college, maar werkt.
3. **PowerBI Service (web)**: gratis online versie — beperkter dan Desktop maar werkt cross-platform. Vereist Microsoft account.
4. **Werk in duo met Windows-buurman**: Mac-student kijkt mee, doet samenwerkingsklik in eigen tool.

**Aanbeveling vooraf**: vraag in vooraankondiging *"Heb je Mac of Windows?"* uit. Bij meer dan 3 Macs in de groep, plan duo's vooraf.

### 9.7 Random toewijzing pakt scheef uit (>50% in één niveau)

**Symptoom**: 12 of meer studenten krijgen hetzelfde niveau bij eerste random toewijzing.

**Diagnose**: pure random met 24 trekkingen kan dit ~5% van de tijd opleveren.

**Oplossing**:
1. Vraag plenair: *"Wie heeft [over-vertegenwoordigd niveau] gekregen — wie wil opnieuw randomizen?"*
2. 4-6 studenten klikken "Begin opnieuw" → meestal binnen 1-2 herrandomisaties is balans hersteld
3. Alternatief: laat de scheefheid staan en bespreek het tijdens college als *"reëel gegeven dat projectteams nooit perfect verdeeld zijn"*

### 9.8 Studenten openen elkaars datasets (peeken)

**Symptoom**: een student typt manueel de URL `?docent` of bekijkt de bron-CSVs in een ander tabblad.

**Diagnose**: de tool is bewust open — dit is een *eer-systeem*, niet een gesloten examen.

**Aanpak**: noem expliciet aan begin van college: *"Niet stiekem in andere mappen kijken — dat breekt het experiment voor jezelf. De tool werkt op vertrouwen."* Een enkele student die peekt, leert minder, maar bederft het experiment niet voor anderen.

### 9.9 Een groep haalt drempel zonder samenwerking

**Symptoom**: één tactische of operationele student haalt € 3.500 zonder ooit op 🤝 COLLEGA te klikken (theoretisch onmogelijk volgens Bijlage A, maar...).

**Diagnose**:
- Punten-config is mogelijk te genereus voor een specifieke combinatie
- Of: student heeft een vraag ingevuld als JA terwijl het verwacht NEE was, en de tool gaf onbedoeld punten

**Oplossing**:
1. Eerst checken: heeft de student inderdaad alles correct? Open de antwoordsleutel (`K`) in jouw docent-modus
2. Als de student voor één vraag JA gaf terwijl het NEE moest zijn — dat is de glitch
3. Niet stoppen, maar plenair benoemen: *"X heeft de drempel gehaald zonder samenwerking — laten we kijken hoe!"* — leer-moment

**Preventie**: in v0.5+ kunnen we een strictere validatie toevoegen die alleen punten geeft als de classificatie matcht én engine de waarde heeft berekend.

---

## 10. Customisatie voor andere casussen

### 10.1 Vervangen van CSV-data

In de map `datasets/` regenereer je nieuwe CSVs. Belangrijk: behoud de
**kolomnamen exact** zoals beschreven in de PRD (F2.4). De auto-compute engine
werkt op standaard-veldnamen — andere namen breken alle 11 vragen.

### 10.2 Aanpassen van vragen

Open `heatmap.html`, zoek de `VRAGEN` array bovenaan het script-blok. Pas
formuleringen aan, voeg toe of verwijder. Zorg dat:
- De `ANTWOORDEN` array matcht qua lengte
- De answer-functions (later in F2 implementatie) overeenkomen met de
  vraag-tekst

### 10.3 Aanpassen van tarieven en drempel

Bovenin `heatmap.html` in de `TARIEVEN` + `FEE_DREMPEL` config:

```js
const TARIEVEN = {
  's': 250,  // strategy consultant per uur
  't': 150,  // management consultant per uur
  'o': 100   // junior analyst per uur
};
const FEE_DREMPEL = 3500;  // honorarium-doel (v0.5.1: was 3000)
```

Pas aan voor andere bedrijven, andere markten of andere ambities. Let op: bij
het wijzigen van `MAX_PUNTEN` (totaal beschikbare uren per niveau) verandert
ook het samenwerkings-balans. Het ontwerp-uitgangspunt is dat de drempel
**solo onbereikbaar** is voor alle drie de niveaus. Met v0.5.1-config (15 vragen):

| Niveau | Max uren | Solo-fee | Tekort | Sw-bonusen nodig |
|---|---|---|---|---|
| Strategisch | 11 | € 2.750 | € 750 | 2× (+€ 1.000) |
| Tactisch | 22 | € 3.300 | € 200 | 1× (+€ 300) |
| Operationeel | 27 | € 2.700 | € 800 | 4× (+€ 800) |

Drie niveaus moeten elk samenwerking opzoeken — niet alleen één.

### 10.4 Toevoegen van nieuwe ratio-vragen

Vier-stappen-procedure (zie v0.5.1 commit voor referentie):

1. **`js/engine.js`**: voeg een `vraagN_naam(d)` functie toe met audit trail
   en optionele `validatie`-block voor triangulatie. Hergebruik gedeelde
   helpers (`aggregeerOmzet`, `aggregeerNI`, `aggregeerActiva`, etc.) voor
   consistentie. Voeg toe aan `ANSWER_FUNCTIONS`-array.
2. **`heatmap.html`**: breid `VRAGEN` (vraag-tekst), `VRAAG_TYPES` (S/T/O),
   `ANTWOORDEN` (per niveau ja/nee/misschien), `POINTS_CONFIG` (uren per
   niveau), `MAX_PUNTEN` en `DREMPEL`.
3. **Test live**: open `dupont.html` voor DuPont-validatie of `heatmap.html`
   voor de heatmap-modus. Verwacht resultaat = handmatig narekenen op kleine
   subset van data.
4. **`DOCENTENHANDLEIDING.md`**: voeg uitleg toe in sectie 6 (plenaire
   moment) of 7 (worked example).

---

## 11. Bijlage: didactische literatuur

**Anthony, R. N. (1965).** *Planning and Control Systems: A Framework for
Analysis.* Harvard Business School. — De klassieke management-piramide
(strategisch / management control / operationeel control). Onze werkvorm
**daagt deze piramide uit** door te tonen dat strategisch inzicht juist uit
atomaire data ontstaat.

**Sinek, S. (2011).** *Start with Why: How Great Leaders Inspire Everyone to
Take Action.* Penguin. — Golden Circle (Why-How-What). De WHY/HOW/WHAT-
volgorde in het instructie-paneel van de tool is hierop gebaseerd.

**CRISP-DM** (Cross-Industry Standard Process for Data Mining). 6-stappen-
proces voor data-analyse: Business Understanding → Data Understanding → Data
Preparation → Modeling → Evaluation → Deployment. Onze tijdsblok 3a is bewust
*Data Understanding* — de tweede stap, vóór de modellering.

**Pink, D. H. (2009).** *Drive: The Surprising Truth About What Motivates Us.*
Riverhead Books. — Autonomy / Mastery / Purpose als de drie pilaren van
intrinsieke motivatie. Onze PAMS-architectuur (met Social toegevoegd) bouwt
hierop voort.

**HBO Bedrijfskunde uitstroomprofielen** — zie HBO-raad documentatie. Het
consultant-frame in F5 sluit aan op de mainstream uitstroom-profielen
*bedrijfskundig adviseur* en *business analyst*.

---

## Bijdragen

Heb je dit document gebruikt en zelf casuïstiek of inzichten toe te voegen?
Open een Pull Request op [github.com/hanbedrijfskunde/stuurinformatie](https://github.com/hanbedrijfskunde/stuurinformatie)
of stuur ze door — de handleiding wordt versie na versie rijker met echte
collegial casuïstiek.
