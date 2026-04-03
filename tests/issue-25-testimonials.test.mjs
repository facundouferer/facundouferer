import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('testimonials component provides three references', async () => {
	const content = await readFile('src/components/Testimonials.astro', 'utf8');
	assert.match(content, /Testimonials|Referencias/);
	assert.match(content, /items\.map/);
});

test('home pages include testimonials between about and contact', async () => {
	const esHome = await readFile('src/pages/index.astro', 'utf8');
	const enHome = await readFile('src/pages/en/index.astro', 'utf8');
	assert.match(esHome, /<Testimonials locale="es"/);
	assert.match(enHome, /<Testimonials locale="en"/);
});
