import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('about photo uses the Organic washed circular treatment', async () => {
	const aboutComponent = await readFile('src/components/About.astro', 'utf8');

	assert.match(aboutComponent, /class="about-photo washed"/);
	assert.match(aboutComponent, /border-radius:\s*50%/);
	assert.doesNotMatch(aboutComponent, /orbital/);
	assert.doesNotMatch(aboutComponent, /conic-gradient/);
});
