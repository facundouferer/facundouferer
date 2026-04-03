import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('seo dictionary includes required bilingual metadata', async () => {
	const content = await readFile('src/seo/meta.ts', 'utf8');
	assert.match(content, /Facundo Uferer — AI-Driven Full Stack Engineer/);
	assert.match(content, /Facundo Uferer — Ingeniero Full Stack con IA/);
	assert.match(content, /Technical Articles — Facundo Uferer/);
	assert.match(content, /Articulos Tecnicos — Facundo Uferer/);
});

test('base and article layouts expose hreflang and og type', async () => {
	const base = await readFile('src/layouts/BaseLayout.astro', 'utf8');
	const article = await readFile('src/layouts/ArticleLayout.astro', 'utf8');
	assert.match(base, /hreflang="es"/);
	assert.match(base, /hreflang="en"/);
	assert.match(base, /og:type/);
	assert.match(article, /ogType="article"/);
});
