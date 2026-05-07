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
| **1. Intro** | Veel theorie over EnYoi geven | Snel overschakelen naar consultant-frame en drempel |
| **2. Toewijzing** | Studenten laten klagen over hun niveau | Reframe: *"Iedereen krijgt een rol, ook in een echt advies-team"* |
| **3a. Data Understanding** | Ze pushen naar de vragen | Laten exploreren — *"Wat zie je? Wat verbaast je?"* |
| **3b. Vragen beantwoorden** | Antwoorden geven | Vragen stellen: *"Hoe zou je dat aanpakken? Wat heb je nodig?"* |
| **3c. Samenwerking** | Wachten tot het vanzelf gebeurt | Forceren als nodig — zie sectie 5 |
| **4. Dashboard** | Mooi maken | Het moet kloppen — niet mooi |
| **5. Plenair** | Hardlopend door alle slides | Tijd nemen voor de plot twist en twee-routes-discussie |

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
- **Werkkapitaal-cyclus** (DSO, DPO, DSI, CCC) op hoofdlijnen begrijpen
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

> *"Welkom. Vandaag worden jullie ingehuurd door EnYoi ICT Services — een
> Nederlandse IT-dienstverlener uit Leusden. In 2016 maakten ze € 7,3 miljoen
> omzet, maar begonnen het jaar met een eigen vermogen van min € 1,75 miljoen.*
>
> *Jullie werken vandaag voor hen als adviesbureau. Drie niveaus: strategy
> consultant tegen € 250 per uur, management consultant tegen € 150, of
> junior business analyst tegen € 100. Jullie krijgen willekeurig een rol
> toegewezen.*
>
> *Doel: € 3.000 honorarium verdienen door business-vragen van EnYoi te
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
| *"Kunnen we samenwerken?"* | *"Sterker nog: dat moet, anders haal je de € 3.000 niet."* |
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

### 6.3 Identity-reflectie (1 minuut, plenair)

> *"Tot slot — vandaag heb je een rol gespeeld als consultant op één niveau.
> Stak het strategische werk je het meest? Of zou je liever Junior Analyst
> blijven? Of Manager? Reflecteer voor jezelf — over een paar jaar moet je
> deze keuze écht maken."*

**Geef geen antwoord-suggestie**. De vraag werkt alleen als hij open blijft.
Een minuut bezinking. Daarna: huiswerkvraag mee voor de volgende les.

### 6.4 Hoe oogst je leerwinst — concrete vragen om te stellen

Aan het eind, kies 1–2 van deze vragen om plenair te stellen:

- *"Wat heeft je het meest verrast vandaag?"*
- *"Welk inzicht ga je morgen al gebruiken?"*
- *"Welke vraag zou je nog willen kunnen beantwoorden, en welke data zou je
  daarvoor nodig hebben?"*

---

## 7. Uitgewerkte voorbeelden

> Deze sectie wordt aangevuld na het eerste college met echte casuïstiek.
> Hieronder een placeholder met de structuur.

### 7.1 Voorbeeld-sessie: 24 studenten, 8-8-8-verdeling

*[Placeholder — wordt ingevuld na eerste college: minuut-voor-minuut
verloop met aandachtspunten en wat goed/minder goed liep.]*

### 7.2 Voorbeeld-sessie: scheve 12-6-6-verdeling

*[Placeholder — wat te doen als de random toewijzing niet evenredig uitpakt,
of een groep meer studenten heeft dan de twee andere.]*

### 7.3 Voorbeeld plenair gesprek (verbatim transcript)

*[Placeholder — verbatim uitwerking van een typisch nabespreking-gesprek met
studenten-reacties en docent-reacties.]*

### 7.4 Voorbeeld typisch samenwerkings-moment

*[Placeholder — Strategy consultant vraagt Junior Analyst om hulp bij vraag 6
(welke klanten betalen € 534k). Hoe verloopt dat, wat zegt de tool, wat doet
de docent.]*

---

## 8. FAQ — studenten

| Vraag | Antwoord-suggestie |
|---|---|
| *"Waarom random toewijzen? Mag ik niet kiezen?"* | *"Random is deel van het experiment — je leert ook iets door een rol te krijgen die je niet had gekozen. Bovendien: in een echte advies-team kies je ook niet altijd je eigen project."* |
| *"Wat als ik geen PowerBI heb?"* | *"Excel + Power Query werkt ook. Of werk samen met iemand die wél PowerBI heeft."* |
| *"Mijn ZIP downloadt niet, wat nu?"* | *"Probeer een andere browser. Werkt het nog niet? Vraag een buurman om de uitgepakte map te delen."* |
| *"Wat is HHI? Ik begrijp het niet."* | *"Herfindahl-Hirschman Index — meet concentratie. Hoe hoger, hoe meer afhankelijk van weinig partijen. Tussen 0 en 10.000."* |
| *"Mag ik een vraag overslaan?"* | *"Ja. Sla 'm over en kies een andere die je tijd waard is. Je hoeft niet alles te beantwoorden — je hoeft alleen € 3.000 te halen."* |
| *"Klopt mijn antwoord?"* | *"De tool berekent zelf het werkelijke antwoord. Klassificeer eerst, dan zie je hoe je het deed."* |
| *"Mag ik de antwoorden van iemand anders kopiëren?"* | *"Voor cross-niveau-vragen wel — dat is samenwerking. Binnen je eigen niveau leer je niets door te kopiëren."* |
| *"Wat als we de drempel niet halen?"* | *"Dat is OK. Het gaat niet om winnen. Het gaat om wat je leert tijdens het proberen."* |

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

Bovenin `heatmap.html` in de `TARIEVEN` config (in v0.4-implementatie):

```js
const TARIEVEN = {
  's': 250,  // strategy consultant per uur
  't': 150,  // management consultant per uur
  'o': 100   // junior analyst per uur
};
const DREMPEL_FEE = 3000;  // honorarium-doel
```

Pas aan voor andere bedrijven, andere markten of andere ambities.

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
