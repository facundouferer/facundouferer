import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('readme includes CV links and excludes professional experience section', async () => {
	const readme = await readFile('README.md', 'utf8');
	assert.match(readme, /https:\/\/github\.com\/facundouferer/);
	assert.match(readme, /linkedin\.com\/in\/facundouferer/);
	assert.match(readme, /https:\/\/facundouferer\.ar/);
	assert.doesNotMatch(readme, /PROFESSIONAL EXPERIENCE/i);
});
