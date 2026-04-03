import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('author photos exist in public directory', async () => {
	await Promise.all([
		access('public/foto_facundo_01.png'),
		access('public/foto_facundo_02.png'),
	]);
	assert.ok(true);
});

test('hero and article layout reference author photos', async () => {
	const hero = await readFile('src/components/Hero.astro', 'utf8');
	const article = await readFile('src/layouts/ArticleLayout.astro', 'utf8');
	assert.match(hero, /foto_facundo_01\.png/);
	assert.match(article, /foto_facundo_02\.png/);
});
