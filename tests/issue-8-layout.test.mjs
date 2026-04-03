import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('base layout defines hreflang alternates and metadata', async () => {
	const content = await readFile('src/layouts/BaseLayout.astro', 'utf8');
	assert.match(content, /hreflang="es"/);
	assert.match(content, /hreflang="en"/);
	assert.match(content, /meta property="og:title"/);
});

test('global styles expose design tokens from spec', async () => {
	const content = await readFile('src/styles/global.css', 'utf8');
	assert.match(content, /--color-bg: #050510/);
	assert.match(content, /--color-accent: #a855f7/);
	assert.match(content, /--color-cyan: #06b6d4/);
	assert.match(content, /--font-display: 'Syne'/);
});
