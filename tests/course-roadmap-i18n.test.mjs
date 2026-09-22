import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('i18n dictionaries declare courses.roadmap.heading and courses.roadmap.hint in Spanish and English', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));

	assert.equal(typeof es.courses?.roadmap?.heading, 'string');
	assert.equal(typeof es.courses?.roadmap?.hint, 'string');
	assert.equal(typeof en.courses?.roadmap?.heading, 'string');
	assert.equal(typeof en.courses?.roadmap?.hint, 'string');

	assert.notEqual(es.courses.roadmap.heading, en.courses.roadmap.heading);
	assert.notEqual(es.courses.roadmap.hint, en.courses.roadmap.hint);
});
