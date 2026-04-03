import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('home pages compose required core sections', async () => {
	const esHome = await readFile('src/pages/index.astro', 'utf8');
	const enHome = await readFile('src/pages/en/index.astro', 'utf8');

	for (const section of ['Hero', 'ValueProp', 'Toolchain', 'Process', 'About', 'Contact']) {
		assert.match(esHome, new RegExp(`<${section}`));
		assert.match(enHome, new RegExp(`<${section}`));
	}
});
