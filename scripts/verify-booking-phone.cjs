/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS regression runner. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const root = process.cwd();
const projectRequire = createRequire(path.join(root, 'package.json'));
const ts = projectRequire('typescript');
function load(file, mocks = {}, globals = {}) {
  const exports = {};
  const js = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX }
  }).outputText;
  vm.runInNewContext(js, {
    exports, process, console, Request, Response, URL,
    crypto: require('node:crypto'),
    require: name => Object.prototype.hasOwnProperty.call(mocks, name) ? mocks[name] : projectRequire(name),
    ...globals,
  }, { filename: file });
  return exports;
}
const phone = load('lib/booking-phone.ts');
const invalid = [undefined, null, '', '   ', '+20', '+966 ', '+971', '010', 'not a phone', '01012345678abc', 1012345678, {}, [], '0000000000', '+1234567890123456', '++201012345678', '2010+12345678'];
for (const input of invalid) assert.equal(phone.normalizeBookingPhone(input), null);
for (const [input, expected] of [
  ['01012345678', '01012345678'], [' +20 101-234-5678 ', '+201012345678'],
  ['+971 50 123 4567', '+971501234567'], ['+44 (20) 7946-0958', '+442079460958'],
  ['٠١٠١٢٣٤٥٦٧٨', '01012345678'], ['۰۱۰۱۲۳۴۵۶۷۸', '01012345678'],
  ['\u200e+201012345678\u200f', '+201012345678'],
]) assert.equal(phone.normalizeBookingPhone(input), expected);

let saves = [], updates = [], notifications = [];
const route = load('app/api/bookings/route.ts', {
  '@/lib/booking-phone': phone,
  '@/lib/data': {
    addBooking: async booking => saves.push(booking),
    updateBooking: async (id, booking) => updates.push({ id, booking }),
    getBookings: async () => [],
  },
  '@/lib/eventEmitter': { eventEmitter: { emit: (...args) => notifications.push(args) } },
  '@/lib/admin-auth': { requireAdminAuth: async () => null },
});
function post(payload, ip = 'test-client') {
  return route.POST(new Request('http://localhost/api/bookings', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(payload),
  }));
}
(async () => {
  let rejected = 0, accepted = 0;
  for (const type of ['car', 'fast_track', 'hotel', 'apartment', 'flight']) {
    for (const source of ['web', 'whatsapp']) {
      for (const input of invalid) {
        const response = await post({ type, source, phone: input }, type + '-' + source);
        assert.equal(response.status, 400, 'Reject invalid phone for ' + type + '/' + source);
        assert.equal((await response.json()).code, 'PHONE_INVALID');
        rejected++;
      }
      const before = saves.length;
      const response = await post({ type, source, phone: ' +20 101-234-5678 ', customerName: 'Test' }, type + '-' + source);
      assert.equal(response.status, 201, 'Invalid attempts must not consume a valid booking rate limit');
      assert.equal(saves.length, before + 1);
      assert.equal(saves.at(-1).phone, '+201012345678');
      assert.equal(saves.at(-1).source, source);
      accepted++;
    }
  }
  assert.equal(saves.length, accepted);
  assert.equal(notifications.length, accepted, 'Rejected requests must not notify admins');
  for (const payload of [null, [], 'text', {}]) assert.equal((await post(payload)).status, 400);
  const malformed = await route.POST(new Request('http://localhost/api/bookings', { method: 'POST', body: '{bad' }));
  assert.equal(malformed.status, 400);
  assert.equal((await post({ phone: '01012345678' }, 'car-web')).status, 429);
  for (const input of invalid) {
    const response = await route.PUT(new Request('http://localhost/api/bookings', {
      method: 'PUT', body: JSON.stringify({ id: 'old-booking', phone: input === undefined ? null : input }),
    }));
    assert.equal(response.status, 400);
  }
  assert.equal(updates.length, 0);
  assert.equal((await route.PUT(new Request('http://localhost/api/bookings', {
    method: 'PUT', body: JSON.stringify({ id: 'old-booking', status: 'confirmed' }),
  }))).status, 200, 'Status updates on historical bookings must still work');
  assert.equal(updates.length, 1);

  let dbCalls = 0, inserted, patched;
  const data = load('lib/data.ts', {
    './booking-phone': phone,
    './mongodb': { getDb: async () => {
      dbCalls++;
      return { collection: () => ({
        insertOne: async item => { inserted = item; },
        updateOne: async (query, update) => { patched = update.$set; },
      }) };
    } },
    './cloudinary': { deleteFromCloudinary: async () => {} },
  });
  for (const input of invalid) {
    await assert.rejects(data.addBooking({ phone: input }), /complete contact phone/);
    await assert.rejects(data.updateBooking('test', { phone: input }), /cannot be removed/);
  }
  assert.equal(dbCalls, 0, 'Invalid numbers must be rejected before touching the database');
  await data.addBooking({ phone: '٠١٠١٢٣٤٥٦٧٨' });
  assert.equal(inserted.phone, '01012345678');
  await data.updateBooking('test', { phone: '+971 50 123 4567' });
  assert.equal(patched.phone, '+971501234567');


  // Existing customer numbers may contain spaces or Arabic digits.
  let customerPhone = '+20 101-234-5678', customerUpdates = [];
  const customerRoute = load('app/api/customer/bookings/route.ts', {
    '@/lib/booking-phone': phone,
    '@/lib/mongodb': { getDb: async () => ({ collection: () => ({ findOne: async () => ({ phone: customerPhone }) }) }) },
    '@/lib/data': {
      getBookings: async () => [
        { id: 'mine', phone: '+201012345678', status: 'new', createdAt: '2026-10-10' },
        { id: 'other', phone: '+201098765432', status: 'new', createdAt: '2026-10-10' },
        { id: 'blank', phone: '', status: 'new', createdAt: '2026-10-10' },
      ],
      updateBooking: async (id, patch) => customerUpdates.push({ id, patch }),
    },
    'next/headers': { cookies: async () => ({ get: () => ({ value: '012345678901234567890123' }) }) },
  });
  const listing = await customerRoute.GET(new Request('http://localhost/api/customer/bookings'));
  assert.equal(listing.status, 200);
  assert.equal((await listing.json()).total, 1);
  assert.equal((await customerRoute.PUT(new Request('http://localhost/api/customer/bookings', {
    method: 'PUT', body: JSON.stringify({ id: 'mine', status: 'cancelled' }),
  }))).status, 200);
  assert.equal((await customerRoute.PUT(new Request('http://localhost/api/customer/bookings', {
    method: 'PUT', body: JSON.stringify({ id: 'other', status: 'cancelled' }),
  }))).status, 403);
  assert.equal(customerUpdates.length, 1);

  // Render the real shared form for every service and both languages.
  const React = projectRequire('react');
  const ReactDOMServer = projectRequire('react-dom/server');
  const { BookingForm } = load('components/BookingForm.tsx', {
    '@/lib/booking-phone': phone, '@/lib/utils': { bookingMessage: () => '', buildWhatsappUrl: () => '' },
    '@/lib/gtag': {},
    '@tanstack/react-query': { useQuery: () => ({ data: null }) },
    'next/link': props => React.createElement('a', { href: props.href }, props.children),
    './LocationSearchModal': { LocationSearchModal: () => null },
    './NationalitySearchModal': { NationalitySearchModal: () => null },
  });
  let forms = 0;
  for (const type of ['car', 'fast_track', 'hotel', 'apartment', 'flight']) {
    for (const locale of ['ar', 'en']) {
      const html = ReactDOMServer.renderToStaticMarkup(React.createElement(BookingForm, {
        type, locale, serviceRefId: 'test', serviceName: 'Test', whatsappNumber: '201000000000',
      }));
      const input = html.match(/<input[^>]*name="phone"[^>]*>/)?.[0];
      assert.ok(input, 'Contact input must exist for ' + type + '/' + locale);
      assert.match(input, /\brequired(?:=""|(?=\s))/);
      assert.match(input, /type="tel"/);
      assert.match(input, /value=""/, "The contact field starts empty, not with a country code");
      assert.match(input, /autoComplete="tel"/i);
      assert.match(input, /minLength="7"/i);
      assert.equal((html.match(/type="submit"/g) || []).length, 2, 'Both booking actions share the validated form');
      forms++;
    }
  }
  console.log('PASS: ' + rejected + ' invalid booking requests rejected; ' + accepted + ' valid requests accepted; ' + forms + ' rendered booking forms checked. Persistence guards, admin phone updates, malformed bodies, and rate limiting passed. No real database or external requests used.');
})().catch(error => { console.error(error); process.exitCode = 1; });
