import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('rss endpoint is defined with article collection source', async () => {
	const rssFile = await readFile('src/pages/rss.xml.js', 'utf8');
	assert.match(rssFile, /@astrojs\/rss/);
	assert.match(rssFile, /getCollection\('articles'\)/);
	assert.match(rssFile, /items:/);
});

test('base layout exposes rss link in head', async () => {
	const layout = await readFile('src/layouts/BaseLayout.astro', 'utf8');
	assert.match(layout, /application\/rss\+xml/);
	assert.match(layout, /href=\{withBase\('\/rss.xml'\)\}/);
});
