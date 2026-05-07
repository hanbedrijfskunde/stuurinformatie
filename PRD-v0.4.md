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

### Docent

**D1.** Als docent wil ik een nieuwe CSV-set kunnen inladen zonder de antwoordsleutel
handmatig te bouwen.
> *(Docent-story — niet aan PAMS gekoppeld, maar essentieel voor schaalbaarheid
> en daarmee voorwaarde voor herhaaldelijk PAMS-effect over meerdere colleges.)*

### PAMS-coverage check

| Dimensie | Stories | Gedekt | Implementatie-eisen |
|---|---|:--:|---|
| **Purpose** | S4 | ✓ | Reflectie-vraag aan eind (Idee C); expliciete S/T/O-uitleg (F3.3) |
| **Autonomy** | S2 | ✓ | Punten-zichtbaar-vooraf (F1); volgorde van vragen niet vastgelegd; drempel haalbaar met subset |
| **Mastery** | S1, S5 | ✓ | Live punten-counter; per-vraag uitleg na lock-in; geen straf bij fout |
| **Social** | S3 | ✓ | Cross-niveau-bonus (F1.C3); samenwerkings-mechaniek (F4-Optie-B); drempel onhaalbaar zonder samenwerking (Bijlage A) |

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
- **Purpose vereist expliciete reflectie** — Idee C uit sectie 5 (drie meta-vragen
  na de game) is geen "nice-to-have" maar dé Purpose-aanvulling. Zonder reflectie
  blijft de transfer naar eigen werk impliciet — en dus onzichtbaar.

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

**F3.4** Herverdeling van de 10 vragen voor v0.4:

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

(2 strategisch, 3 tactisch, 5 operationeel — bewust scheef omdat operationele
vragen het laagdrempeligst zijn voor een eerste oefening, en strategische
vragen het meeste gewicht krijgen via complexiteit-punten)

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
| **v0.4.4** | F4-Optie-B — samenwerking via handmatige invoer | 3–4u |
| **v0.4.5** | Polish — ideeën C/D/E + bug-fixes na eerste college | 4–6u |

**Totaal**: ~22–32u werk, gefaseerd over 2–3 sessies.

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
de auto-compute engine vormt het fundament waar F1, F3 en F4 op leunen.

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
| 8 | ja | ja | ja | 1 | 2 | 2 | D direct, A met groupby |
| 9 | ja | ja | ja | 1 | 2 | 2 | D direct (rek 8091), A met filter |
| 10 | ja | ja | nee | 2 | 2 | — | D-aggregatie nodig |

Max punten per niveau:
- Strategisch: 1+1+1+1+1+2 = **6 punten** (uit 6 vragen die ze JA kunnen)
- Tactisch: 1+2+3+1+3+2+2+2 = **16 punten** (uit 8 vragen)
- Operationeel: 1+2+4+3+4+4+3+2+2 = **25 punten** (uit 9 vragen)

Slaagdrempel-suggestie: **20 punten**. Strategisch komt er nooit zonder
samenwerking. Tactisch en Operationeel halen 't met moeite.
