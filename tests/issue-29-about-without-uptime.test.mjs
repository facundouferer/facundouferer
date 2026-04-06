import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('about section does not render uptime stat copy', async () => {
	const aboutComponent = await readFile('src/components/About.astro', 'utf8');

	assert.doesNotMatch(aboutComponent, /99\.99%/);
	assert.doesNotMatch(aboutComponent, /Uptime promedio/);
	assert.doesNotMatch(aboutComponent, /Average Uptime/);
	assert.doesNotMatch(aboutComponent, /about-stats/);
});
