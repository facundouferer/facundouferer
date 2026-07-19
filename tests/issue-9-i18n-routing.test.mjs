import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const requiredRoutes = [
	'src/pages/index.astro',
	'src/pages/proyectos.astro',
	'src/pages/articulos/index.astro',
	'src/pages/articulos/[slug].astro',
	'src/pages/en/index.astro',
	'src/pages/en/projects.astro',
	'src/pages/en/articles/index.astro',
	'src/pages/en/articles/[slug].astro',
];

test('i18n config sets default locale to spanish', async () => {
	const astroConfig = await readFile('astro.config.mjs', 'utf8');
	assert.match(astroConfig, /defaultLocale: 'es'/);
	assert.match(astroConfig, /locales: \['es', 'en'\]/);
});

test('all bilingual routes exist', async () => {
	await Promise.all(requiredRoutes.map((filePath) => access(filePath)));
	assert.ok(true);
});

test('translations include es and en home metadata', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));
	assert.ok(es.home, 'home metadata present in es.json');
	assert.ok(en.home, 'home metadata present in en.json');
	assert.ok(es.nav, 'nav translations present in es.json');
	assert.ok(en.nav, 'nav translations present in en.json');
});
