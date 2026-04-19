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

test('article layout floats article images beside text on larger screens', async () => {
	const layout = await readFile('src/layouts/ArticleLayout.astro', 'utf8');
	assert.match(layout, /float: right/);
	assert.match(layout, /width: min\(48%, 320px\)/);
	assert.match(layout, /clear: both/);
	assert.match(layout, /@media \(width < 760px\)/);
});

test('article layout restores list markers for markdown lists', async () => {
	const layout = await readFile('src/layouts/ArticleLayout.astro', 'utf8');
	assert.match(layout, /list-style: disc/);
	assert.match(layout, /list-style: decimal/);
	assert.match(layout, /padding-left: 1\.5rem/);
	assert.match(layout, /:global\(li\)/);
});

test('article layout renders bold markdown text with neon accent styling', async () => {
	const layout = await readFile('src/layouts/ArticleLayout.astro', 'utf8');
	assert.match(layout, /:global\(strong\)/);
	assert.match(layout, /#F52D98/);
	assert.match(layout, /text-shadow/);
});

test('article layout justifies article body text', async () => {
	const layout = await readFile('src/layouts/ArticleLayout.astro', 'utf8');
	assert.match(layout, /\.article-body\s*\{/);
	assert.match(layout, /text-align: justify/);
});
