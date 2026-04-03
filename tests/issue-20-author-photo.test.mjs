import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('author photos exist in public directory', async () => {
	await Promise.all([
		access('public/foto_facundo_01.png'),
		access('public/foto_facundo_02.png'),
		access('public/foto_facundo_03.png'),
	]);
	assert.ok(true);
});

test('about and article layout reference author photos', async () => {
	const about = await readFile('src/components/About.astro', 'utf8');
	const article = await readFile('src/layouts/ArticleLayout.astro', 'utf8');
	assert.match(about, /foto_facundo_01\.png/);
	assert.match(about, /foto_facundo_02\.png/);
	assert.match(about, /foto_facundo_03\.png/);
	assert.match(about, /glitch/);
	assert.match(article, /foto_facundo_02\.png/);
});
