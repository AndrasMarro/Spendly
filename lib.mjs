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
  other: '📦 Sonstiges',
};

export const INTERVALS = {
  week: ['Wöchentlich', 52 / 12],
  month: ['Monatlich', 1],
  quarter: ['Vierteljährlich', 1 / 3],
  half: ['Halbjährlich', 1 / 6],
  year: ['Jährlich', 1 / 12],
};

export const CURRENCIES = ['CHF', 'EUR', 'USD', 'GBP'];

const MONTHS = { month: 1, quarter: 3, half: 6, year: 12 };
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
