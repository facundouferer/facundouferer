import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('seo dictionary includes required bilingual metadata', async () => {
	const es = await readFile('src/i18n/es.json', 'utf8');
	const en = await readFile('src/i18n/en.json', 'utf8');
	assert.match(es, /Facundo Uferer — Ingeniero Full Stack con IA/);
	assert.match(en, /Facundo Uferer — AI-Driven Full Stack Engineer/);
	assert.match(es, /Articulos Tecnicos — Facundo Uferer/);
	assert.match(en, /Technical Articles — Facundo Uferer/);
});

test('base and article layouts expose hreflang and og type', async () => {
	const base = await readFile('src/layouts/BaseLayout.astro', 'utf8');
	const article = await readFile('src/layouts/ArticleLayout.astro', 'utf8');
	assert.match(base, /hreflang="es"/);
	assert.match(base, /hreflang="en"/);
	assert.match(base, /og:type/);
	assert.match(article, /ogType="article"/);
});
