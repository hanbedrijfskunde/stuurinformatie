// engine.js — Auto-compute engine voor de heatmap (v0.4.1)
//
// Bevat:
//   1. CSV-loader die per niveau de juiste datasets laadt en cached in
//      localStorage.
//   2. Elf answer-functies (1-11) die op basis van geladen datasets een
//      antwoord berekenen.
//   3. Helper-functies voor formattering en aggregatie.
//
// Gebruik:
//   await engine.loadDatasets('s');   // 's' | 't' | 'o' | 'docent'
//   const answer = engine.computeAnswer(0);  // index 0 = vraag 1
//   // answer = { value, formaat, methode, complexiteit, reden }
//
// Vereist Papa Parse via CDN (script-tag in heatmap.html).
// LET OP: lokaal testen vereist een server (python3 -m http.server) — fetch()
// werkt niet op file:// protocol.

(function (global) {
  'use strict';

  // === Pad-configuratie (relatief tov heatmap.html) ===

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

  // Welke datasets zijn voor welk niveau zichtbaar?
  const NIVEAU_DATASETS = {
    's': ['rekeningschema', 'balans_eindstand', 'resultatenrekening'],
    't': ['klanten', 'verkoopfacturen', 'leveranciers', 'inkoopfacturen',
          'rekeningschema', 'balans_eindstand', 'resultatenrekening'],
    'o': ['klanten', 'verkoopfacturen', 'leveranciers', 'inkoopfacturen', 'bankmutaties'],
  };

  // Globale dataset-state (gevuld door loadDatasets)
  const datasets = {};

  // === CSV-loader ===

  async function loadDatasets(niveau) {
    const cacheKey = `heatmap-data-${niveau}`;
    // Probeer cache eerst
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        Object.assign(datasets, parsed);
        return;
      }
    } catch (e) {
      // Cache ongeldig — wis en herlaad
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
      // localStorage vol of beperkt — niet fataal, datasets blijven in geheugen
      console.warn('localStorage cache failed:', e);
    }
  }

  // === Helpers ===

  // Parse numerieke waarde (lege/ongeldige → 0)
  function num(v) {
    if (v === undefined || v === null || v === '') return 0;
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  // Format euro met Nederlandse notatie (€ 1.234)
  function fmtEuro(n) {
    return '€ ' + n.toLocaleString('nl-NL', { maximumFractionDigits: 0 });
  }

  // Format percentage met komma-decimaal
  function fmtPct(n, decimals) {
    return n.toLocaleString('nl-NL', {
      minimumFractionDigits: decimals || 1,
      maximumFractionDigits: decimals || 1,
    }) + '%';
  }

  // HHI berekenen uit een array van waarden
  // hhi(waarden) → som van (aandeel_in_pct)^2
  function hhi(waarden) {
    const totaal = waarden.reduce((a, b) => a + b, 0);
    if (totaal === 0) return 0;
    return waarden.reduce((s, w) => s + Math.pow(w / totaal * 100, 2), 0);
  }

  // === Answer-functies (vraag 1 t/m 11) ===
  //
  // Elke functie krijgt het globale datasets-object en geeft een resultaat
  // van de vorm:
  //   { value: any, formaat: string, methode: string, complexiteit: number }
  // of bij ontbrekende data:
  //   { value: null, reden: string }
  //
  // 'value' is een gegenereerde string of een object met meer detail.
  // 'methode' beschrijft welke route gebruikt is — handig voor docent en
  // voor twee-routes-vragen (8 en 11).

  function vraag1_omzet(d) {
    if (d.resultatenrekening && d.resultatenrekening.length > 0) {
      const omzet = d.resultatenrekening
        .filter(r => r.rekening_id && r.rekening_id.startsWith('8') && r.rekening_id !== '8800')
        .reduce((s, r) => s + Math.abs(num(r.totaal_2016)), 0);
      return { value: fmtEuro(omzet), methode: 'D resultatenrekening (rek 8xxx)', complexiteit: 1 };
    }
    if (d.verkoopfacturen && d.verkoopfacturen.length > 0) {
      const incl = d.verkoopfacturen.reduce((s, r) => s + num(r.bedrag_incl_btw), 0);
      return {
        value: fmtEuro(incl / 1.21) + ' (excl BTW geschat)',
        methode: 'A verkoopfacturen / 1.21 (BTW-approximatie)',
        complexiteit: 1,
      };
    }
    return { value: null, reden: 'data ontbreekt — heb resultatenrekening of verkoopfacturen nodig' };
  }

  function vraag2_top10_klanten(d) {
    if (!d.verkoopfacturen || d.verkoopfacturen.length === 0) {
      return { value: null, reden: 'verkoopfacturen ontbreekt' };
    }
    const totals = {};
    for (const r of d.verkoopfacturen) {
      const k = r.klantnummer;
      totals[k] = (totals[k] || 0) + num(r.bedrag_incl_btw);
    }
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const namen = {};
    if (d.klanten) for (const k of d.klanten) namen[k.klantnummer] = k.klantnaam;
    const lijst = sorted.map(([id, bdr]) => `${namen[id] || id}: ${fmtEuro(bdr)}`);
    return {
      value: lijst,
      formaat: 'lijst',
      methode: 'A verkoopfacturen group by klantnummer + klanten join',
      complexiteit: 2,
    };
  }

  function vraag3_betaaltermijnen(d) {
    if (!d.verkoopfacturen || !d.bankmutaties) {
      return { value: null, reden: 'A_crm + C_bank beide nodig (factuur + betaling)' };
    }
    // Match factuur-datum aan factuurnr, dan vind betaling met zelfde factuurref
    const factuurDt = {};
    for (const f of d.verkoopfacturen) factuurDt[f.factuurnummer] = f.factuurdatum;
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
    termijnen.sort((a, b) => a - b);
    const median = termijnen[Math.floor(termijnen.length / 2)];
    const gem = Math.round(termijnen.reduce((a, b) => a + b, 0) / termijnen.length);
    return {
      value: `mediaan ${median} dagen · gemiddelde ${gem} dagen · n=${termijnen.length}`,
      methode: 'A verkoopfacturen + C bankmutaties join op factuurnummer',
      complexiteit: 4,
    };
  }

  function vraag4_klantconcentratie(d) {
    if (!d.verkoopfacturen || d.verkoopfacturen.length === 0) {
      return { value: null, reden: 'verkoopfacturen ontbreekt' };
    }
    const totals = {};
    for (const r of d.verkoopfacturen) {
      totals[r.klantnummer] = (totals[r.klantnummer] || 0) + num(r.bedrag_incl_btw);
    }
    const waarden = Object.values(totals).sort((a, b) => b - a);
    const totaal = waarden.reduce((a, b) => a + b, 0);
    const cr3 = waarden.slice(0, 3).reduce((a, b) => a + b, 0) / totaal * 100;
    const hhiVal = hhi(waarden);
    return {
      value: `CR-3 ${fmtPct(cr3)} · HHI ${Math.round(hhiVal)}`,
      methode: 'A verkoopfacturen group by klant + HHI',
      complexiteit: 3,
    };
  }

  function vraag5_open_debiteuren(d) {
    // Route 1: directe lookup in balans
    if (d.balans_eindstand && d.balans_eindstand.length > 0) {
      const post = d.balans_eindstand.find(r => r.rekening_id === '1400');
      if (post) {
        return {
          value: fmtEuro(num(post.saldo_eind_2016)),
          methode: 'D balans rekening 1400 (Debiteuren)',
          complexiteit: 1,
        };
      }
    }
    // Route 2: A+C reconstructie (factuur incl - klantbetalingen)
    if (d.verkoopfacturen && d.bankmutaties) {
      const factuur_incl = d.verkoopfacturen.reduce((s, f) => s + num(f.bedrag_incl_btw), 0);
      const betaald = d.bankmutaties
        .filter(b => b.factuurreferentie && b.factuurreferentie.startsWith('VK') && num(b.bedrag) > 0)
        .reduce((s, b) => s + num(b.bedrag), 0);
      return {
        value: fmtEuro(factuur_incl - betaald) + ' (gereconstrueerd)',
        methode: 'A verkoopfacturen − C bankmutaties (klant-betalingen)',
        complexiteit: 4,
      };
    }
    return { value: null, reden: 'D balans of A+C nodig' };
  }

  function vraag6_welke_klanten_534k(d) {
    if (!d.verkoopfacturen || !d.bankmutaties) {
      return { value: null, reden: 'A_crm + C_bank beide nodig — niet uit D' };
    }
    // Bereken per klant: facturen − betalingen = openstaand
    const factPerKlant = {};
    const factuurKlant = {};
    for (const f of d.verkoopfacturen) {
      factPerKlant[f.klantnummer] = (factPerKlant[f.klantnummer] || 0) + num(f.bedrag_incl_btw);
      factuurKlant[f.factuurnummer] = f.klantnummer;
    }
    const betaaldPerKlant = {};
    for (const b of d.bankmutaties) {
      if (b.factuurreferentie && num(b.bedrag) > 0) {
        const klant = factuurKlant[b.factuurreferentie];
        if (klant) {
          betaaldPerKlant[klant] = (betaaldPerKlant[klant] || 0) + num(b.bedrag);
        }
      }
    }
    const open = {};
    for (const k of Object.keys(factPerKlant)) {
      const o = (factPerKlant[k] || 0) - (betaaldPerKlant[k] || 0);
      if (o > 0.5) open[k] = o;
    }
    const sorted = Object.entries(open).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const namen = {};
    if (d.klanten) for (const k of d.klanten) namen[k.klantnummer] = k.klantnaam;
    const totaalOpen = Object.values(open).reduce((a, b) => a + b, 0);
    const lijst = sorted.map(([id, bdr]) => `${namen[id] || id}: ${fmtEuro(bdr)}`);
    return {
      value: { totaal: fmtEuro(totaalOpen), top10: lijst },
      formaat: 'lijst-met-totaal',
      methode: 'A−C reconstructie per klantnummer',
      complexiteit: 4,
    };
  }

  function vraag7_belastingdienst(d) {
    if (!d.inkoopfacturen || d.inkoopfacturen.length === 0) {
      return { value: null, reden: 'inkoopfacturen ontbreekt' };
    }
    // Filter op soort_boeking = FiVATDecl (BTW) of HrTaxDecl (loonheffing)
    const fiscaal = d.inkoopfacturen.filter(r =>
      r.soort_boeking === 'FiVATDecl' ||
      r.soort_boeking === 'HrTaxDecl' ||
      r.soort_boeking === 'FiTaxDecl'
    );
    const totaal = fiscaal.reduce((s, r) => s + num(r.bedrag_incl_btw), 0);
    return {
      value: fmtEuro(totaal),
      methode: `B inkoopfacturen filter op soort_boeking (n=${fiscaal.length} aangiften)`,
      complexiteit: 3,
    };
  }

  function vraag8_omzet_per_businesslijn(d) {
    const resultaten = {};
    // Route A: businesslijn (5 buckets, journaal-niveau)
    if (d.verkoopfacturen) {
      const totals = {};
      for (const r of d.verkoopfacturen) {
        totals[r.businesslijn] = (totals[r.businesslijn] || 0) + num(r.bedrag_incl_btw);
      }
      const totaal = Object.values(totals).reduce((a, b) => a + b, 0);
      const lijst = Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .map(([bz, bdr]) => `${bz}: ${fmtPct(bdr / totaal * 100)}`);
      resultaten.via_A = {
        value: lijst,
        methode: 'A verkoopfacturen group by businesslijn (5 buckets)',
      };
    }
    // Route D: omzetrekening + rekeningschema (11 buckets, product-niveau)
    if (d.resultatenrekening && d.rekeningschema) {
      const naamMap = {};
      for (const r of d.rekeningschema) naamMap[r.rekening_id] = r.omschrijving;
      const omzetRek = d.resultatenrekening.filter(r =>
        r.rekening_id && r.rekening_id.startsWith('8') && r.rekening_id !== '8800'
      );
      const totaal = omzetRek.reduce((s, r) => s + Math.abs(num(r.totaal_2016)), 0);
      const lijst = omzetRek
        .map(r => ({ naam: naamMap[r.rekening_id] || r.rekening_id, bdr: Math.abs(num(r.totaal_2016)) }))
        .sort((a, b) => b.bdr - a.bdr)
        .map(x => `${x.naam}: ${fmtPct(x.bdr / totaal * 100)}`);
      resultaten.via_D = {
        value: lijst,
        methode: 'D resultatenrekening + rekeningschema (11 buckets)',
      };
    }
    if (Object.keys(resultaten).length === 0) {
      return { value: null, reden: 'geen route beschikbaar' };
    }
    return {
      value: resultaten,
      formaat: 'twee-routes',
      methode: Object.values(resultaten).map(r => r.methode).join(' · '),
      complexiteit: 2,
    };
  }

  function vraag9_abonnementen_pct(d) {
    // Route D: rekening 8091 / totaal 8xxx
    if (d.resultatenrekening) {
      const omzetRek = d.resultatenrekening.filter(r =>
        r.rekening_id && r.rekening_id.startsWith('8') && r.rekening_id !== '8800'
      );
      const totaal = omzetRek.reduce((s, r) => s + Math.abs(num(r.totaal_2016)), 0);
      const abo = omzetRek.find(r => r.rekening_id === '8091');
      if (abo && totaal > 0) {
        const pct = Math.abs(num(abo.totaal_2016)) / totaal * 100;
        return {
          value: fmtPct(pct),
          methode: 'D resultatenrekening rek 8091 / totaal 8xxx',
          complexiteit: 2,
        };
      }
    }
    // Route A: filter verkoopfacturen op businesslijn
    if (d.verkoopfacturen) {
      const totaal = d.verkoopfacturen.reduce((s, r) => s + num(r.bedrag_incl_btw), 0);
      const abo = d.verkoopfacturen
        .filter(r => /abonnement/i.test(r.businesslijn))
        .reduce((s, r) => s + num(r.bedrag_incl_btw), 0);
      if (totaal > 0) {
        return {
          value: fmtPct(abo / totaal * 100),
          methode: 'A verkoopfacturen filter op businesslijn=abonnementen',
          complexiteit: 2,
        };
      }
    }
    return { value: null, reden: 'D resultatenrekening of A verkoopfacturen nodig' };
  }

  function vraag10_ebit(d) {
    if (!d.resultatenrekening) {
      return { value: null, reden: 'resultatenrekening ontbreekt — D nodig voor V&W-aggregatie' };
    }
    // EBIT = omzet (8xxx) − COGS (3-7xxx) − overige bedrijfskosten (4xxx + bepaalde 9xxx)
    // Eenvoudige benadering: alle resultaat-rekeningen met sign-flip op opbrengsten
    let ebit = 0;
    for (const r of d.resultatenrekening) {
      const rid = r.rekening_id || '';
      const v = num(r.totaal_2016);
      if (rid.startsWith('8')) ebit += Math.abs(v);          // omzet
      else if (rid.startsWith('3')) ebit -= v;               // voorraad-correctie
      else if (rid.startsWith('4')) ebit -= v;               // personeel + overig
      else if (rid.startsWith('5')) ebit -= v;               // voorraadmutaties
      else if (rid.startsWith('6') || rid.startsWith('7')) ebit -= v;  // COGS
      // 9xxx (financieel + buitengewoon) niet meegerekend in EBIT
    }
    return {
      value: fmtEuro(ebit),
      methode: 'D resultatenrekening — omzet (8xxx) − kosten (3xxx-7xxx)',
      complexiteit: 2,
    };
  }

  function vraag11_productconcentratie(d) {
    const resultaten = {};
    // Route A: businesslijn (5 buckets)
    if (d.verkoopfacturen) {
      const totals = {};
      for (const r of d.verkoopfacturen) {
        totals[r.businesslijn] = (totals[r.businesslijn] || 0) + num(r.bedrag_incl_btw);
      }
      const waarden = Object.values(totals);
      const hhiA = hhi(waarden);
      const sorted = waarden.sort((a, b) => b - a);
      const totaal = sorted.reduce((a, b) => a + b, 0);
      const cr3A = sorted.slice(0, 3).reduce((a, b) => a + b, 0) / totaal * 100;
      resultaten.via_A = {
        value: `HHI ${Math.round(hhiA)} · CR-3 ${fmtPct(cr3A)} (5 buckets)`,
        methode: 'A verkoopfacturen group by businesslijn',
      };
    }
    // Route D: omzetrekening (11 buckets)
    if (d.resultatenrekening) {
      const omzetRek = d.resultatenrekening
        .filter(r => r.rekening_id && r.rekening_id.startsWith('8') && r.rekening_id !== '8800')
        .map(r => Math.abs(num(r.totaal_2016)));
      if (omzetRek.length > 0) {
        const hhiD = hhi(omzetRek);
        const sorted = omzetRek.sort((a, b) => b - a);
        const totaal = sorted.reduce((a, b) => a + b, 0);
        const cr3D = sorted.slice(0, 3).reduce((a, b) => a + b, 0) / totaal * 100;
        resultaten.via_D = {
          value: `HHI ${Math.round(hhiD)} · CR-3 ${fmtPct(cr3D)} (${omzetRek.length} buckets)`,
          methode: 'D resultatenrekening 8xxx',
        };
      }
    }
    if (Object.keys(resultaten).length === 0) {
      return { value: null, reden: 'A verkoopfacturen of D resultatenrekening nodig' };
    }
    return {
      value: resultaten,
      formaat: 'twee-routes',
      methode: Object.values(resultaten).map(r => r.methode).join(' · '),
      complexiteit: 2,
    };
  }

  // === Dispatch ===

  const ANSWER_FUNCTIONS = [
    vraag1_omzet, vraag2_top10_klanten, vraag3_betaaltermijnen, vraag4_klantconcentratie,
    vraag5_open_debiteuren, vraag6_welke_klanten_534k, vraag7_belastingdienst,
    vraag8_omzet_per_businesslijn, vraag9_abonnementen_pct, vraag10_ebit,
    vraag11_productconcentratie,
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

  // === Public API ===

  global.engine = {
    loadDatasets,
    computeAnswer,
    clearCache,
    datasets, // ook publiek voor debug
  };
})(window);
