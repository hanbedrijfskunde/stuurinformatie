# PRD v0.4 — Sturing in lagen: Game Mechanics + Auto-Compute + Vraag-taxonomie

**Status:** Draft · **Auteur:** docent + Claude · **Datum:** 2026-05-07
**Voorgaande versie:** v0.3 (random toewijzing, Data Understanding, classificatie-matrix)

---

## 1. Context

In v0.3 staat een werkende klastool. Studenten worden willekeurig toegewezen aan
een managementlaag, downloaden hun dataset, en classificeren 10 vragen
als JA/MISSCHIEN/NEE per kunnen-we-dit-met-onze-data?

Wat ontbreekt om van een **didactische werkvorm** een **leer-game** te maken:

1. **Geen voelbare voortgang** — JA/MISSCHIEN/NEE-classificatie meet of de student
   het *data-probleem* heeft begrepen, maar niet of ze het antwoord *kunnen
   vinden*. Studenten missen de cyclus van *vraag stellen → antwoord vinden →
   beloning*.
2. **Hardcoded antwoorden** — bij een nieuwe dataset (ander bedrijf, ander jaar)
   moet de docent 30 cellen handmatig hertypen. Niet schaalbaar.
3. **Vraag-types impliciet** — de 10 vragen zijn impliciet vooral operationeel.
   Studenten leren niet dat *strategisch/tactisch/operationeel* niet alleen
   over data-toegang gaat maar ook over **soort vraag**.

## 2. Strategische doelen

| Doel | Hoe meet je het? |
|---|---|
| **Samenwerking wordt noodzakelijk, niet optioneel** | Met alleen eigen dataset is de slaagdrempel niet haalbaar |
| **Tool herbruikbaar voor andere bedrijven** | Nieuwe CSV-set droppen in `data/` + zip-jes vervangen = werkt |
| **Vraag-types worden geïnternaliseerd** | Studenten kunnen na de werkvorm zelf een S/T/O-vraag formuleren |
| **Pedagogische coherentie blijft behouden** | CRISP-DM Data Understanding + Sinek's Golden Circle blijven leidend |

## 3. User stories — gekoppeld aan PAMS

Onderwijsuitgangspunten van de docent (zie [`../draaiboek.md`](../draaiboek.md))
zijn vier motivationele dimensies: **Purpose · Autonomy · Mastery · Social**.
Iedere student-story wordt expliciet aan één primaire pijler gekoppeld zodat
implementatie de motivationele lading borgt.

### Studenten

**S1.** Als student wil ik per vraag punten verdienen zodat ik mijn voortgang voel.
> **Mastery** — punten zijn een bevestiging van groei. Een zichtbare voortgangsbalk
> maakt zichtbaar wat anders onzichtbaar zou blijven; growth-mindset-trigger
> zonder competitieve afstraffing.

**S2.** Als student wil ik vooraf zien welke vraag meer punten oplevert, zodat ik
strategisch kan kiezen waar ik energie in steek.
> **Autonomy** — keuze in volgorde en focus. Niet alle vragen hoeven, en de
> student bepaalt zelf de route. Versterkt eigen regie over het leerproces.

**S3.** Als student wil ik bij vragen waar mijn eigen data tekortschiet, kunnen
samenwerken met andere niveaus — en daar bonus-punten voor krijgen.
> **Social** — maakt fysieke interactie tussen studenten noodzakelijk. Geen
> passieve samenwerking ("fijn als je wilt") maar geforceerde dialoog doordat
> de game-mechaniek alleen via cross-niveau-uitwisseling te voltooien is.

**S4.** Als student wil ik na de game herkennen welk soort vraag (S/T/O) bij welke
managementlaag past, ook in mijn eigen stage of werk.
> **Purpose** — koppelt de werkvorm aan persoonlijke ambities en toekomstig werk.
> Studenten zien dat de oefening niet alleen schoolwerk is, maar een vaardigheid
> voor hun professionele leven.

**S5.** Als student wil ik na een fout antwoord begrijpen waaróm mijn classificatie
afweek, zodat ik mijn mentale model bijstel in plaats van mij dom te voelen.
> **Mastery** — growth mindset vereist *fail-safe* feedback: fouten zijn
> leer-momenten, geen oordeel. Antwoord-engine (F2) toont uitleg bij elke
> mismatch tussen classificatie en berekend antwoord.

**S6.** Als student wil ik dat de werkvorm voelt als wat ik later in mijn beroep
ga doen, zodat ik begrijp waarom ik dit leer.
> **Purpose** — de consultant-frame (F5) verbindt de oefening direct met de
> beroepspraktijk waarvoor HBO Bedrijfskunde opleidt. Niet "abstract schoolwerk"
> maar een mini-uitvoering van een echte rol tegen marktconforme voorwaarden.
> Antwoord op de impliciete vraag *"waarom doe ik dit?"*.

### Docent

**D1.** Als docent wil ik een nieuwe CSV-set kunnen inladen zonder de antwoordsleutel
handmatig te bouwen.
> *(Docent-story — niet aan PAMS gekoppeld, maar essentieel voor schaalbaarheid
> en daarmee voorwaarde voor herhaaldelijk PAMS-effect over meerdere colleges.)*

### PAMS-coverage check

| Dimensie | Stories | Gedekt | Versterkt door F5 (consultant-frame) |
|---|---|:--:|---|
| **Purpose** | **S4, S6** | ✓✓ | F5 is **structureel** Purpose-element (zie F5.7): vocational alignment + sense-making + identity formation. Niet game-skin maar identiteits-bridge naar beroepspraktijk |
| **Autonomy** | S2 | ✓ | Hoog-tarief-vragen kiezen vs. veel-laag-tarief-vragen = strategische projectkeuze |
| **Mastery** | S1, S5 | ✓ | Fee in euro is concretere groei-meter dan abstracte punten |
| **Social** | S3 | ✓ | Strategy consultants subcontracten data-analisten = exact het echte consulting-model |

**Aandachtspunten per pijler bij implementatie:**

- **Mastery vereist directe feedback** — de auto-compute engine (F2) moet snel
  antwoord teruggeven, anders vervaagt de mastery-loop. *Risico*: trage CSV-parse
  op zwakke telefoons. *Mitigatie*: parse 1× bij `data-stage`, cache in `localStorage`.
- **Autonomy vereist echte keuze** — als alle vragen verplicht zijn, is er
  geen autonomie. De drempel moet haalbaar zijn met een subset van de 10 vragen
  (zie Bijlage A: max-punten per niveau).
- **Social vereist drempel-incentive** — als je je drempel alleen haalt door
  samen te werken (Bijlage A toont dit), is samenwerking *nodig*, niet optioneel.
  Dit is de fundamentele design-keuze van v0.4.
- **Purpose werkt op twee lagen — structureel én reflectief**:
  - **Structureel** (F5.7 — consultant-frame): Purpose is geweven in het ontwerp
    zelf, niet als losse feature. De student speelt geen werkvorm, maar voert
    een mini-versie van hun toekomstige beroep uit.
  - **Reflectief** (Idee C — meta-vragen na de game): drie reflectie-vragen
    maken de Purpose-ervaring expliciet en transfereerbaar.
  - **Beide nodig**: zonder structurele laag is reflectie leeg ("drie vragen aan
    het eind"). Zonder reflectie verdampt het structurele effect zodra
    studenten de zaal uitlopen.

## 4. Functionele requirements

### F1 — Punten per vraag (gradering naar complexiteit)

**F1.1** Elke vraag heeft een punten-waarde gebaseerd op drie factoren:

| Factor | Waarde |
|---|--:|
| 1 data-bron nodig | 1 |
| 2 data-bronnen nodig | 2 |
| 3+ data-bronnen nodig | 3 |
| 0 koppelingen (single-table query) | +0 |
| 1 koppeling (1 join) | +1 |
| 2+ koppelingen (multi-join) | +2 |
| Volledig oplosbaar binnen eigen niveau | +0 |
| Vereist data uit ander niveau (cross-level) | **+2** |

**F1.2** Punten-totaal = som van punten over correct beantwoorde vragen.

**F1.3** **Slaagdrempel** = circa 70% van max-punten. Met alleen eigen dataset
haalt een student maximaal ~50–60%. Het ontbrekende deel komt alleen via
samenwerking.

**F1.4** Punten zichtbaar tijdens spelen (live counter), drempel zichtbaar als
voortgangsbalk.

### F2 — Auto-compute answer engine

**F2.1** JavaScript-engine die per vraag een antwoord berekent uit de CSVs.

**F2.2** **Architectuur**:

```
data/
  strategisch/
    rekeningschema.csv
    balans.csv
    resultatenrekening.csv
  tactisch/  (zelfde structuur + A_crm + B_inkoop)
  operationeel/  (zelfde structuur + A_crm + B_inkoop + C_bank, geen D)

js/
  data-loader.js   → fetch + parse CSVs (PapaParse via CDN)
  answers.js       → 10 pure functies, één per vraag
```

**F2.3** Per vraag een pure functie:

```js
function vraag1(datasets) {
  // {x: vragend tot omzet 2016}
  if (!datasets.resultatenrekening) {
    return { value: null, reden: 'data ontbreekt — resultatenrekening niet beschikbaar' };
  }
  const omzet = datasets.resultatenrekening
    .filter(r => r.rekening_id.startsWith('8'))
    .reduce((s, r) => s + Math.abs(parseFloat(r.totaal_2016)), 0);
  return { value: omzet, formaat: '€', complexiteit: 1 };
}
```

**F2.4** Functies werken op **standaard-veldnamen** (`klantnummer`,
`factuurdatum`, `bedrag_incl_btw`, etc.). Nieuwe CSVs die dezelfde
kolomstructuur volgen zijn direct compatibel.

**F2.7 Rapport-categorie kolom op `rekeningschema.csv`** (nieuw in v0.4)

Het rekeningschema bevat naast `rekening_id`, `omschrijving` en `type` (Balans
of Resultaat) een vierde kolom `rapport_categorie`. Deze koppelt elke rekening
aan zijn standaard-rapportagepost — vergelijkbaar met de `leadCode` in een
echte XAF-export of het Nederlandse RGS (Referentie GrootboekSchema).

Voorbeelden:

```
rekening_id,omschrijving,type,rapport_categorie
0100,Bedrijfsinventaris,Balans,Vaste activa
0500,Aandelenkapitaal,Balans,Eigen vermogen
1100,Bank,Balans,Liquide middelen
1400,Debiteuren,Balans,Debiteuren
4000,Bruto lonen,Resultaat,Personeelskosten
8100,Omzet Consultancy,Resultaat,Omzet
```

**Waarom**: studenten kunnen nu in PowerBI een visual maken zoals
*"Personeelskosten naar maand"* zonder eerst handmatig 22 rekeningen te
selecteren. Aggregatie wordt declaratief in plaats van expliciet.

**Caveat (geen kasstroom-categorie)**: een `kasstroom_categorie`-kolom is
bewust *niet* toegevoegd. Kasstroom is een afgeleide rapportage (directe
methode op bank-mutaties, of indirecte methode op netto-resultaat +
correcties), niet een eigenschap van een grootboekrekening. Het blijft
afleidings-werk — pedagogisch waardevol.

**Customisatie**: de mapping is een **eenvoudige heuristic** op basis van
rekening-ID-prefixes (0xxx → Vaste activa, 4xxx → Personeelskosten, etc.).
Docenten kunnen deze finetunen in `genereer_datasets.py` voor specifieke
rekeningschema-conventies of casussen.

**F2.5** Bij ontbrekende data: `null` met `reden`.

**F2.6** UI-flow:
- Student classificeert (JA/MISSCHIEN/NEE) → "lock in" voorspelling
- Engine berekent het werkelijke antwoord
- UI toont: jouw classificatie + werkelijk antwoord + jouw punten
- Als jouw classificatie was "NEE" (data ontbreekt) en engine bevestigt → punten
- Als jouw classificatie was "JA" maar engine vindt geen waarde → leer-moment

### F3 — Vraag-taxonomie + uitleg

**F3.1** Elke vraag krijgt label `Strategisch | Tactisch | Operationeel`,
**onafhankelijk** van het toegewezen niveau van de student.

**F3.2** Visueel onderscheid:

| Type | Kleur | Icoon | Karakter |
|---|---|---|---|
| Strategisch | Donkerblauw | Kompas | Existentieel — *Wat bedreigt ons voortbestaan?* |
| Tactisch | Paars | Tandwielen | Optimaliserend — *Wat doet ons beter scoren?* |
| Operationeel | Groen | Sleutel | Procesmatig — *Wat doet ons soepeler draaien?* |

**F3.3** Inleidend uitleg-paneel (uitklapbaar) op de matrix-pagina:

> **Strategische vragen** gaan over het **voortbestaan** en de **richting** van
> de organisatie. Voorbeelden: bedreigingen voor het business model,
> groeistrategieën, marktpositie, kapitaalstructuur, M&A.
>
> **Tactische vragen** gaan over het **optimaliseren** van het huidige business
> model. Voorbeelden: productmix, prijszetting, klantsegmentatie, marges per
> productlijn, werkkapitaal-management.
>
> **Operationele vragen** gaan over het **soepel laten draaien** van de
> processen. Voorbeelden: zorgen dat klanten op tijd betalen, voorraden
> binnen norm houden, foutpercentages, personeelsplanning.
>
> **Belangrijk**: het *type vraag* is iets anders dan het *managementniveau*
> van de vraagsteller. Een operationeel medewerker kan een strategische vraag
> stellen — de vraag is dan strategisch, niet operationeel.

**F3.4** Herverdeling van de **11 vragen** voor v0.4:

| # | Huidige formulering (deel) | Type |
|--:|---|:--:|
| 1 | Wat was onze totale omzet 2016? | Operationeel |
| 2 | Wie zijn onze top-10 klanten? | Tactisch |
| 3 | Wat is de verdeling van betaaltermijnen? | Operationeel |
| 4 | Wat is de klantconcentratie (HHI)? | **Strategisch** |
| 5 | Hoeveel staat er aan debiteuren open? | Operationeel |
| 6 | Welke klanten moeten samen € 534k betalen? | Operationeel |
| 7 | BTW + loonheffing aan Belastingdienst? | Operationeel |
| 8 | Omzet per businesslijn (consultancy/hardware/cursus)? | Tactisch |
| 9 | Percentage recurring abonnementen-omzet? | **Strategisch** |
| 10 | Wat is ons EBIT-resultaat? | Tactisch |
| **11** | **Wat is onze productconcentratie (HHI)?** | **Strategisch** |

(3 strategisch, 3 tactisch, 5 operationeel — bewust scheef omdat operationele
vragen het laagdrempeligst zijn voor een eerste oefening, en strategische
vragen het meeste gewicht krijgen via complexiteit-punten)

**F3.5 Twee-routes-discussie (cruciaal didactisch moment in v0.4)**

Voor minstens twee vragen — **vraag 8 (omzet per businesslijn)** en **vraag 11
(productconcentratie)** — bestaan **twee geldige berekenroutes** die
**verschillende getallen** opleveren:

| Route | Bron | Granulariteit | Voorbeeld HHI bij Vento ICT |
|---|---|--:|--:|
| Via **businesslijn** | `verkoopfacturen.csv` group by `businesslijn` | 5 buckets | **5.190** |
| Via **omzetrekening** | `resultatenrekening.csv` + `rekeningschema.csv` (join) | 11 buckets | **4.909** |

Beide kloppen. Het verschil ontstaat doordat **HHI gevoelig is voor het aantal
buckets** — fewer buckets, larger relative shares, higher HHI. Dat is geen
fout, maar een fundamenteel kenmerk van concentratie-metingen.

**De drie niveaus komen tot verschillende getallen**:
- **Strategisch** (alleen D): kan alleen via omzetrekening → HHI 4.909
- **Operationeel** (alleen A): kan alleen via businesslijn → HHI 5.190
- **Tactisch** (A + D): kan beide en kan ze vergelijken

**Plenair moment** (in tijdsblok 5 of 3c):

1. Docent vraagt elke groep: *"Wat is jullie HHI?"*
2. Verschillende getallen verschijnen
3. *"Wie heeft gelijk?"* → discussie ontstaat
4. *"Beiden. Want jullie meten een ander ding — Strategisch ziet 11 productlijnen, Operationeel ziet 5 businesslijnen."*
5. *"Welke is de echte HHI? — er is geen 'echte'. Er is alleen een HHI per gekozen indeling."*

**Drie didactische take-aways** die hier landen:

1. **Aggregatieniveau is een keuze, geen feit** — vraag bij elk getal: *"hoe gedefinieerd?"*
2. **Verschillende rapporten geven verschillende getallen door methodologie, niet door fouten** — onderzoek het verschil, niet de "fout"
3. **Beslissingen op verschillende managementniveaus vereisen verschillende aggregaties** — bestuur grof (M&A), product-management fijn (portfolio), operatie per-SKU

> **Pedagogisch gewicht**: dit moment landt **conceptueel naast de plot twist
> over marges**. Beide gaan over: *"hetzelfde bedrijf, verschillende verhalen,
> allemaal waar."*

### F5 — Consultant-frame (rol + verdienmodel)

De student wordt geplaatst in de rol van **bedrijfskundig adviseur**, ingehuurd
door Vento ICT om op een specifiek niveau business-vragen te beantwoorden. Punten
uit F1 vertalen naar **uren × uurtarief = honorarium (fee)**.

**F5.1 Uurtarief per niveau** (marktconform, vastgesteld voor v0.4):

| Niveau | Persona | Uurtarief |
|---|---|--:|
| Strategisch | Strategy consultant / Senior advisor | **€ 250** |
| Tactisch | Management consultant | **€ 150** |
| Operationeel | Junior business analyst | **€ 100** |

**F5.2 Uren-conversie**: 1 complexiteits-punt uit F1 = 1 declarabel uur.

**F5.3 Fee-berekening**:
```
fee_per_vraag = uren × uurtarief_van_jouw_niveau
totaal_fee    = som over alle correct voltooide vragen
```

**F5.4 Slaagdrempel als fee-doel**: bijvoorbeeld **€ 3.000 honorarium**. De
drempel is bewust zo gekozen dat geen enkel niveau het alleen kan halen
(zie aangepaste Bijlage A).

**F5.5 UI-elementen**:
- **Rolkaart-uitbreiding** op landing: *"Welkom — Vento ICT heeft je ingehuurd als
  [Strategy / Management / Junior] consultant tegen € [tarief]/u. Verdien
  minimaal € 3.000 honorarium om de opdracht succesvol af te ronden."*
- **Fee-meter** in matrix-header (naast voortgangsbalk): *"€ 1.250 verdiend ·
  doel € 3.000 · 12,5 uren gewerkt"*
- **Per-vraag indicator**: kleine euro-prijs op iedere cel (*"4u × €100 = €400"*)

**F5.6 Stakeholder-framing per vraag** (sluit aan op Idee B uit sectie 5):
elke vraag wordt geformuleerd als verzoek van een client-stakeholder, bijv.
*"De CFO wil voor de board-meeting weten of onze top-10 klanten 80% van de
omzet leveren. Hoeveel kost het je om dit antwoord op te leveren?"*

**F5.7 Purpose-koppeling — beroepsrol als didactische motor**

De consultant-frame is geen *cosmetische gamification-laag* maar een
**identiteits-bridge** tussen het curriculum en de beroepspraktijk waarvoor
de opleiding voorbereidt. Door studenten in een professionele rol te plaatsen
mét een echte fee (marktconform tarief × declarabele uren), wordt de werkvorm
betekenis-rijk op drie niveaus:

**1. Vocational alignment** — HBO Bedrijfskunde is een **beroepsopleiding**,
geen academische opleiding. Een werkvorm die de directe beroepspraktijk
simuleert (rol + tarief + client-opdracht + deliverable) sluit fundamenteel
beter aan bij het opleidings-DNA dan een werkvorm met abstracte
data-classificatie. De student doet niet "schoolwerk" maar oefent het werk
zelf — onder *gecontroleerde* condities.

**2. Sense-making** — de onderhuidse vraag *"Waarom leer ik dit?"* die in
elke onderwijssessie meeluistert, wordt door de consultant-frame *expliciet*
beantwoord. Het antwoord is niet *"omdat het in het curriculum staat"* maar
*"omdat dit is wat je straks doet, en hier oefen je het tegen marktconforme
voorwaarden"*. Die directe koppeling tussen leeractiviteit en beroepsrealiteit
verhoogt intrinsieke motivatie meer dan welke gamification-laag ook.

**3. Identity formation** — in de psychologie van early-career professionals
gaat ontwikkeling niet alleen over kennis-verwerving maar over
**identiteits-vorming**: *Wie ben ik als professional? Welke rol past bij mij?*.
Door studenten tijdens de werkvorm één van drie consultant-niveaus te laten
ervaren (en bij "Begin opnieuw" mogelijk een ander niveau te krijgen), ontstaat
een mini-replica van het carrière-keuze-proces dat ze in hun stage en eerste
baan zullen doorlopen. *"Voelde strategisch werk goed? Of was operationeel
juist energieker?"* — dat soort zelf-reflectie is een Purpose-vraag, geen
Mastery-vraag.

> **Implicatie voor het ontwerp**: F5 is daarmee geen *nice-to-have*-laag
> bovenop de game, maar **structureel onderdeel van het pedagogische ontwerp**.
> Zonder F5 is de werkvorm een vingeroefening in data-analyse; mét F5 is het
> een professionele voorbereiding waarin studenten niet alleen leren *wat te
> doen* maar ook *wie te zijn*.

### F6 — Uitgebreide docentenhandleiding

Naast het bestaande **draaiboek** (45-min lesson plan: *wat en wanneer*) komt
een **docentenhandleiding** met de *waarom en hoe* — voor docenten die de
werkvorm willen overnemen of in eigen context aanpassen.

**Verschil met draaiboek:**

| Document | Doel | Vorm |
|---|---|---|
| `draaiboek.md` | Lesson plan voor één college | 45-min schedule met fase-indeling |
| `DOCENTENHANDLEIDING.md` | Comprehensive guide voor *meerdere* docenten | Didactische context, scenario's, voorbeelden, troubleshooting |

**Locatie**: [`platform/DOCENTENHANDLEIDING.md`](DOCENTENHANDLEIDING.md) —
publiek meegepushed naar GH Pages zodat andere HBO-docenten het kunnen vinden,
hergebruiken en bijdragen.

**Beoogde structuur** (11 secties):

**F6.1 Didactische uitgangspunten** — voor docenten die de werkvorm overnemen:
- PAMS-architectuur per pijler (waar zit Purpose, Autonomy, Mastery, Social in elk fase?)
- CRISP-DM Data Understanding-frame als didactische ruggengraat
- Consultant-frame als identity-bridge naar beroepspraktijk
- Drie didactische aandachtspunten per fase

**F6.2 Competenties en skills voor de docent**:
- 4 categorieën: domein-kennis, tool-vaardigheden, didactische competenties, soft skills
- Per categorie: *wat je moet kunnen* + *aanvullen waar nodig* (bronnen-tabellen)
- Specifieke oefen-vaardigheden voor déze werkvorm (HHI in 1 minuut, PowerBI-import, 3-seconden-stilte)
- Zelf-evaluatie: ben ik klaar? (3 indicatoren met voorgestelde bijscholing)
- Wanneer mede-begeleider waardevol is

**F6.3 Voorbereiding (uitgebreid)**:
- Vooraankondiging aan studenten — PowerBI-installatie, laptop meebrengen
- Mentale voorbereiding docent — drie momenten die niet gemist mogen worden
- Materialen-checklist (digitaal én hybride backup)
- Trouble-shooting vooraf (wifi-test, fallback-paden)

**F6.4 Uitleg en introductie**:
- Hoe je casus + consultant-frame in 5 minuten introduceert
- Veelgestelde studenten-vragen + antwoord-suggesties
- Wat te doen als studenten zich verzetten tegen de rol-toewijzing

**F6.5 Begeleiding tijdens de game**:
- Wat te doen als studenten vastlopen op data-understanding
- Wanneer in te grijpen, wanneer te laten gaan
- Concrete escalatie-scenarios (groep wil alleen werken, weigert samenwerking,
  of komt al bij € 3.000 zonder cross-niveau-samenwerking)
- Hoe samenwerking te *forceren* als die niet vanzelf ontstaat

**F6.6 Nabespreking — het plenaire moment uitgewerkt**:
- Plot twist over marges (al in draaiboek)
- Twee-routes-discussie (HHI 5.190 vs. 4.909) — wanneer en hoe
- Identity-reflectie (welk niveau voelde goed?) — open of besloten?
- Hoe je leerwinst oogst — concrete vragen om te stellen

**F6.7 Uitgewerkte voorbeelden** (verbatim casuïstiek):
- Voorbeeld-sessie met 24 studenten, 8-8-8-verdeling — verloop minuut-voor-minuut
- Voorbeeld met scheve 12-6-6-verdeling — wat te doen
- Voorbeeld plenair gesprek (verbatim transcript wat docent zegt en welke reacties komen)
- Voorbeeld typisch samenwerkings-moment (Strategy zoekt Operationeel)

**F6.8 FAQ van studenten** (met antwoord-suggesties):
- *"Waarom willekeurig? Mag ik niet kiezen?"* → Autonomy-uitleg
- *"Wat als ik geen PowerBI heb?"* → fallback Excel + Power Query
- *"Mijn ZIP downloadt niet"* → debug-stappen
- *"Wat is HHI?"* → 1-min uitleg
- *"Mag ik vraag overslaan?"* → strategie-keuze, niet gokken

**F6.9 Troubleshooting voor docent**:
- Klas is stil → forceer-mechanismen
- Drempel niet haalbaar binnen tijd → tarieven aanpassen via config
- PowerBI-import faalt op meerdere apparaten → groeps-import via één laptop
- Wifi-uitval → analoge fallback (printables)

**F6.10 Customisatie voor andere casussen**:
- Vervang CSV-data (zelfde kolomnamen, andere getallen)
- Pas vragen aan in `heatmap.html` (`VRAGEN` array)
- Pas tarieven en drempel aan via config-block bovenaan script
- Verschillende casussen voor verschillende cohort-niveaus

**F6.11 Bijlage: didactische literatuur**:
- Anthony (1965) — management-piramide
- Sinek (Golden Circle) — Why-How-What
- CRISP-DM (Cross-Industry Standard Process for Data Mining)
- Pink (Drive) — autonomy/mastery/purpose
- HBO Bedrijfskunde uitstroomprofielen (DUO/HBO-raad)

**F6 — implementatie-keuze**: schrijven als één markdown-document met heldere
TOC, hyperlinks naar relevante secties van het draaiboek en PRD. Geschat 30–50
A4 pagina's bij volledige uitwerking — opgebouwd over meerdere iteraties na
het eerste college.

> **Pedagogische winst voor docenten**: dit document maakt de werkvorm
> *uitvoerbaar door anderen* zonder dat ze de hele PRD hoeven te lezen. Andere
> HBO-Bedrijfskunde-docenten kunnen het college zelf draaien zonder met jou
> te overleggen — schaalbaarheid van pedagogische impact.

### F4 — Samenwerkings-mechaniek (cross-level)

Drie ontwerp-opties:

| Optie | Hoe | Pro | Con |
|---|---|---|---|
| **A** Volledig analoog | Studenten roepen plenair, docent activeert "samenwerkings-modus" | Statisch blijft, geen tech-overhead | Stille klassen falen |
| **B** Per-device met handmatige invoer | Bij ontbrekende data toont tool: *"Vraag een Operationele student de data — vul hier hun antwoord in"* | Verbaal moment expliciet, geen sync nodig | Vertrouwen op zelf-rapportage |
| **C** Full sync via Firebase | Studenten zien elkaars antwoorden live | Maximaal interactief | Niet meer 100% statisch, complexer |

**Aanbeveling**: **Optie B**. Houdt v0.4 binnen GH Pages-architectuur, dwingt
expliciete dialoog tussen groepen, en docent kan via verbaal meeluisteren wat
studenten elkaar leren.

## 5. Aanvullende ideeën (voor discussie)

### A — Data lineage hint per vraag

Bij elke vraag een klein onderschrift: *"Voor dit antwoord nodig:
verkoopfacturen ⊕ bankmutaties (match op factuurnummer)"*. Geen spoiler — een
data-architectuur-trainings-hint.

### B — Stakeholder-frame

Frame elke vraag als verzoek van een stakeholder: *"De bank wil een 5-min cash-update."*
Maakt complexiteit voelbaar via persona en urgentie. Past bij Sinek's
Golden Circle (waarom is deze vraag nu belangrijk).

### C — Reflectie na de game

Drie meta-vragen na het halen van de drempel:

1. Welk vraag-type was lastigst voor jou? Waarom?
2. Welke samenwerking leverde het meeste op?
3. In je stage of toekomstige werk: op welk niveau zit jij? Hoe weet je dat?

### D — Replay-modus voor docent

Aan het eind van het college laat de docent zien wélke samenwerkings-momenten
ontstonden: *"Operationeel had data voor vraag 6, maar Strategisch had het
besluit nodig — wat zagen we gebeuren?"* Vereist dat samenwerkings-events
worden gelogd in localStorage.

### E — Subtle progress indicator i.p.v. expliciete leaderboard

Geen klassikaal leaderboard (botst met Social-pijler en kan competitief worden).
Wel een persoonlijke voortgangsbalk per student plus een **groepsbalk** (alle
studenten van jouw niveau samen). Maakt samenwerking binnen-niveau visueel én
versterkt collectieve mastery.

## 6. Non-functional requirements

- **Static-only**: blijft GH Pages-compatible (geen backend, geen DB)
- **Geen accounts**: localStorage per device blijft de identiteit
- **Mobile-first**: alles moet werken op telefoonschermen ≥320px
- **Toegankelijkheid**: WCAG AA voor kleur-contrast (vooral cell-kleuren) en
  knop-grootte (≥44×44px voor touch)
- **Laadtijd**: < 2 sec op 4G voor de matrix-pagina
- **Offline-tolerant**: na eerste laden moet de basisflow werken zonder netwerk
  (CDN-bundles in localStorage cachen of bundelen)

## 7. Open vragen voor docent

1. **Slaagdrempel** — 70% van max? 60%? Dynamisch?
2. **Punten direct of pas aan eind tonen?** — Direct geeft feedback maar kan
   focus van inhoud naar score verschuiven.
3. **Mogen studenten meerdere keren proberen?** — Ja: leerproces. Nee: focus.
4. **Samenwerkings-optie A, B of C?** — Mijn advies: B.
5. **Behoud van CRISP-DM Data Understanding-frame?** — Past dat bij de
   game-mechaniek of vervangen we het door een game-opening?
6. **Eindbeoordeling: punten leiden tot een waardering?** — *Bronzen, zilveren,
   gouden adviseur*? Of binair *gehaald / niet gehaald*?

## 8. Buiten scope (v0.4)

- Multi-tenant (meerdere docenten op één deployment)
- Integratie met LMS (Brightspace, Moodle, Canvas)
- Persistentie tussen colleges
- Eindbeoordeling/cijferregistratie
- Multi-language (alleen NL)

## 9. Roadmap-fasering

| Fase | Wat | Geschatte effort |
|---|---|--:|
| **v0.4.1** | F2 — auto-compute engine + answer-functions per vraag | 8–12u |
| **v0.4.2** | F3 — vraag-taxonomie + uitleg-paneel + visuele onderscheiding | 3–4u |
| **v0.4.3** | F1 — punten-mechaniek + voortgangsbalk + slaagdrempel | 4–6u |
| **v0.4.4** | F5 — consultant-frame: tarief, uren, fee-meter, rolkaart | 3–5u |
| **v0.4.5** | F4-Optie-B — samenwerking via handmatige invoer | 3–4u |
| **v0.4.6** | Polish — ideeën C/D/E + bug-fixes na eerste college | 4–6u |
| **v0.4.7** | F6 — Docentenhandleiding (uitgebreide guide voor andere docenten) | 6–10u |

**Totaal**: ~31–47u werk, gefaseerd over 3–4 sessies.

> F6 (docentenhandleiding) komt **na** het eerste college bewust — pas dan
> heb je echte casuïstiek en troubleshooting-data om in F6.6 (uitgewerkte
> voorbeelden) en F6.8 (troubleshooting) op te nemen. Een handleiding
> geschreven *voor* het eerste college mist de echte ervaring.

> F5 (consultant-frame) komt bewust *na* F1 omdat de fee-berekening leunt op de
> punten-engine. Maar F5 voelt voor studenten als de hoofdfeature — overweeg
> visuele framing-elementen al vroeg te tonen (bijv. uurtarief op de rolkaart
> vanaf v0.4.2).

## 10. Risico's en mitigaties

| Risico | Mitigatie |
|---|---|
| F2 answer-engine bevat bugs die studenten misleiden | Per-vraag unit tests; antwoord-validatie tegen de v0.3 hardcoded matrix als regressie-vangnet |
| F1 punten-balans te makkelijk/moeilijk | Iteratie na 1–2 colleges; punten-waarden in één configuratie-array zodat tweaken triviaal is |
| F4 samenwerkings-mechaniek faalt in stille klas | Docent heeft "trigger samenwerking"-knop in `?docent`-modus die studenten dwingt te interageren |
| Vraag-types verwarrend (S/T/O van vraag vs van student) | Sterke F3.3-uitleg + visueel onderscheid + plenaire 30-sec uitleg vóór tijdsblok 3 |
| Antwoorden zichtbaar maken vermindert het "denkwerk" | F2.6: classificatie *eerst*, dan pas antwoord. Anti-spoiler-flow.

## 11. Volgende stap

Dit PRD bespreken, prioriteiten vaststellen, en starten met **v0.4.1 (F2)** —
de auto-compute engine vormt het fundament waar F1, F3, F4 en F5 op leunen.

## 12. Implementation Checklist

### Pre-implementation — docent-akkoord vereist

- [ ] Slaagdrempel vastgesteld (suggestie: **€ 3.000 honorarium**)
- [ ] Uurtarieven per niveau bevestigd (S=€250 · T=€150 · O=€100)
- [ ] Samenwerkings-optie A/B/C gekozen (advies: **B**)
- [ ] Punten-feedback timing (advies: **direct + voortgangsbalk**)
- [ ] Multiple attempts toestaan (advies: **ja** — leerproces voorop)
- [ ] CRISP-DM Data-Understanding-frame behouden (advies: **ja**)
- [ ] Eindwaardering binair vs. gradiënt — bronzen/zilveren/gouden adviseur?

### v0.4.1 — Auto-compute engine (F2)

- [ ] CSV-loader via `fetch()` + PapaParse via CDN toegevoegd
- [ ] Parse-resultaat gecached in `localStorage` na eerste laden (perf)
- [ ] **11** answer-functions geschreven (één per `VRAGEN`-entry, incl. vraag 11 productconcentratie)
- [ ] Standaard-veldnamen contract gedocumenteerd (`klantnummer`, `factuurdatum`, …)
- [ ] Per functie: ontbrekende-data fallback met `{ value: null, reden: '…' }`
- [ ] **Twee-routes-vragen** (8 en 11) berekenen *beide* uitkomsten en tonen ze naast elkaar bij feedback
- [ ] Unit tests tegen huidige hardcoded `ANTWOORDEN` als regressie-vangnet
- [ ] Integratie in heatmap.html matrix-fase (cell-click toont berekend antwoord)
- [ ] Mismatch-uitleg (S5) bij elke verkeerde classificatie
- [ ] **Rapport_categorie-kolom** in `rekeningschema.csv` beschikbaar voor aggregatie (zie F2.7)

### v0.4.2 — Vraag-taxonomie (F3)

- [ ] 3 categorieën met kleur + icoon (kompas / tandwielen / sleutel)
- [ ] Uitleg-paneel uitklapbaar bovenaan matrix met S/T/O-definities
- [ ] 10 vragen herverdeeld per F3.4 (2 strategisch · 3 tactisch · 5 operationeel)
- [ ] Visuele markering per vraag in matrix (icoon naast nummer)
- [ ] Plenaire 30-sec uitleg toegevoegd aan draaiboek tijdsblok 3a

### v0.4.3 — Punten-mechaniek (F1)

- [ ] Complexiteit-tabel per vraag in `js/complexity.js` (datasets × joins × cross-niveau)
- [ ] Live punten-counter in matrix-header
- [ ] Voortgangsbalk met drempel-doel
- [ ] localStorage: `state.points` + `state.completedQuestions`
- [ ] Configuratie-array `POINTS_CONFIG` zodat tweaken triviaal is

### v0.4.4 — Consultant-frame (F5)

- [ ] Rolkaart op landing uitgebreid met persona + uurtarief + opdracht
- [ ] `TARIEVEN`-config met euro-bedrag per niveau
- [ ] Fee-meter naast voortgangsbalk in matrix-header
- [ ] Fee-display per vraag in matrix-cellen (*"4u × €100 = €400"*)
- [ ] Stakeholder-frame per vraag (Idee B): client-persona + verzoek
- [ ] Slot-bericht bij drempel-bereiken: *"Opdracht voltooid — fee € X verdiend"*

### v0.4.5 — Samenwerkings-mechaniek (F4 — Optie B)

- [ ] *"Vraag een [niveau]-consultant"*-knop bij ontbrekende data
- [ ] Manuele invoer-veld voor antwoord-van-collega
- [ ] +2 uren cross-niveau bonus toegekend bij invoer
- [ ] Logging in `localStorage`: wie hielp wie (voor docent-replay)
- [ ] Anti-cheat-check: eenvoudige plausibiliteit (bijv. tegen berekend antwoord)

### v0.4.6 — Polish

- [ ] Idee C — drie reflectie-vragen na drempel-bereiken
- [ ] Idee D — replay-modus voor docent (samenwerkings-events)
- [ ] Idee E — groepsbalk per niveau (collectieve mastery)
- [ ] Bug-log na eerste college doornemen
- [ ] Punten/tarief-balans her-kalibreren indien nodig

### v0.4.7 — Docentenhandleiding (F6)

- [ ] `DOCENTENHANDLEIDING.md` scaffold met TOC en sectie-headers (F6.1–F6.10)
- [ ] F6.1 Didactische uitgangspunten — uitgewerkt
- [ ] F6.2 Competenties en skills voor de docent — uitgewerkt incl. bronnen voor zelf-aanvulling
- [ ] F6.4 Voorbereiding (uitgebreid) — uitgewerkt incl. troubleshooting
- [ ] F6.4 Uitleg en introductie — incl. veelgestelde studentenvragen
- [ ] F6.5 Begeleiding tijdens game — escalatie-scenarios
- [ ] F6.6 Nabespreking uitgewerkt — verbatim plenair-momenten
- [ ] F6.7 Uitgewerkte voorbeelden — minimaal 2 sessie-casuïstieken
- [ ] F6.8 FAQ studenten — 8–10 meest voorkomende vragen
- [ ] F6.9 Troubleshooting docent — wifi, PowerBI, drempel
- [ ] F6.10 Customisatie voor andere casussen
- [ ] F6.11 Bijlage: didactische literatuur (Anthony, Sinek, CRISP-DM, Pink)
- [ ] Cross-links naar `draaiboek.md` en `PRD-v0.4.md` actief

### Pre-launch — testing

- [ ] Test op iPhone Safari + Android Chrome (mobile-first)
- [ ] Test alle drie de niveaus solo → kun je drempel halen? (zou **nee** moeten zijn)
- [ ] Test met mock-samenwerking → kun je drempel halen? (zou **ja** moeten zijn)
- [ ] Test docent-modus + antwoordsleutel-toggle
- [ ] Test offline (na eerste laden, wifi uit)
- [ ] Test op slecht 3G-netwerk
- [ ] Plenaire dry-run met 1-2 student-vrijwilligers
- [ ] PAMS-coverage achteraf verifiëren — voelt elke pijler opgenomen?

### Post-launch — iteratie

- [ ] Eerste college: feedback verzamelen via reflectievragen (Idee C)
- [ ] Slaagdrempel her-kalibreren na 1-2 sessies indien nodig
- [ ] Bug-log bijhouden in GitHub Issues
- [ ] v0.5 backlog opbouwen — wat ontbreekt nog?
- [ ] Eventueel: andere casus-CSV-set toevoegen (test schaalbaarheid)

---

**Bijlage A — Mapping huidige hardcoded ANTWOORDEN naar nieuwe punten**

| # | S | T | O | Punten S | Punten T | Punten O | Notities |
|--:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| 1 | ja | ja | ja | 1 | 1 | 1 | Single-table, geen join |
| 2 | nee | ja | ja | — | 2 | 2 | A_crm + groupby |
| 3 | nee | nee | ja | — | — | 4 | A+C, factuurnr-join |
| 4 | nee | ja | ja | — | 3 | 3 | A_crm + HHI-berekening |
| 5 | ja | ja | misschien | 1 | 1 | 4 | D direct, of A+C reconstructie |
| 6 | nee | nee | ja | — | — | 4 | A+C, niet uit D |
| 7 | nee | ja | ja | — | 3 | 3 | B + sourceID-filter |
| 8 | ja | ja | ja | 1 | 2 | 2 | D direct, A met groupby — **twee routes met andere getallen** |
| 9 | ja | ja | ja | 1 | 2 | 2 | D direct (rek 8091), A met filter |
| 10 | ja | ja | nee | 2 | 2 | — | D-aggregatie nodig |
| **11** | **ja** | **ja** | **ja** | **2** | **2** | **1** | Productconcentratie — **twee routes**: D (omzetrekening, 11 buckets, HHI=4.909) of A (businesslijn, 5 buckets, HHI=5.190) |

**Max punten = max uren** per niveau (alleen werkend, **incl. vraag 11**):

| Niveau | Vragen oplosbaar | Max uren | Tarief | **Max fee solo** |
|---|--:|--:|--:|--:|
| Strategisch | 7 | 8 | € 250 | **€ 2.000** |
| Tactisch | 9 | 18 | € 150 | **€ 2.700** |
| Operationeel | 10 | 26 | € 100 | **€ 2.600** |

**Slaagdrempel-suggestie: € 3.000 honorarium**. Geen enkel niveau haalt dit
zelfstandig:
- Strategisch komt **€ 1.000 tekort** → móét samenwerken
- Tactisch komt **€ 300 tekort** → moet beperkt samenwerken
- Operationeel komt **€ 400 tekort** → moet beperkt samenwerken

(Vraag 11 verkleint het tekort voor alle drie niveaus iets — de drempel
blijft onhaalbaar zonder samenwerking, maar de marge wordt smaller. Bij
implementatie eventueel drempel verhogen naar **€ 3.500** om dezelfde
samenwerkings-druk te behouden.)

Cross-niveau bonus (+2 uren per question): bij elke samenwerking levert de extra
coördinatie-tijd je tarief × 2 extra op. Strategisch profiteert hier het meest van
(€ 500 per samenwerking) — wat reflecteert dat coördinatie-werk in de senior-rol
hoger gewaardeerd wordt.
