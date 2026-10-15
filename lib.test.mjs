// node lib.test.mjs
import assert from 'node:assert/strict';
import { addInterval, nextDue, toBase, monthly, searchInvoices, forecast, kind, isLive } from './lib.mjs';

assert.equal(addInterval('2026-01-31', 'month', 1), '2026-02-28');
assert.equal(addInterval('2026-01-31', 'month', 2), '2026-03-31');
assert.equal(addInterval('2026-12-15', 'quarter', 1), '2027-03-15');
assert.equal(addInterval('2028-02-29', 'year', 1), '2029-02-28');
assert.equal(addInterval('2026-12-28', 'week', 1), '2027-01-04');

assert.equal(nextDue('2026-01-31', 'month', '2026-03-01'), '2026-03-31');
assert.equal(nextDue('2026-05-10', 'year', '2026-05-10'), '2026-05-10');
assert.equal(nextDue('2030-01-01', 'month', '2026-05-10'), '2030-01-01');
assert.equal(nextDue('', 'month'), '');

assert.equal(toBase(10, 'CHF', 'CHF', {}), 10);
assert.equal(toBase(20, 'EUR', 'CHF', { EUR: 2 }), 10);
assert.equal(toBase(20, 'USD', 'CHF', {}), 20); // no rate → unconverted
assert.equal(monthly({ amount: 120, cur: 'CHF', interval: 'year' }, 'CHF', {}), 10);

const subs = [{ id: 's1', name: 'Netflix', cat: 'media' }, { id: 's2', name: 'Swisscom', cat: 'telecom' }];
const inv = [
  { id: 'a', subId: 's1', fileId: 'f1', name: 'netflix-jan.pdf', date: '2026-01-05', amount: 18.9, cur: 'CHF' },
  { id: 'b', subId: 's2', fileId: 'f2', name: 'rechnung.pdf', date: '2026-02-01', amount: 65, cur: 'CHF', notes: 'Glasfaser' },
];
assert.deepEqual(searchInvoices(inv, subs, '').map((i) => i.id), ['a', 'b']);
assert.deepEqual(searchInvoices(inv, subs, 'swisscom 2026-02').map((i) => i.id), ['b']);
assert.deepEqual(searchInvoices(inv, subs, 'unterhaltung').map((i) => i.id), ['a']);
assert.deepEqual(searchInvoices(inv, subs, 'glasfaser').map((i) => i.id), ['b']);
assert.deepEqual(searchInvoices(inv, subs, 'xyz', new Set(['f1'])).map((i) => i.id), ['a']);

assert.equal(addInterval('2026-01-15', 'tertial', 2), '2026-09-15');
assert.equal(monthly({ amount: 100, cur: 'CHF', interval: 'bimonth' }, 'CHF', {}), 50);

const fc = forecast([
  { active: true, amount: 10, cur: 'CHF', interval: 'month', next: '2026-01-31', cat: 'media' },
  { active: true, amount: 300, cur: 'CHF', interval: 'quarter', next: '2026-11-15', cat: 'invest' },
  { active: false, amount: 999, cur: 'CHF', interval: 'month', next: '2026-10-01', cat: 'media' },
], 'CHF', {}, '2026-10-15');
assert.equal(fc.length, 12);
assert.deepEqual(fc.slice(0, 3).map((m) => [m.key, m.cost, m.invest]), [['2026-10', 10, 0], ['2026-11', 10, 300], ['2026-12', 10, 0]]);
assert.equal(fc[4].key, '2027-02'); assert.equal(fc[4].invest, 300);
assert.equal(fc[11].key, '2027-09');
assert.deepEqual(fc[1].items.map((i) => [i.date, i.kind]), [['2026-11-30', 'cost'], ['2026-11-15', 'invest']]);

assert.equal(kind({ cat: 'salary' }), 'income'); assert.equal(kind({ cat: 'invest' }), 'invest'); assert.equal(kind({ cat: 'home' }), 'cost');
assert.equal(isLive({ active: true, end: '2026-10-14' }, '2026-10-15'), false);
// income counted, end date stops the series
const fc2 = forecast([
  { active: true, amount: 5000, cur: 'CHF', interval: 'month', next: '2026-10-25', cat: 'salary' },
  { active: true, amount: 200, cur: 'EUR', interval: 'month', next: '2026-10-20', cat: 'mobility', end: '2026-12-20' },
], 'CHF', { EUR: 2 }, '2026-10-15');
assert.deepEqual(fc2.slice(0, 4).map((m) => [m.income, m.cost]), [[5000, 100], [5000, 100], [5000, 100], [5000, 0]]);
assert.deepEqual(fc2[0].items.find((i) => i.cur === 'EUR'), { name: undefined, date: '2026-10-20', amount: 200, cur: 'EUR', value: 100, kind: 'cost' });

console.log('ok');
