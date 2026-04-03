import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('dynamic OG endpoint exists for article slugs', async () => {
	const route = await readFile('src/pages/og/[slug].svg.ts', 'utf8');
	assert.match(route, /getStaticPaths/);
	assert.match(route, /Content-Type': 'image\/svg\+xml/);
	assert.match(route, /getCollection\('articles'\)/);
});

test('article pages pass slug-based OG image to layout', async () => {
	const es = await readFile('src/pages/articulos/[slug].astro', 'utf8');
	const en = await readFile('src/pages/en/articles/[slug].astro', 'utf8');
	assert.match(es, /\/og\/\$\{entry\.data\.slug\}\.svg/);
	assert.match(en, /\/og\/\$\{entry\.data\.slug\}\.svg/);
});
