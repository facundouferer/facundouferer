import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('language switch uses flag emojis instead of ES/EN text', async () => {
	const content = await readFile('src/components/LanguageSwitch.astro', 'utf8');
	assert.match(content, /🇦🇷/);
	assert.match(content, /🇺🇸/);
	assert.doesNotMatch(content, />ES</);
	assert.doesNotMatch(content, />EN</);
});
