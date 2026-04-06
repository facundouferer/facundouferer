import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('about photo uses circular orbital neon treatment', async () => {
	const aboutComponent = await readFile('src/components/About.astro', 'utf8');

	assert.match(aboutComponent, /border-radius:\s*50%/);
	assert.match(aboutComponent, /max-width:\s*clamp\(220px,\s*32vw,\s*360px\)/);
	assert.match(aboutComponent, /animation:\s*orbital-base 12s linear infinite/);
	assert.match(aboutComponent, /animation:\s*orbital-layer-two 12s linear infinite/);
	assert.match(aboutComponent, /animation:\s*orbital-layer-three 12s linear infinite/);
	assert.match(aboutComponent, /@keyframes orbital-base/);
	assert.match(aboutComponent, /@keyframes orbital-layer-two/);
	assert.match(aboutComponent, /@keyframes orbital-layer-three/);
	assert.match(aboutComponent, /conic-gradient/);
});
