import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('SiteHeader includes responsive mobile menu toggle button and aria attributes', async () => {
	const content = await readFile('src/components/SiteHeader.astro', 'utf8');
	assert.match(content, /class="[^"]*nav-toggle[^"]*"/);
	assert.match(content, /aria-expanded=/);
	assert.match(content, /aria-controls=/);
	assert.match(content, /aria-label=/);
});

test('SiteHeader includes responsive CSS rules for hiding and showing nav links', async () => {
	const content = await readFile('src/components/SiteHeader.astro', 'utf8');
	assert.match(content, /@media/);
	assert.match(content, /\.nav-links/);
	assert.match(content, /\.nav-toggle/);
});

test('SiteHeader includes client script for interactive menu toggle', async () => {
	const content = await readFile('src/components/SiteHeader.astro', 'utf8');
	assert.match(content, /<script>/);
	assert.match(content, /addEventListener\('click'/);
});

test('es.json and en.json include nav.toggle translation key', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));
	assert.ok(es.nav.toggle, 'es.json nav.toggle is missing');
	assert.ok(en.nav.toggle, 'en.json nav.toggle is missing');
});
