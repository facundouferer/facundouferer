import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('articles catalog includes category and tag filters', async () => {
	const content = await readFile('src/components/ArticlesCatalog.astro', 'utf8');
	assert.match(content, /category-filter/);
	assert.match(content, /tag-filter/);
	assert.match(content, /getArticlesForLocale\(/);
	assert.match(content, /getArticlePreviewImage\(/);
});

test('home pages include featured articles preview', async () => {
	const esHome = await readFile('src/pages/index.astro', 'utf8');
	const enHome = await readFile('src/pages/en/index.astro', 'utf8');
	assert.match(esHome, /<FeaturedArticles locale="es"/);
	assert.match(enHome, /<FeaturedArticles locale="en"/);
});

test('article cards can render a preview image when the article has one', async () => {
	const card = await readFile('src/components/ArticleCard.astro', 'utf8');
	assert.match(card, /article\.image/);
	assert.match(card, /<img/);
	assert.match(card, /article-card-image/);
});
