import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('article routes use locale-aware article selection helper', async () => {
	const esRoute = await readFile('src/pages/articulos/[slug].astro', 'utf8');
	const enRoute = await readFile('src/pages/en/articles/[slug].astro', 'utf8');
	const helper = await readFile('src/utils/articles.ts', 'utf8');

	assert.match(esRoute, /resolveArticleEntry\(/);
	assert.match(enRoute, /resolveArticleEntry\(/);
	assert.match(helper, /preferredLang/);
	assert.match(helper, /fallbackLang/);
	assert.match(helper, /item\.data\.lang === 'both'/);
});

test('article listings filter localized duplicates by locale', async () => {
	const catalog = await readFile('src/components/ArticlesCatalog.astro', 'utf8');
	const featured = await readFile('src/components/FeaturedArticles.astro', 'utf8');

	assert.match(catalog, /getArticlesForLocale\(/);
	assert.match(featured, /getArticlesForLocale\(/);
});
