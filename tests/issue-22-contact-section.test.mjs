import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('contact component renders centered social hub without form fields', async () => {
	const content = await readFile('src/components/Contact.astro', 'utf8');
	assert.match(content, /social-hub/);
	assert.doesNotMatch(content, /name="name"/);
	assert.doesNotMatch(content, /name="email"/);
	assert.doesNotMatch(content, /name="project"/);
});

test('contact component exposes social links', async () => {
	const content = await readFile('src/components/Contact.astro', 'utf8');
	assert.match(content, /aria-label="LinkedIn"/);
	assert.match(content, /aria-label="GitHub"/);
	assert.match(content, /aria-label="Email"/);
	assert.match(content, /aria-label="Twitter\/X"/);
});
