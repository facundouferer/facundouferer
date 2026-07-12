import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('hero component follows the Organic left-aligned direction with an accented word', async () => {
	const hero = await readFile('src/components/Hero.astro', 'utf8');
	assert.match(hero, /hero-shell/);
	assert.match(hero, /hero-title/);
	assert.match(hero, /accent-word/);
	assert.match(hero, /hero-actions/);
	assert.match(hero, /btn-primary/);
	assert.match(hero, /btn-ghost/);
	assert.doesNotMatch(hero, /typewriter/);
	assert.doesNotMatch(hero, /Years of Experience/);
	assert.doesNotMatch(hero, /Projects Delivered/);
	assert.doesNotMatch(hero, /Stacks Mastered/);
});
