// Exercise the real TMA initializer without a browser or live authentication.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const filename = path.join(__dirname, '../src/app/provider/tma-init.tsx');
const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function initialize({ framed = true, search = '', referrer = '', telegram = false } = {}) {
  const redirects = [], timers = [], attributes = {};
  const self = {};
  const window = {
    self, top: framed ? {} : self,
    location: { pathname: '/en/tma/property-catalog', search, hash: '', replace: url => redirects.push(url) },
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout: () => {},
    ...(telegram ? { Telegram: { WebApp: { initData: 'real-session', ready() {}, expand() {} } } } : {}),
  };
  const context = {
    exports: {}, window, URL, URLSearchParams, process: { env: { NODE_ENV: 'production' } },
    document: { referrer,
      documentElement: { setAttribute: (key, value) => attributes[key] = value, style: { setProperty() {} } },
      body: { setAttribute() {}, style: {} },
    },
    require: name => {
      if (name === 'react') return { useEffect: fn => fn() };
      if (name === 'next/navigation') return { usePathname: () => window.location.pathname, useSearchParams: () => new URLSearchParams(search) };
      throw new Error('Unexpected import: ' + name);
    },
  };
  vm.runInNewContext(source, context, { filename });
  context.exports.default();
  timers.forEach(fn => fn());
  return { redirects, attributes };
}

for (const scenario of [
  { search: '?embedded=twitris&town=Alicante' },
  { search: '?town=Alicante', referrer: 'https://twitris.com/' },
  { referrer: 'https://twitris-webapp.pages.dev/' },
  { framed: false, telegram: true },
]) {
  const result = initialize(scenario);
  assert.deepEqual(result.redirects, []);
  assert.equal(result.attributes['data-client-channel'], 'tma');
}
for (const scenario of [
  { framed: false, search: '?embedded=twitris&town=Alicante' },
  { referrer: 'https://twitris.com.attacker.example/' },
]) {
  const result = initialize(scenario);
  assert.equal(result.redirects.length, 1, 'Regular browser fallback remains available');
  assert.ok(result.redirects[0].startsWith('/en/property-catalog'));
}
console.log('Twitris embed and regular Telegram/browser initialization checks passed');
