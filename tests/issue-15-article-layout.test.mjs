import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('article layout includes metadata, pager, and contact CTA', async () => {
	const content = await readFile('src/layouts/ArticleLayout.astro', 'utf8');
	assert.match(content, /Tags:/);
	assert.match(content, /aria-label="Article navigation"/);
	assert.match(content, /work together/);
});

test('article routes render markdown content through content render helper', async () => {
	const es = await readFile('src/pages/articulos/[slug].astro', 'utf8');
	const en = await readFile('src/pages/en/articles/[slug].astro', 'utf8');
	assert.match(es, /render\(entry\)/);
	assert.match(en, /render\(entry\)/);
	assert.match(es, /getStaticPaths/);
	assert.match(en, /getStaticPaths/);
	assert.match(es, /resolveArticleEntry\(/);
	assert.match(en, /resolveArticleEntry\(/);
});
