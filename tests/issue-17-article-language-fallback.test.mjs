import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('language strategy is documented for article publication flow', async () => {
	const strategy = await readFile('docs/article-language-strategy.md', 'utf8');
	assert.match(strategy, /Base language: Spanish first/);
	assert.match(strategy, /lang: both/);
});

test('article routes define fallback notices for single-language entries', async () => {
	const esRoute = await readFile('src/pages/articulos/[slug].astro', 'utf8');
	const enRoute = await readFile('src/pages/en/articles/[slug].astro', 'utf8');
	assert.doesNotMatch(esRoute, /available only in ingles|English only/);
	assert.doesNotMatch(enRoute, /available in Spanish only|espanol/);
});
