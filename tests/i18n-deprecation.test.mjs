// Slice A — T A-4: Confirm deprecated i18n modules are gone and no production
// code imports them. Mirrors the deprecation requirement of the
// `ui-i18n-runtime` delta ("removed OR reduced to no-op re-exports").
//
// Dictionaries + BaseLayout derivation are exercised by
// `tests/i18n-runtime.test.mjs`. This file is the focused deprecation guard.

import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

async function listFilesRecursive(dir, acc = []) {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			await listFilesRecursive(full, acc);
		} else {
			acc.push(full);
		}
	}
	return acc;
}

test('deprecated UI string modules are deleted', async () => {
	assert.equal(existsSync('src/i18n/translations.ts'), false, 'src/i18n/translations.ts must not exist');
	assert.equal(existsSync('src/i18n/paths.ts'), false, 'src/i18n/paths.ts must not exist');
	assert.equal(existsSync('src/seo/meta.ts'), false, 'src/seo/meta.ts must not exist');
});

test('no production source under src/ imports the deprecated modules', async () => {
	const files = await listFilesRecursive('src');
	const forbidden = /from\s+['"][^'"]*(\/seo\/meta|\/i18n\/translations|\/i18n\/paths)['"]/;
	const offenders = [];
	for (const file of files) {
		if (!/\.(astro|ts|mjs|js)$/.test(file)) continue;
		const content = await readFile(file, 'utf8');
		if (forbidden.test(content)) offenders.push(file);
	}
	assert.deepEqual(offenders, [], `No production imports of deprecated modules. Offenders: ${offenders.join(', ')}`);
});

test('seo dictionary values do not leak back into src/seo/', async () => {
	// The ui-i18n-runtime "Migration completeness" scenario mandates
	// `rg "Proyectos|Articulos|Sobre mi" src/seo/meta.ts` returns no matches.
	// The file itself is gone, so this simply re-asserts its absence.
	assert.ok(!existsSync('src/seo/meta.ts'), 'src/seo/meta.ts deleted');
});

test('JSON dictionaries cover the previously translated UI keys', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));
	assert.equal(es.nav.projects, 'Proyectos');
	assert.equal(es.nav.articles, 'Articulos');
	assert.equal(es.nav.about, 'Sobre mi');
	assert.equal(en.nav.projects, 'Projects');
	assert.equal(en.nav.articles, 'Articles');
	assert.equal(en.nav.about, 'About');
});