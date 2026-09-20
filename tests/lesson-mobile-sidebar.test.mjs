import { test } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'node:fs/promises';

test('i18n dictionaries include mobileNav keys for the mobile lessons drawer', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));

	assert.equal(es.courses?.mobileNav?.openButton, 'Temario');
	assert.equal(es.courses?.mobileNav?.dialogTitle, 'Temario del curso');
	assert.equal(es.courses?.mobileNav?.closeButton, 'Cerrar temario');

	assert.equal(en.courses?.mobileNav?.openButton, 'Lessons');
	assert.equal(en.courses?.mobileNav?.dialogTitle, 'Course lessons');
	assert.equal(en.courses?.mobileNav?.closeButton, 'Close lessons menu');
});

test('Spanish lesson page includes mobile sidebar floating trigger and drawer attributes', async () => {
	const content = await readFile('src/pages/cursos/[course]/[lesson].astro', 'utf8');

	assert.match(content, /data-mobile-sidebar-toggle/);
	assert.match(content, /aria-haspopup="dialog"/);
	assert.match(content, /aria-expanded="false"/);
	assert.match(content, /aria-controls="lesson-sidebar-drawer"/);
	assert.match(content, /id="lesson-sidebar-drawer"/);
	assert.match(content, /role="dialog"/);
	assert.match(content, /aria-modal="true"/);
	assert.match(content, /data-mobile-sidebar-close/);
	assert.match(content, /data-mobile-sidebar-backdrop/);
});

test('English lesson page includes mobile sidebar floating trigger and drawer attributes', async () => {
	const content = await readFile('src/pages/en/courses/[course]/[lesson].astro', 'utf8');

	assert.match(content, /data-mobile-sidebar-toggle/);
	assert.match(content, /aria-haspopup="dialog"/);
	assert.match(content, /aria-expanded="false"/);
	assert.match(content, /aria-controls="lesson-sidebar-drawer"/);
	assert.match(content, /id="lesson-sidebar-drawer"/);
	assert.match(content, /role="dialog"/);
	assert.match(content, /aria-modal="true"/);
	assert.match(content, /data-mobile-sidebar-close/);
	assert.match(content, /data-mobile-sidebar-backdrop/);
});

test('Lesson pages include responsive styles hiding mobile floating trigger on desktop', async () => {
	for (const file of [
		'src/pages/cursos/[course]/[lesson].astro',
		'src/pages/en/courses/[course]/[lesson].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /\.mobile-sidebar-toggle/);
		assert.match(content, /@media\s*\(width\s*>=\s*960px\)/);
		assert.match(content, /\.mobile-sidebar-toggle\s*\{[^}]*display:\s*none/);
	}
});

test('Lesson pages include client-side script for opening, closing, and keyboard dismissal', async () => {
	for (const file of [
		'src/pages/cursos/[course]/[lesson].astro',
		'src/pages/en/courses/[course]/[lesson].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /setupMobileSidebar/);
		assert.match(content, /Escape/);
		assert.match(content, /aria-expanded/);
		assert.match(content, /overflow/);
	}
});
