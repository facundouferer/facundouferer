import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('featured projects component limits cards to two items', async () => {
	const content = await readFile('src/components/FeaturedProjects.astro', 'utf8');
	assert.match(content, /slice\(0, 2\)/);
	assert.match(content, /getCollection\('projects'\)/);
});

test('home pages render featured projects section', async () => {
	const esHome = await readFile('src/pages/index.astro', 'utf8');
	const enHome = await readFile('src/pages/en/index.astro', 'utf8');
	assert.match(esHome, /<FeaturedProjects locale="es"/);
	assert.match(enHome, /<FeaturedProjects locale="en"/);
});
