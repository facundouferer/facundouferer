import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('contact component includes required fields and mailto strategy', async () => {
	const content = await readFile('src/components/Contact.astro', 'utf8');
	assert.match(content, /name="name"/);
	assert.match(content, /name="email"/);
	assert.match(content, /name="project"/);
	assert.match(content, /action=\{`mailto:\$\{SOCIAL_LINKS\.email\.replace/);
});

test('contact component exposes social links', async () => {
	const content = await readFile('src/components/Contact.astro', 'utf8');
	assert.match(content, /LinkedIn/);
	assert.match(content, /GitHub/);
	assert.match(content, /Twitter\/X/);
});
