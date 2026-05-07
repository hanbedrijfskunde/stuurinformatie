// engine.js — Auto-compute engine voor de heatmap (v0.5)
//
// Bevat:
//   1. CSV-loader die per niveau de juiste datasets laadt en cached in
//      localStorage.
//   2. Elf answer-functies (1-11) die op basis van geladen datasets een
//      antwoord berekenen.
//   3. Audit trail (steps[]) per antwoord — toont elke berekenstap met
//      tussenresultaat. (v0.5 ontwerp B)
//   4. Validatie-metadata voor twee-routes-vragen (8, 11) en DPO-mismatch
//      (vraag 3) — toont match/mismatch en interpretatie. (v0.5 ontwerp A)
//   5. Helper-functies voor formattering en aggregatie.
//
// Gebruik:
//   await engine.loadDatasets('s');   // 's' | 't' | 'o' | 'docent'
//   const answer = engine.computeAnswer(0);  // index 0 = vraag 1
//
// Vereist Papa Parse via CDN (script-tag in heatmap.html).
// LET OP: lokaal testen vereist een server (python3 -m http.server) — fetch()
// werkt niet op file:// protocol.

(function (global) {
  'use strict';

  // === Pad-configuratie ===

  const DATASET_PATHS = {
    klanten:            'data/csv/A_crm/klanten.csv',
    verkoopfacturen:    'data/csv/A_crm/verkoopfacturen.csv',
    leveranciers:       'data/csv/B_inkoop/leveranciers.csv',
    inkoopfacturen:     'data/csv/B_inkoop/inkoopfacturen.csv',
    bankmutaties:       'data/csv/C_bank/bankmutaties.csv',
    rekeningschema:     'data/csv/D_grootboek/rekeningschema.csv',
    balans_eindstand:   'data/csv/D_grootboek/balans_eindstand.csv',
    resultatenrekening: 'data/csv/D_grootboek/resultatenrekening.csv',
  };

  const NIVEAU_DATASETS = {
    's': ['rekeningschema', 'balans_eindstand', 'resultatenrekening'],
    't': ['klanten', 'verkoopfacturen', 'leveranciers', 'inkoopfacturen',
          'rekeningschema', 'balans_eindstand', 'resultatenrekening'],
    'o': ['klanten', 'verkoopfacturen', 'leveranciers', 'inkoopfacturen', 'bankmutaties'],
  };

  const datasets = {};

  // === CSV-loader ===

  async function loadDatasets(niveau) {
    const cacheKey = `heatmap-data-${niveau}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        Object.assign(datasets, parsed);
        return;
      }
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }

    const tables = niveau === 'docent'
      ? Object.keys(DATASET_PATHS)
      : (NIVEAU_DATASETS[niveau] || []);

    if (typeof Papa === 'undefined') {
      console.error('PapaParse niet geladen — voeg toe als <script>');
      return;
    }

    await Promise.all(tables.map(async (table) => {
      try {
        const response = await fetch(DATASET_PATHS[table]);
        if (!response.ok) throw new Error(`HTTP ${response.status} voor ${DATASET_PATHS[table]}`);
        const text = await response.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        datasets[table] = result.data;
      } catch (err) {
        console.error(`Fout bij laden van ${table}:`, err);
        datasets[table] = [];
      }
    }));

    try {
      localStorage.setItem(cacheKey, JSON.stringify(datasets));
    } catch (e) {
      console.warn('localStorage cache failed:', e);
    }
  }

  // === Helpers ===

  function num(v) {
    if (v === undefined || v === null || v === '') return 0;
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  function fmtEuro(n) {
    return '€ ' + Math.round(n).toLocaleString('nl-NL');
  }

  function fmtNum(n, decimals) {
    return Number(n).toLocaleString('nl-NL', {
      minimumFractionDigits: decimals || 0,
      maximumFractionDigits: decimals || 0,
    });
  }

  function fmtPct(n, decimals) {
    return Number(n).toLocaleString('nl-NL', {
      minimumFractionDigits: decimals === undefined ? 1 : decimals,
      maximumFractionDigits: decimals === undefined ? 1 : decimals,
    }) + '%';
  }

  function hhi(waarden) {
    const totaal = waarden.reduce((a, b) => a + b, 0);
    if (totaal === 0) return 0;
    return waarden.reduce((s, w) => s + Math.pow(w / totaal * 100, 2), 0);
  }

  // === Financiële aggregaten (gedeeld door v12-v15 + DuPont) ===
  //
  // Tekenconventie AFAS-balans/V&W:
  //   - Balans: debet-saldi positief, credit-saldi negatief
  //   - Resultatenrekening: omzet (8xxx) credit → negatief in totaal_2016 → ABS()
  //                         kosten (3xxx-7xxx, 9xxx) debet → positief
  //   - Eigen vermogen-rekeningen 05xx-06xx zijn credit-accounts; positieve
  //     waarde = verlies-saldo aan debetzijde = NEGATIEF EV semantisch.

  function aggregeerOmzet(d) {
    if (!d.resultatenrekening) return null;
    return d.resultatenrekening
      .filter(r => r.rekening_id && r.rekening_id.startsWith('8') && r.rekening_id !== '8800')
      .reduce((s, r) => s + Math.abs(num(r.totaal_2016)), 0);
  }

  function aggregeerNI(d) {
    if (!d.resultatenrekening) return null;
    let omzet = 0, kosten = 0;
    for (const r of d.resultatenrekening) {
      const rid = r.rekening_id || '';
      const v = num(r.totaal_2016);
      if (rid.startsWith('8') && rid !== '8800') omzet += Math.abs(v);
      else kosten += v;  // alle overige rekeningen tellen als kosten/baten
    }
    return omzet - kosten;
  }

  function aggregeerCOGS(d) {
    if (!d.resultatenrekening) return null;
    // Inkoopkosten = rek 7xxx (handelsinkoop / direct material)
    return d.resultatenrekening
      .filter(r => r.rekening_id && r.rekening_id.startsWith('7'))
      .reduce((s, r) => s + num(r.totaal_2016), 0);
  }

  function aggregeerActiva(d) {
    if (!d.balans_eindstand) return null;
    // Activa = som debet-saldi op vaste activa (0xxx, excl afschrijvingen 02xx en EV 05xx-06xx),
    // voorraden (30xx), liquide middelen (10xx-12xx), debiteuren (14xx),
    // te vorderen belastingen-debet (15xx waar saldo > 0), overige vorderingen-debet.
    let ta = 0;
    for (const r of d.balans_eindstand) {
      const rid = r.rekening_id || '';
      const v = num(r.saldo_eind_2016);
      const isActiva =
        (rid.startsWith('01') || rid.startsWith('00')) ||              // bedrijfsmiddelen
        rid.startsWith('07') || rid.startsWith('08') ||                // financiele vaste activa
        rid.startsWith('30') ||                                         // voorraden
        (rid.startsWith('1') &&
         !rid.startsWith('16') && !rid.startsWith('17') &&
         !rid.startsWith('18') && !rid.startsWith('19'));               // debiteuren/liquide/btw-vorder
      if (isActiva && v > 0) ta += v;
    }
    return ta;
  }

  function aggregeerEigenVermogenBegin(d) {
    if (!d.balans_eindstand) return null;
    // EV-rekeningen 05xx + 06xx (credit-accounts). Positieve saldi op deze
    // accounts = verlies-saldo op debetzijde = NEGATIEF EV semantisch.
    // Daarom: EV = − Σ(saldo). Dit is BEGIN-EV (vóór toevoeging NI 2016) —
    // de balans toont nog de pre-closing waarde.
    let raw = 0;
    for (const r of d.balans_eindstand) {
      const rid = r.rekening_id || '';
      if (rid.startsWith('05') || rid.startsWith('06')) {
        raw += num(r.saldo_eind_2016);
      }
    }
    return -raw;
  }

  function aggregeerEigenVermogen(d) {
    // EIND-EV (post-closing) = Begin-EV + NI 2016. Dit is wat ROE
    // gebruikt in standaardconventie (Ross/Westerfield/Jordan ch.3).
    const begin = aggregeerEigenVermogenBegin(d);
    const ni = aggregeerNI(d);
    if (begin === null || ni === null) return null;
    return begin + ni;
  }

  function aggregeerVoorraden(d) {
    if (!d.balans_eindstand) return null;
    // Alleen positieve voorraad-saldi (30xx); 3600 'nog te ontvangen
    // inkoopfacturen' is geen fysieke voorraad maar verplichting.
    let v = 0;
    for (const r of d.balans_eindstand) {
      const rid = r.rekening_id || '';
      if (rid.startsWith('30') && rid !== '3600' && rid !== '3610') {
        const s = num(r.saldo_eind_2016);
        if (s > 0) v += s;
      }
    }
    return v;
  }

  function aggregeerDebiteuren(d) {
    if (!d.balans_eindstand) return null;
    return d.balans_eindstand
      .filter(r => r.rekening_id && r.rekening_id.startsWith('14'))
      .reduce((s, r) => s + Math.max(0, num(r.saldo_eind_2016)), 0);
  }

  function aggregeerCrediteuren(d) {
    if (!d.balans_eindstand) return null;
    // Alleen leveranciersschulden — rek 1600 'Crediteuren' + 1601 'Crediteuren
    // buitenland'. NIET 1610 (emballage), 1615 (betalingen onderweg),
    // 1650/1651 (rekening courant intercompany) — die zijn geen
    // leveranciersschuld in DPO-zin.
    return d.balans_eindstand
      .filter(r => r.rekening_id === '1600' || r.rekening_id === '1601')
      .reduce((s, r) => s + Math.abs(num(r.saldo_eind_2016)), 0);
  }

  function medianBetaaltermijn(facturen, datumKey, factuurKey, bankmutaties, sign) {
    // Match facturen met bankmutaties op factuurnummer; return medianen
    // 'sign' = +1 (klantbetalingen, positief bedrag) of −1 (leveranciersbetalingen, negatief)
    if (!facturen || !bankmutaties) return null;
    const factuurDt = {};
    for (const f of facturen) factuurDt[f[factuurKey]] = f[datumKey];
    const termijnen = [];
    for (const b of bankmutaties) {
      const ref = b.factuurreferentie;
      if (!ref || !factuurDt[ref]) continue;
      const bedrag = num(b.bedrag);
      if (sign > 0 && bedrag <= 0) continue;
      if (sign < 0 && bedrag >= 0) continue;
      const dagen = Math.floor((new Date(b.datum) - new Date(factuurDt[ref])) / 86400000);
      if (dagen > 0 && dagen < 365) termijnen.push(dagen);
    }
    if (termijnen.length === 0) return null;
    termijnen.sort((a, b) => a - b);
    return {
      mediaan: termijnen[Math.floor(termijnen.length / 2)],
      gemiddelde: Math.round(termijnen.reduce((a, b) => a + b, 0) / termijnen.length),
      n: termijnen.length,
    };
  }

  // === Answer-functies (vraag 1 t/m 15) — met audit trail ===
  //
  // Elke functie returnt:
  //   { value, formaat?, methode, complexiteit, steps[] }
  // of bij ontbrekende data:
  //   { value: null, reden: string }
  //
  // Voor twee-routes-vragen (8, 11) en DPO-mismatch (3) ook:
  //   { ..., validatie: { match: bool, delta_pct, interpretatie } }

  function vraag1_omzet(d) {
    const steps = [];
    if (d.resultatenrekening && d.resultatenrekening.length > 0) {
      const rows = d.resultatenrekening.filter(r =>
        r.rekening_id && r.rekening_id.startsWith('8') && r.rekening_id !== '8800'
      );
      steps.push(`1. Bron: D_grootboek/resultatenrekening.csv`);
      steps.push(`2. Filter: rekening_id begint met '8' EN ≠ '8800' (korting omzet)`);
      steps.push(`   → ${rows.length} rijen geselecteerd`);
      const omzet = rows.reduce((s, r) => s + Math.abs(num(r.totaal_2016)), 0);
      steps.push(`3. Aggregeer: SUM(ABS(totaal_2016))`);
      steps.push(`   → ${fmtEuro(omzet)}`);
      return {
        value: fmtEuro(omzet),
        methode: 'D resultatenrekening — som over rek 8xxx',
        complexiteit: 1,
        steps,
      };
    }
    if (d.verkoopfacturen && d.verkoopfacturen.length > 0) {
      steps.push(`1. Bron: A_crm/verkoopfacturen.csv (geen D-toegang)`);
      const incl = d.verkoopfacturen.reduce((s, r) => s + num(r.bedrag_incl_btw), 0);
      steps.push(`2. SUM(bedrag_incl_btw) = ${fmtEuro(incl)}`);
      steps.push(`3. Approximatie excl BTW: ÷ 1.21 (gemiddeld BTW-tarief)`);
      steps.push(`   → ${fmtEuro(incl / 1.21)} (geschat)`);
      return {
        value: fmtEuro(incl / 1.21) + ' (excl BTW geschat)',
        methode: 'A verkoopfacturen / 1.21 (BTW-approximatie)',
        complexiteit: 1,
        steps,
      };
    }
    return { value: null, reden: 'data ontbreekt — heb resultatenrekening of verkoopfacturen nodig' };
  }

  function vraag2_top10_klanten(d) {
    const steps = [];
    if (!d.verkoopfacturen || d.verkoopfacturen.length === 0) {
      return { value: null, reden: 'verkoopfacturen ontbreekt' };
    }
    steps.push(`1. Bron: A_crm/verkoopfacturen.csv (${d.verkoopfacturen.length} rijen)`);
    const totals = {};
    for (const r of d.verkoopfacturen) {
      const k = r.klantnummer;
      totals[k] = (totals[k] || 0) + num(r.bedrag_incl_btw);
    }
    steps.push(`2. GROUP BY klantnummer, SUM(bedrag_incl_btw) → ${Object.keys(totals).length} unieke klanten`);
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 10);
    steps.push(`3. ORDER BY omzet DESC, LIMIT 10`);
    const namen = {};
    if (d.klanten) {
      for (const k of d.klanten) namen[k.klantnummer] = k.klantnaam;
      steps.push(`4. JOIN klanten.csv ON klantnummer voor namen`);
    }
    const lijst = sorted.map(([id, bdr]) => `${namen[id] || id}: ${fmtEuro(bdr)}`);
    return {
      value: lijst,
      formaat: 'lijst',
      methode: 'A verkoopfacturen group by klantnummer + klanten join',
      complexiteit: 2,
      steps,
    };
  }

  function vraag3_betaaltermijnen(d) {
    const steps = [];
    if (!d.verkoopfacturen || !d.bankmutaties) {
      return { value: null, reden: 'A_crm + C_bank beide nodig (factuur + betaling)' };
    }
    steps.push(`1. Bronnen: A_crm/verkoopfacturen.csv + C_bank/bankmutaties.csv`);
    const factuurDt = {};
    for (const f of d.verkoopfacturen) factuurDt[f.factuurnummer] = f.factuurdatum;
    steps.push(`2. Bouw lookup factuurnummer → factuurdatum (${Object.keys(factuurDt).length} facturen)`);

    const termijnen = [];
    for (const b of d.bankmutaties) {
      if (b.factuurreferentie && factuurDt[b.factuurreferentie] && num(b.bedrag) > 0) {
        const dt1 = new Date(factuurDt[b.factuurreferentie]);
        const dt2 = new Date(b.datum);
        const dagen = Math.floor((dt2 - dt1) / 86400000);
        if (dagen > 0 && dagen < 365) termijnen.push(dagen);
      }
    }
    if (termijnen.length === 0) {
      return { value: null, reden: 'geen matchende factuur+betaling-paren gevonden' };
    }
    steps.push(`3. JOIN factuur ↔ klantbetaling op factuurnummer (waar bedrag > 0)`);
    steps.push(`   → ${termijnen.length} matchende paren gevonden`);
    termijnen.sort((a, b) => a - b);
    const median = termijnen[Math.floor(termijnen.length / 2)];
    const gem = Math.round(termijnen.reduce((a, b) => a + b, 0) / termijnen.length);
    steps.push(`4. Mediaan = ${median} dagen · Gemiddelde = ${gem} dagen`);

    // v0.5 — DPO snapshot vs mediaan: bewuste mismatch case
    // v0.5.1 — gebruikt nu gedeelde helpers (supplier-debt only: 1600+1601)
    let validatie = null;
    if (d.balans_eindstand && d.resultatenrekening) {
      const crediteuren = aggregeerCrediteuren(d);
      const cogs = aggregeerCOGS(d);
      if (cogs > 0 && crediteuren !== null) {
        const dpo_snapshot = Math.round(crediteuren / cogs * 365);
        steps.push(`5. SNAPSHOT-DPO via balans (vergelijking voor docent):`);
        steps.push(`   crediteuren / COGS × 365 = ${fmtEuro(crediteuren)} / ${fmtEuro(cogs)} × 365 = ${dpo_snapshot} dagen`);
        validatie = {
          match: false,
          delta_pct: Math.abs(dpo_snapshot - median) / median * 100,
          waarden: { snapshot_dpo: dpo_snapshot, mediaan: median },
          interpretatie: 'BEWUSTE MISMATCH — beide kloppen wiskundig: snapshot-DPO ' +
                         `(${dpo_snapshot}d) gebruikt eindbalans gedeeld door COGS×365; ` +
                         `mediaan-distributie (${median}d) gebruikt feitelijke betaaltermijnen ` +
                         `per factuur. Bij dienstverleners overschat snapshot zwaar omdat de ` +
                         `crediteurenpost ook niet-COGS-uitgaven bevat. Methodologie matters!`,
        };
      }
    }

    return {
      value: `mediaan ${median} dagen · gemiddelde ${gem} dagen · n=${termijnen.length}`,
      methode: 'A verkoopfacturen + C bankmutaties join op factuurnummer',
      complexiteit: 4,
      steps,
      validatie,
    };
  }

  function vraag4_klantconcentratie(d) {
    const steps = [];
    if (!d.verkoopfacturen || d.verkoopfacturen.length === 0) {
      return { value: null, reden: 'verkoopfacturen ontbreekt' };
    }
    steps.push(`1. Bron: A_crm/verkoopfacturen.csv`);
    const totals = {};
    for (const r of d.verkoopfacturen) {
      totals[r.klantnummer] = (totals[r.klantnummer] || 0) + num(r.bedrag_incl_btw);
    }
    steps.push(`2. GROUP BY klantnummer → ${Object.keys(totals).length} unieke klanten`);
    const waarden = Object.values(totals).sort((a, b) => b - a);
    const totaal = waarden.reduce((a, b) => a + b, 0);
    const cr3 = waarden.slice(0, 3).reduce((a, b) => a + b, 0) / totaal * 100;
    steps.push(`3. CR-3 = top-3 / totaal = ${fmtPct(cr3, 1)}`);
    const hhiVal = hhi(waarden);
    steps.push(`4. HHI = Σ(aandeel%)² over alle klanten = ${Math.round(hhiVal)}`);
    steps.push(`5. Interpretatie: HHI < 1.500 = laag, 1.500-2.500 = matig, > 2.500 = hoog`);

    return {
      value: `CR-3 ${fmtPct(cr3, 1)} · HHI ${Math.round(hhiVal)}`,
      methode: 'A verkoopfacturen group by klant + HHI',
      complexiteit: 3,
      steps,
    };
  }

  function vraag5_open_debiteuren(d) {
    const steps = [];
    if (d.balans_eindstand && d.balans_eindstand.length > 0) {
      const post = d.balans_eindstand.find(r => r.rekening_id === '1400');
      if (post) {
        steps.push(`1. Bron: D_grootboek/balans_eindstand.csv`);
        steps.push(`2. SELECT WHERE rekening_id = '1400' (Debiteuren)`);
        steps.push(`3. → saldo_eind_2016 = ${fmtEuro(num(post.saldo_eind_2016))}`);
        return {
          value: fmtEuro(num(post.saldo_eind_2016)),
          methode: 'D balans rekening 1400 (Debiteuren)',
          complexiteit: 1,
          steps,
        };
      }
    }
    if (d.verkoopfacturen && d.bankmutaties) {
      steps.push(`1. Geen D-toegang — reconstructie via A + C`);
      const factuur_incl = d.verkoopfacturen.reduce((s, f) => s + num(f.bedrag_incl_btw), 0);
      steps.push(`2. SUM(bedrag_incl_btw) over verkoopfacturen = ${fmtEuro(factuur_incl)}`);
      const betaald = d.bankmutaties
        .filter(b => b.factuurreferentie && b.factuurreferentie.startsWith('VK') && num(b.bedrag) > 0)
        .reduce((s, b) => s + num(b.bedrag), 0);
      steps.push(`3. SUM(bedrag) over bankmutaties met factuurref VK* en bedrag > 0 = ${fmtEuro(betaald)}`);
      const open = factuur_incl - betaald;
      steps.push(`4. Open = ${fmtEuro(factuur_incl)} − ${fmtEuro(betaald)} = ${fmtEuro(open)}`);
      return {
        value: fmtEuro(open) + ' (gereconstrueerd)',
        methode: 'A verkoopfacturen − C bankmutaties (klant-betalingen)',
        complexiteit: 4,
        steps,
      };
    }
    return { value: null, reden: 'D balans of A+C nodig' };
  }

  function vraag6_welke_klanten_534k(d) {
    const steps = [];
    if (!d.verkoopfacturen || !d.bankmutaties) {
      return { value: null, reden: 'A_crm + C_bank beide nodig — niet uit D' };
    }
    steps.push(`1. Bronnen: A_crm/verkoopfacturen.csv + C_bank/bankmutaties.csv`);
    const factPerKlant = {};
    const factuurKlant = {};
    for (const f of d.verkoopfacturen) {
      factPerKlant[f.klantnummer] = (factPerKlant[f.klantnummer] || 0) + num(f.bedrag_incl_btw);
      factuurKlant[f.factuurnummer] = f.klantnummer;
    }
    steps.push(`2. Per klant: SUM(facturen) → ${Object.keys(factPerKlant).length} klanten`);

    const betaaldPerKlant = {};
    for (const b of d.bankmutaties) {
      if (b.factuurreferentie && num(b.bedrag) > 0) {
        const klant = factuurKlant[b.factuurreferentie];
        if (klant) {
          betaaldPerKlant[klant] = (betaaldPerKlant[klant] || 0) + num(b.bedrag);
        }
      }
    }
    steps.push(`3. Per klant: SUM(betalingen) via factuurnummer-join`);

    const open = {};
    for (const k of Object.keys(factPerKlant)) {
      const o = (factPerKlant[k] || 0) - (betaaldPerKlant[k] || 0);
      if (o > 0.5) open[k] = o;
    }
    steps.push(`4. Open per klant = facturen − betalingen → ${Object.keys(open).length} klanten met openstaand bedrag`);

    const sorted = Object.entries(open).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const namen = {};
    if (d.klanten) for (const k of d.klanten) namen[k.klantnummer] = k.klantnaam;
    const totaalOpen = Object.values(open).reduce((a, b) => a + b, 0);
    const lijst = sorted.map(([id, bdr]) => `${namen[id] || id}: ${fmtEuro(bdr)}`);
    steps.push(`5. Totaal openstaand = ${fmtEuro(totaalOpen)}`);

    return {
      value: { totaal: fmtEuro(totaalOpen), top10: lijst },
      formaat: 'lijst-met-totaal',
      methode: 'A−C reconstructie per klantnummer',
      complexiteit: 4,
      steps,
    };
  }

  function vraag7_belastingdienst(d) {
    const steps = [];
    if (!d.inkoopfacturen || d.inkoopfacturen.length === 0) {
      return { value: null, reden: 'inkoopfacturen ontbreekt' };
    }
    steps.push(`1. Bron: B_inkoop/inkoopfacturen.csv (${d.inkoopfacturen.length} rijen totaal)`);
    const fiscaal = d.inkoopfacturen.filter(r =>
      r.soort_boeking === 'FiVATDecl' ||
      r.soort_boeking === 'HrTaxDecl' ||
      r.soort_boeking === 'FiTaxDecl'
    );
    steps.push(`2. Filter soort_boeking IN ('FiVATDecl', 'HrTaxDecl', 'FiTaxDecl')`);
    steps.push(`   → ${fiscaal.length} fiscale aangiften`);
    const totaal = fiscaal.reduce((s, r) => s + num(r.bedrag_incl_btw), 0);
    steps.push(`3. SUM(bedrag_incl_btw) = ${fmtEuro(totaal)}`);
    steps.push(`4. Belangrijk: dit is GEEN operationele inkoop. AFAS boekt fiscale aangiften via inkoopboek tegen crediteurenrekening.`);

    return {
      value: fmtEuro(totaal),
      methode: `B inkoopfacturen filter op soort_boeking (n=${fiscaal.length} aangiften)`,
      complexiteit: 3,
      steps,
    };
  }

  function vraag8_omzet_per_businesslijn(d) {
    const steps = [];
    const resultaten = {};

    if (d.verkoopfacturen) {
      const stepsA = [];
      stepsA.push(`A1. Bron: A_crm/verkoopfacturen.csv`);
      const totals = {};
      for (const r of d.verkoopfacturen) {
        totals[r.businesslijn] = (totals[r.businesslijn] || 0) + num(r.bedrag_incl_btw);
      }
      stepsA.push(`A2. GROUP BY businesslijn → ${Object.keys(totals).length} buckets`);
      const totaal = Object.values(totals).reduce((a, b) => a + b, 0);
      const lijst = Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .map(([bz, bdr]) => `${bz}: ${fmtPct(bdr / totaal * 100)}`);
      stepsA.push(`A3. Per bucket: aandeel = bdr / totaal × 100`);
      resultaten.via_A = {
        value: lijst,
        methode: 'A verkoopfacturen group by businesslijn (5 buckets)',
        steps: stepsA,
      };
    }

    if (d.resultatenrekening && d.rekeningschema) {
      const stepsD = [];
      stepsD.push(`D1. Bronnen: D_grootboek/resultatenrekening.csv + rekeningschema.csv`);
      const naamMap = {};
      for (const r of d.rekeningschema) naamMap[r.rekening_id] = r.omschrijving;
      stepsD.push(`D2. Bouw lookup rekening_id → omschrijving (${Object.keys(naamMap).length} rekeningen)`);
      const omzetRek = d.resultatenrekening.filter(r =>
        r.rekening_id && r.rekening_id.startsWith('8') && r.rekening_id !== '8800'
      );
      stepsD.push(`D3. Filter omzetrekeningen 8xxx (excl 8800) → ${omzetRek.length} rekeningen`);
      const totaal = omzetRek.reduce((s, r) => s + Math.abs(num(r.totaal_2016)), 0);
      const lijst = omzetRek
        .map(r => ({ naam: naamMap[r.rekening_id] || r.rekening_id, bdr: Math.abs(num(r.totaal_2016)) }))
        .sort((a, b) => b.bdr - a.bdr)
        .map(x => `${x.naam}: ${fmtPct(x.bdr / totaal * 100)}`);
      stepsD.push(`D4. Per rekening: aandeel = ABS(totaal_2016) / som × 100`);
      resultaten.via_D = {
        value: lijst,
        methode: 'D resultatenrekening + rekeningschema (11 buckets)',
        steps: stepsD,
      };
    }

    if (Object.keys(resultaten).length === 0) {
      return { value: null, reden: 'geen route beschikbaar' };
    }

    // Validatie metadata voor twee-routes
    let validatie = null;
    if (resultaten.via_A && resultaten.via_D) {
      validatie = {
        match: false,  // Verschillende granulariteit → andere getallen
        delta_pct: null,
        interpretatie: 'BEWUSTE MISMATCH — beide kloppen, maar meten op een ander aggregatieniveau. ' +
                       'Via businesslijn (5 buckets) is grover dan via omzetrekening (11 buckets). ' +
                       'Dit is een methodologische keuze, geen fout.',
      };
    }

    return {
      value: resultaten,
      formaat: 'twee-routes',
      methode: Object.values(resultaten).map(r => r.methode).join(' · '),
      complexiteit: 2,
      steps: ['Twee routes parallel berekend — zie audit trail per route hieronder.'],
      validatie,
    };
  }

  function vraag9_abonnementen_pct(d) {
    const steps = [];
    if (d.resultatenrekening) {
      steps.push(`1. Bron: D_grootboek/resultatenrekening.csv`);
      const omzetRek = d.resultatenrekening.filter(r =>
        r.rekening_id && r.rekening_id.startsWith('8') && r.rekening_id !== '8800'
      );
      steps.push(`2. Filter rek 8xxx (excl 8800) → ${omzetRek.length} rekeningen`);
      const totaal = omzetRek.reduce((s, r) => s + Math.abs(num(r.totaal_2016)), 0);
      const abo = omzetRek.find(r => r.rekening_id === '8091');
      if (abo && totaal > 0) {
        const pct = Math.abs(num(abo.totaal_2016)) / totaal * 100;
        steps.push(`3. Rek 8091 (Omzet Abonnementen) = ${fmtEuro(Math.abs(num(abo.totaal_2016)))}`);
        steps.push(`4. Totaal omzet = ${fmtEuro(totaal)}`);
        steps.push(`5. Aandeel = ${fmtEuro(Math.abs(num(abo.totaal_2016)))} / ${fmtEuro(totaal)} = ${fmtPct(pct, 2)}`);
        return {
          value: fmtPct(pct, 1),
          methode: 'D resultatenrekening rek 8091 / totaal 8xxx',
          complexiteit: 2,
          steps,
        };
      }
    }
    if (d.verkoopfacturen) {
      steps.push(`1. Bron: A_crm/verkoopfacturen.csv (geen D-toegang)`);
      const totaal = d.verkoopfacturen.reduce((s, r) => s + num(r.bedrag_incl_btw), 0);
      const abo = d.verkoopfacturen
        .filter(r => /abonnement/i.test(r.businesslijn))
        .reduce((s, r) => s + num(r.bedrag_incl_btw), 0);
      steps.push(`2. Filter businesslijn matcht /abonnement/i`);
      steps.push(`3. Som filter / totaal × 100 = ${fmtPct(abo / totaal * 100, 2)}`);
      if (totaal > 0) {
        return {
          value: fmtPct(abo / totaal * 100, 1),
          methode: 'A verkoopfacturen filter op businesslijn=abonnementen',
          complexiteit: 2,
          steps,
        };
      }
    }
    return { value: null, reden: 'D resultatenrekening of A verkoopfacturen nodig' };
  }

  function vraag10_ebit(d) {
    const steps = [];
    if (!d.resultatenrekening) {
      return { value: null, reden: 'resultatenrekening ontbreekt — D nodig voor V&W-aggregatie' };
    }
    steps.push(`1. Bron: D_grootboek/resultatenrekening.csv`);
    let omzet = 0, kosten = 0;
    for (const r of d.resultatenrekening) {
      const rid = r.rekening_id || '';
      const v = num(r.totaal_2016);
      if (rid.startsWith('8')) omzet += Math.abs(v);
      else if (rid.startsWith('3')) kosten += v;
      else if (rid.startsWith('4')) kosten += v;
      else if (rid.startsWith('5')) kosten += v;
      else if (rid.startsWith('6') || rid.startsWith('7')) kosten += v;
    }
    const ebit = omzet - kosten;
    steps.push(`2. Aggregeer omzet (rek 8xxx) = ${fmtEuro(omzet)}`);
    steps.push(`3. Aggregeer kosten (rek 3xxx-7xxx) = ${fmtEuro(kosten)}`);
    steps.push(`4. EBIT = omzet − kosten = ${fmtEuro(ebit)}`);
    steps.push(`5. Niet meegerekend: 9xxx (financieel + buitengewoon) — die horen niet in EBIT`);

    return {
      value: fmtEuro(ebit),
      methode: 'D resultatenrekening — omzet (8xxx) − kosten (3xxx-7xxx)',
      complexiteit: 2,
      steps,
    };
  }

  function vraag11_productconcentratie(d) {
    const steps = [];
    const resultaten = {};

    if (d.verkoopfacturen) {
      const stepsA = [];
      stepsA.push(`A1. Bron: A_crm/verkoopfacturen.csv`);
      const totals = {};
      for (const r of d.verkoopfacturen) {
        totals[r.businesslijn] = (totals[r.businesslijn] || 0) + num(r.bedrag_incl_btw);
      }
      const waarden = Object.values(totals);
      stepsA.push(`A2. GROUP BY businesslijn → ${waarden.length} buckets`);
      const hhiA = hhi(waarden);
      const sorted = waarden.sort((a, b) => b - a);
      const totaal = sorted.reduce((a, b) => a + b, 0);
      const cr3A = sorted.slice(0, 3).reduce((a, b) => a + b, 0) / totaal * 100;
      stepsA.push(`A3. CR-3 = top-3 / totaal = ${fmtPct(cr3A, 1)}`);
      stepsA.push(`A4. HHI = Σ(aandeel%)² = ${Math.round(hhiA)}`);
      resultaten.via_A = {
        value: `HHI ${Math.round(hhiA)} · CR-3 ${fmtPct(cr3A, 1)} (5 buckets)`,
        methode: 'A verkoopfacturen group by businesslijn',
        steps: stepsA,
        hhi: Math.round(hhiA),
        cr3: cr3A,
      };
    }

    if (d.resultatenrekening) {
      const stepsD = [];
      stepsD.push(`D1. Bron: D_grootboek/resultatenrekening.csv`);
      const omzetRek = d.resultatenrekening
        .filter(r => r.rekening_id && r.rekening_id.startsWith('8') && r.rekening_id !== '8800')
        .map(r => Math.abs(num(r.totaal_2016)));
      stepsD.push(`D2. Filter rek 8xxx (excl 8800) → ${omzetRek.length} buckets`);
      if (omzetRek.length > 0) {
        const hhiD = hhi(omzetRek);
        const sorted = omzetRek.sort((a, b) => b - a);
        const totaal = sorted.reduce((a, b) => a + b, 0);
        const cr3D = sorted.slice(0, 3).reduce((a, b) => a + b, 0) / totaal * 100;
        stepsD.push(`D3. CR-3 = top-3 / totaal = ${fmtPct(cr3D, 1)}`);
        stepsD.push(`D4. HHI = Σ(aandeel%)² = ${Math.round(hhiD)}`);
        resultaten.via_D = {
          value: `HHI ${Math.round(hhiD)} · CR-3 ${fmtPct(cr3D, 1)} (${omzetRek.length} buckets)`,
          methode: 'D resultatenrekening 8xxx',
          steps: stepsD,
          hhi: Math.round(hhiD),
          cr3: cr3D,
        };
      }
    }

    if (Object.keys(resultaten).length === 0) {
      return { value: null, reden: 'A verkoopfacturen of D resultatenrekening nodig' };
    }

    // Validatie: HHI varieert door bucket-aantal
    let validatie = null;
    if (resultaten.via_A && resultaten.via_D) {
      const delta = Math.abs(resultaten.via_A.hhi - resultaten.via_D.hhi);
      validatie = {
        match: false,
        delta_pct: delta / resultaten.via_D.hhi * 100,
        waarden: { via_A_hhi: resultaten.via_A.hhi, via_D_hhi: resultaten.via_D.hhi },
        interpretatie: `BEWUSTE MISMATCH — verschil van ${delta} HHI-punten. HHI is gevoelig ` +
                       `voor het aantal buckets: minder buckets = grotere relatieve aandelen = hogere HHI. ` +
                       `Via businesslijn (5 buckets, HHI ${resultaten.via_A.hhi}) is grover dan via ` +
                       `omzetrekening (${resultaten.via_D ? '11' : '?'} buckets, HHI ${resultaten.via_D.hhi}). ` +
                       `Beide drempels-classificaties komen op 'zeer hoog geconcentreerd' uit (>2.500). ` +
                       `Bij elk concentratie-getal hoort een definitie van 'wat is een bucket'.`,
      };
    }

    return {
      value: resultaten,
      formaat: 'twee-routes',
      methode: Object.values(resultaten).map(r => r.methode).join(' · '),
      complexiteit: 2,
      steps: ['Twee routes parallel berekend — zie audit trail per route hieronder.'],
      validatie,
    };
  }

  // === Vraag 12 — Profit Margin (PM = NI / Sales) ===

  function vraag12_profit_margin(d) {
    const steps = [];
    const omzet = aggregeerOmzet(d);
    const ni = aggregeerNI(d);
    if (omzet === null || ni === null) {
      return { value: null, reden: 'D_grootboek (resultatenrekening) nodig' };
    }
    steps.push(`1. Bron: D_grootboek/resultatenrekening.csv`);
    steps.push(`2. Omzet = SUM(ABS(totaal_2016)) over rek 8xxx (excl 8800) = ${fmtEuro(omzet)}`);
    steps.push(`3. Net Income = omzet − Σ(overige rek-saldi) = ${fmtEuro(ni)}`);
    steps.push(`4. Profit Margin = NI / Omzet = ${fmtEuro(ni)} / ${fmtEuro(omzet)} = ${fmtPct(ni / omzet * 100, 2)}`);
    steps.push(`5. Interpretatie: voor IT-dienstverlener is ~10-20% gezond; <5% kwetsbaar.`);
    return {
      value: fmtPct(ni / omzet * 100, 1),
      methode: 'D V&W: NI / Omzet',
      complexiteit: 1,
      steps,
    };
  }

  // === Vraag 13 — ROA (Return on Assets) + DuPont-link ===

  function vraag13_roa(d) {
    const steps = [];
    const ni = aggregeerNI(d);
    const ta = aggregeerActiva(d);
    const omzet = aggregeerOmzet(d);
    if (ni === null || ta === null || omzet === null || ta === 0) {
      return { value: null, reden: 'D_grootboek (balans + V&W) nodig' };
    }
    steps.push(`1. Bronnen: balans_eindstand.csv + resultatenrekening.csv`);
    steps.push(`2. Totale activa = Σ(positieve saldi) op activa-rekeningen (0xxx vaste, 30xx voorraad, 1xxx-debet) = ${fmtEuro(ta)}`);
    steps.push(`3. Net Income = ${fmtEuro(ni)}`);
    const roa = ni / ta * 100;
    steps.push(`4. ROA = NI / TA = ${fmtPct(roa, 2)}`);

    // Triangulatie: ROA = PM × TAT
    const pm = ni / omzet;
    const tat = omzet / ta;
    const roa_dupont = pm * tat * 100;
    const delta = Math.abs(roa - roa_dupont);
    steps.push(`5. Triangulatie via DuPont: PM × TAT = ${fmtPct(pm * 100, 2)} × ${fmtNum(tat, 3)} = ${fmtPct(roa_dupont, 2)}`);

    return {
      value: fmtPct(roa, 1),
      methode: 'D balans + V&W: NI / TA',
      complexiteit: 2,
      steps,
      validatie: {
        match: delta < 0.01,
        delta_pct: delta,
        waarden: { roa_direct: roa, roa_dupont, pm: pm * 100, tat },
        interpretatie: `MATCH — algebraïsche identiteit ROA = PM × TAT klopt binnen ` +
                       `${fmtNum(delta, 4)} procentpunt rondingsruimte. Beide routes ` +
                       `geven ${fmtPct(roa, 1)}. Validatie: zelfde NI, zelfde TA, alleen ` +
                       `via een andere decompositie. Dit is geen toeval — het is een wet.`,
      },
    };
  }

  // === Vraag 14 — ROE (Return on Equity) + volledige DuPont ===

  function vraag14_roe(d) {
    const steps = [];
    const ni = aggregeerNI(d);
    const ta = aggregeerActiva(d);
    const te = aggregeerEigenVermogen(d);
    const omzet = aggregeerOmzet(d);
    if (ni === null || ta === null || te === null || omzet === null) {
      return { value: null, reden: 'D_grootboek (balans + V&W) nodig' };
    }
    const teBegin = aggregeerEigenVermogenBegin(d);
    steps.push(`1. Bronnen: balans_eindstand.csv + resultatenrekening.csv`);
    steps.push(`2. Net Income 2016 = ${fmtEuro(ni)}`);
    steps.push(`3. EV begin (uit balans, vóór winstbestemming) = − Σ(saldo op rek 05xx + 06xx) = ${fmtEuro(teBegin)}`);
    steps.push(`   → opmerkelijk: 0650 'Onverdeeld resultaat' = ${fmtEuro(-teBegin)} positief op debet-zijde = verlies-deficit.`);
    steps.push(`4. EV eind (post-closing) = EV begin + NI = ${fmtEuro(teBegin)} + ${fmtEuro(ni)} = ${fmtEuro(te)}`);
    if (te < 0) {
      steps.push(`   ⚠ EV eind is NEGATIEF — semantische edge-case (verlies-deficit nog groter dan inbreng).`);
    }
    if (Math.abs(te) < 1) {
      return {
        value: 'n/v (EV ≈ 0)',
        methode: 'NI / EV — gedeeld door bijna-nul',
        complexiteit: 2,
        steps,
        validatie: { match: false, interpretatie: 'EV ≈ 0 → ratio onbepaald.' },
      };
    }
    const roe_direct = ni / te * 100;
    steps.push(`5. ROE direct = NI / EV_eind = ${fmtEuro(ni)} / ${fmtEuro(te)} = ${fmtPct(roe_direct, 1)}`);

    const pm = ni / omzet;
    const tat = omzet / ta;
    const em = ta / te;
    const roe_dupont = pm * tat * em * 100;
    steps.push(`6. DuPont decompositie:`);
    steps.push(`   · PM (Profit Margin)  = NI / Omzet  = ${fmtPct(pm * 100, 2)}`);
    steps.push(`   · TAT (Asset Turnover) = Omzet / TA  = ${fmtNum(tat, 3)}×`);
    steps.push(`   · EM (Equity Multiplier) = TA / EV   = ${fmtNum(em, 2)}×`);
    steps.push(`7. ROE DuPont = PM × TAT × EM = ${fmtPct(roe_dupont, 1)}`);

    const delta = Math.abs(roe_direct - roe_dupont);
    const edgeCase = te < 100;
    let interpretatie;
    if (edgeCase) {
      interpretatie =
        `MATCH wiskundig — de identiteit ROE = PM × TAT × EM klopt (Δ < 0,01 pp). ` +
        `MAAR betekenisarm: bij negatief EV (€${Math.round(te).toLocaleString('nl-NL')}) ` +
        `wordt EM negatief, en daarmee ROE negatief — niet omdat de winst slecht is ` +
        `(NI = ${fmtEuro(ni)} positief!), maar omdat de noemer onderwater staat. ` +
        `Een hogere ROE is hier juist slechter (verder van solvabiliteit). ` +
        `Klassiek voorbeeld: een ratio kan correct én misleidend zijn.`;
    } else {
      interpretatie =
        `MATCH — algebraïsche identiteit ROE = PM × TAT × EM klopt binnen ${fmtNum(delta, 4)} pp. ` +
        `DuPont onthult bronnen: lage PM = margedruk, lage TAT = trage activa, hoge EM = hefboom (=risico).`;
    }
    return {
      value: fmtPct(roe_direct, 1),
      methode: 'D balans + V&W: NI / EV (en triangulatie via PM × TAT × EM)',
      complexiteit: 3,
      steps,
      validatie: {
        match: delta < 0.01,
        delta_pct: delta,
        waarden: { roe_direct, roe_dupont, pm: pm * 100, tat, em },
        interpretatie,
      },
    };
  }

  // === Vraag 15 — Cash Conversion Cycle (snapshot vs hybrid) ===

  function vraag15_ccc(d) {
    const steps = [];
    const cogs = aggregeerCOGS(d);
    const voorraden = aggregeerVoorraden(d);
    const debiteuren = aggregeerDebiteuren(d);
    const crediteuren = aggregeerCrediteuren(d);
    const omzet = aggregeerOmzet(d);

    if (cogs === null || voorraden === null || debiteuren === null ||
        crediteuren === null || omzet === null || cogs === 0 || omzet === 0) {
      return { value: null, reden: 'D_grootboek (balans + V&W) nodig — inclusief 7xxx COGS' };
    }
    steps.push(`1. Bronnen: D_grootboek (balans + V&W)`);

    // Snapshot-route (alleen balans + V&W aggregaten)
    const dsi = voorraden / cogs * 365;
    const dso_snap = debiteuren / omzet * 365;
    const dpo_snap = crediteuren / cogs * 365;
    const ccc_snap = dsi + dso_snap - dpo_snap;
    steps.push(`2. SNAPSHOT-route (alleen balans + V&W):`);
    steps.push(`   · DSI = voorraden / COGS × 365 = ${fmtEuro(voorraden)} / ${fmtEuro(cogs)} × 365 = ${Math.round(dsi)}d`);
    steps.push(`   · DSO = debiteuren / omzet × 365 = ${fmtEuro(debiteuren)} / ${fmtEuro(omzet)} × 365 = ${Math.round(dso_snap)}d`);
    steps.push(`   · DPO = crediteuren / COGS × 365 = ${fmtEuro(crediteuren)} / ${fmtEuro(cogs)} × 365 = ${Math.round(dpo_snap)}d`);
    steps.push(`   · CCC_snapshot = DSI + DSO − DPO = ${Math.round(dsi)} + ${Math.round(dso_snap)} − ${Math.round(dpo_snap)} = ${Math.round(ccc_snap)}d`);

    // Hybride route (DSO en DPO uit feitelijke betaaltermijn-distributies)
    let validatie = null;
    let value;
    if (d.verkoopfacturen && d.bankmutaties && d.inkoopfacturen) {
      const dsoMed = medianBetaaltermijn(d.verkoopfacturen, 'factuurdatum', 'factuurnummer', d.bankmutaties, +1);
      const dpoMed = medianBetaaltermijn(d.inkoopfacturen, 'factuurdatum', 'factuurnummer', d.bankmutaties, -1);
      if (dsoMed && dpoMed) {
        const ccc_hyb = dsi + dsoMed.mediaan - dpoMed.mediaan;
        steps.push(`3. HYBRIDE route (mediaan-distributie i.p.v. snapshot voor DSO/DPO):`);
        steps.push(`   · DSO_mediaan = ${dsoMed.mediaan}d (n=${dsoMed.n} facturen)`);
        steps.push(`   · DPO_mediaan = ${dpoMed.mediaan}d (n=${dpoMed.n} inkoopfacturen)`);
        steps.push(`   · CCC_hybride = DSI + DSO_med − DPO_med = ${Math.round(dsi)} + ${dsoMed.mediaan} − ${dpoMed.mediaan} = ${Math.round(ccc_hyb)}d`);
        validatie = {
          match: false,
          delta_pct: Math.abs(ccc_snap - ccc_hyb) / Math.abs(ccc_hyb || 1) * 100,
          waarden: {
            ccc_snapshot: Math.round(ccc_snap),
            ccc_hybride: Math.round(ccc_hyb),
            dsi: Math.round(dsi),
            dso_snap: Math.round(dso_snap),
            dso_med: dsoMed.mediaan,
            dpo_snap: Math.round(dpo_snap),
            dpo_med: dpoMed.mediaan,
          },
          interpretatie:
            `BEWUSTE MISMATCH — beide routes wiskundig correct, maar betekenis ` +
            `verschilt fundamenteel. SNAPSHOT-CCC (${Math.round(ccc_snap)}d) suggereert dat ` +
            `leveranciers de cyclus financieren — een sterk werkkapitaal-positief signaal. ` +
            `CAVEAT: de DPO van ${Math.round(dpo_snap)}d is een snapshot-ratio die de ` +
            `werkelijkheid bij dienstverleners overschat. Crediteurenpost ${fmtEuro(crediteuren)} ` +
            `bestaat slechts deels uit COGS-gerelateerde inkopen; veel niet-COGS-uitgaven ` +
            `(overige bedrijfskosten) lopen óók via 1600. De per-factuur-distributie onthult ` +
            `dat de werkelijke mediaan-betaaltermijn aan leveranciers ${dpoMed.mediaan}d is. ` +
            `HYBRIDE-CCC (${Math.round(ccc_hyb)}d) is voor dienstverleners betrouwbaarder. ` +
            `Methodologie matters!`,
        };
        value = `snapshot ${Math.round(ccc_snap)}d · hybride ${Math.round(ccc_hyb)}d`;
      } else {
        value = `snapshot ${Math.round(ccc_snap)}d (hybride niet beschikbaar — geen factuur-paren)`;
      }
    } else {
      value = `snapshot ${Math.round(ccc_snap)}d (alleen D-route — A+C ontbreekt voor hybride)`;
    }

    return {
      value,
      methode: 'D balans + V&W (snapshot) · A+B+C (hybride mediaan)',
      complexiteit: 4,
      steps,
      validatie,
    };
  }

  // === Dispatch ===

  const ANSWER_FUNCTIONS = [
    vraag1_omzet, vraag2_top10_klanten, vraag3_betaaltermijnen, vraag4_klantconcentratie,
    vraag5_open_debiteuren, vraag6_welke_klanten_534k, vraag7_belastingdienst,
    vraag8_omzet_per_businesslijn, vraag9_abonnementen_pct, vraag10_ebit,
    vraag11_productconcentratie,
    vraag12_profit_margin, vraag13_roa, vraag14_roe, vraag15_ccc,
  ];

  function computeAnswer(qIdx) {
    const fn = ANSWER_FUNCTIONS[qIdx];
    if (!fn) return { value: null, reden: `geen answer-functie voor vraag ${qIdx + 1}` };
    try {
      return fn(datasets);
    } catch (err) {
      console.error(`Fout in vraag ${qIdx + 1}:`, err);
      return { value: null, reden: `fout in compute: ${err.message}` };
    }
  }

  function clearCache() {
    for (const niveau of ['s', 't', 'o', 'docent']) {
      localStorage.removeItem(`heatmap-data-${niveau}`);
    }
  }

  // === DuPont-analyse (voor v0.5 ontwerp C — DuPont Challenge) ===
  // Berekent ROE via twee routes om de algebraïsche identiteit ROE = PM×TAT×EM
  // te demonstreren. Bij Vento is ROE dramatisch negatief door negatief eigen
  // vermogen — een edge-case die laat zien wanneer een ratio betekenis-arm wordt.
  // v0.5.1 — refactor: gebruikt nu gedeelde aggregaten-helpers (consistent
  // met vraag 12-15) i.p.v. duplicate inline-aggregatie.

  function computeDuPont() {
    if (!datasets.balans_eindstand || !datasets.resultatenrekening) {
      return { value: null, reden: 'D_grootboek (balans + V&W) nodig voor DuPont' };
    }
    const omzet = aggregeerOmzet(datasets);
    const ni    = aggregeerNI(datasets);
    const ta    = aggregeerActiva(datasets);
    const te    = aggregeerEigenVermogen(datasets);

    if (omzet === null || ni === null || ta === null || te === null || omzet === 0 || ta === 0) {
      return { value: null, reden: 'aggregaten niet berekenbaar' };
    }

    const pm  = ni / omzet;
    const tat = omzet / ta;
    const em  = Math.abs(te) < 1 ? null : ta / te;
    const roa = ni / ta;
    const roe_direct = Math.abs(te) < 1 ? null : ni / te;
    const roe_dupont = em === null ? null : pm * tat * em;

    return {
      omzet, ni, ta, te,
      pm, tat, em, roa,
      roe_direct, roe_dupont,
      delta: roe_direct === null ? null : Math.abs(roe_direct - roe_dupont),
      match: roe_direct === null ? false : Math.abs(roe_direct - roe_dupont) < 0.0001,
      edge_case: te < 100,  // bijna-nul of negatief EV
    };
  }

  // === Public API ===

  global.engine = {
    loadDatasets,
    computeAnswer,
    computeDuPont,
    clearCache,
    datasets,
  };
})(window);
