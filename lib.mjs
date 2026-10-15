// Pure logic, no DOM — tested by lib.test.mjs

export const CATEGORIES = {
  media: '🎬 Medien & Unterhaltung',   // Streaming, Musik, Games, News, Zeitschriften
  software: '💻 Software & Cloud',     // Apps, SaaS, Speicher, Domains, KI-Tools
  telecom: '📱 Telefon & Internet',    // Handy, Festnetz, Internet, TV-Anschluss
  home: '🏠 Wohnen & Energie',         // Miete, Strom, Gas, Wasser, Serafe
  insurance: '🛡️ Versicherungen',      // Kranken-, Haftpflicht-, Hausrat-, Autoversicherung
  mobility: '🚗 Mobilität',            // ÖV-Abo, Leasing, Parkplatz, Carsharing
  health: '💪 Gesundheit & Sport',     // Fitness, Vereine (Sport), Apotheke-Abos
  education: '🎓 Bildung',             // Kurse, Sprach-Apps, Fachzeitschriften
  finance: '🏦 Finanzen & Mitgliedschaften', // Kontogebühren, Kreditkarte, Spenden, Verbände
  invest: '📈 Sparen & Investieren',   // ETF-/Aktien-Sparpläne, Säule 3a – zählt nicht als Kosten
  other: '📦 Sonstiges',
  salary: '💼 Lohn & Gehalt',
  sidejob: '🛠️ Nebenerwerb',          // Freelance, Nebenjob, Verkäufe
  capital: '💹 Dividenden & Zinsen',
  refund: '↩️ Sonstige Einnahmen',     // Rückerstattungen, Alimente, Kindergeld
};

// How categories are presented (dialog optgroups) and counted
export const GROUPS = {
  'Abos & Verträge': ['media', 'software', 'telecom', 'health', 'education'],
  'Rechnungen & Fixkosten': ['home', 'insurance', 'mobility', 'finance', 'other'],
  'Sparen & Investieren': ['invest'],
  Einnahmen: ['salary', 'sidejob', 'capital', 'refund'],
};
export const kind = (s) => (s.cat === 'invest' ? 'invest' : GROUPS.Einnahmen.includes(s.cat) ? 'income' : 'cost');
// active and not past its optional end date
export const isLive = (s, today) => s.active && (!s.end || s.end >= today);

export const INTERVALS = {
  week: ['Wöchentlich', 52 / 12],
  month: ['Monatlich', 1],
  bimonth: ['Alle 2 Monate', 1 / 2],
  quarter: ['Vierteljährlich', 1 / 3],
  tertial: ['Alle 4 Monate', 1 / 4],
  half: ['Halbjährlich', 1 / 6],
  year: ['Jährlich', 1 / 12],
};

export const CURRENCIES = ['CHF', 'EUR', 'USD', 'GBP'];

const MONTHS = { month: 1, bimonth: 2, quarter: 3, tertial: 4, half: 6, year: 12 };
const iso = (d) => d.toISOString().slice(0, 10);

// k-th occurrence after `start`, computed from the anchor so 31. Jan → 28./29. Feb → 31. Mär doesn't drift
export function addInterval(start, interval, k) {
  const [y, m, d] = start.split('-').map(Number);
  if (interval === 'week') return iso(new Date(Date.UTC(y, m - 1, d + 7 * k)));
  const mm = m - 1 + MONTHS[interval] * k;
  const last = new Date(Date.UTC(y, mm + 1, 0)).getUTCDate();
  return iso(new Date(Date.UTC(y, mm, Math.min(d, last))));
}

export function nextDue(start, interval, today = iso(new Date())) {
  if (!start) return '';
  let k = 0, r = start;
  while (r < today) r = addInterval(start, interval, ++k);
  return r;
}

// rates: { EUR: 1.07, ... } relative to base (1 base = x cur)
export function toBase(amount, cur, base, rates) {
  if (cur === base || !rates?.[cur]) return +amount;
  return amount / rates[cur];
}

export const monthly = (s, base, rates) => toBase(s.amount, s.cur, base, rates) * INTERVALS[s.interval][1];

// every word of q must appear somewhere in the invoice's text; `hits` = Drive full-text matches (file ids)
export function searchInvoices(invoices, subs, q, hits = new Set()) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return invoices;
  const byId = Object.fromEntries(subs.map((s) => [s.id, s]));
  return invoices.filter((inv) => {
    if (hits.has(inv.fileId)) return true;
    const s = byId[inv.subId];
    const hay = [inv.name, inv.date, inv.amount, inv.cur, inv.notes, s?.name, CATEGORIES[s?.cat]]
      .join(' ').toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

// Payments in each of the next n calendar months (starting with today's month): totals per kind + the single payments
export function forecast(subs, base, rates, today, n = 12) {
  const [y, m] = today.split('-').map(Number);
  const months = Array.from({ length: n }, (_, i) => ({ key: iso(new Date(Date.UTC(y, m - 1 + i, 1))).slice(0, 7), cost: 0, invest: 0, income: 0, items: [] }));
  const stop = iso(new Date(Date.UTC(y, m - 1 + n, 1)));
  for (const s of subs) {
    if (!isLive(s, today) || !s.next) continue;
    const value = toBase(s.amount, s.cur, base, rates), k_ = kind(s);
    for (let k = 0, d = s.next; d < stop && (!s.end || d <= s.end); d = addInterval(s.next, s.interval, ++k)) {
      const b = months.find((x) => d.startsWith(x.key));
      if (!b) continue;
      b[k_] += value;
      b.items.push({ name: s.name, date: d, amount: s.amount, cur: s.cur, value, kind: k_ });
    }
  }
  return months;
}
