import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('hero component follows centered visual direction with gradient title', async () => {
	const hero = await readFile('src/components/Hero.astro', 'utf8');
	assert.match(hero, /hero-shell/);
	assert.match(hero, /hero-title/);
	assert.match(hero, /hero-gradient/);
	assert.match(hero, /hero-underline/);
	assert.match(hero, /hero-actions/);
});
