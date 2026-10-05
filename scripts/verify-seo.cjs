const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const moduleExports = {};
const source = ts.transpileModule(fs.readFileSync('lib/seo.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
vm.runInNewContext(source, {
  exports: moduleExports, process, URL,
  require: () => ({ cookies: async () => ({ get: () => ({ value: 'ar' }) }) }),
});

(async () => {
  let count = 0;
  for (const path of Object.keys(moduleExports.serviceSeo)) {
    for (const locale of ['ar', 'en']) {
      const metadata = await moduleExports.serviceMetadata(path)({
        searchParams: Promise.resolve({ __locale: locale }),
      });
      assert.equal(metadata.alternates.canonical, moduleExports.localizedUrl(path, locale));
      assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
      assert.equal(metadata.title, moduleExports.serviceSeo[path][locale][0]);
      assert.equal(metadata.alternates.languages['ar-EG'], moduleExports.localizedUrl(path, 'ar'));
      assert.equal(metadata.alternates.languages.en, moduleExports.localizedUrl(path, 'en'));
      count++;
    }
  }
  console.log(`Verified ${count} service metadata variants and their canonical and language URLs.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
