import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

test('LessonPresentationsMenu component exists', () => {
	assert.ok(existsSync('src/components/LessonPresentationsMenu.astro'));
});

test('LessonPresentationsMenu renders trigger button with Lucide presentation icon and aria attributes', async () => {
	const content = await readFile('src/components/LessonPresentationsMenu.astro', 'utf8');
	assert.match(content, /aria-haspopup="dialog"/);
	assert.match(content, /aria-expanded="false"/);
	assert.match(content, /stroke-width="2\.75"/);
	assert.match(content, /d="M2 3h20"/);
	assert.match(content, /btn/);
	assert.match(content, /data-lesson-presentations-trigger/);
});

test('LessonPresentationsMenu enforces display: none when hidden to prevent .card flex override', async () => {
	const content = await readFile('src/components/LessonPresentationsMenu.astro', 'utf8');
	// Must explicitly override .card { display: flex } when hidden
	assert.match(content, /\.lesson-presentations-panel\[hidden\]\s*\{\s*display:\s*none\s*!important;\s*\}/);
});

test('LessonPresentationsMenu renders presentation links with localized attributes and withBase', async () => {
	const content = await readFile('src/components/LessonPresentationsMenu.astro', 'utf8');
	assert.match(content, /withBase/);
	assert.match(content, /presentation\.slug/);
	assert.match(content, /locale === 'es'/);
	assert.match(content, /\/presentaciones\//);
	assert.match(content, /\/en\/presentaciones\//);
});

test('LessonPresentationsMenu includes accessible keyboard and click-outside dismissal script', async () => {
	const content = await readFile('src/components/LessonPresentationsMenu.astro', 'utf8');
	assert.match(content, /<script>/);
	assert.match(content, /Escape/);
	assert.match(content, /toggleMenu/);
	assert.match(content, /astro:page-load/);
});

test('Spanish lesson page integrates LessonPresentationsMenu next to the title header', async () => {
	const content = await readFile('src/pages/cursos/[course]/[lesson].astro', 'utf8');
	assert.match(content, /import LessonPresentationsMenu from '\.\.\/\.\.\/\.\.\/components\/LessonPresentationsMenu\.astro'/);
	assert.match(content, /<LessonPresentationsMenu/);
	assert.match(content, /lessonPresentations\.length > 0/);
});

test('English lesson page integrates LessonPresentationsMenu next to the title header', async () => {
	const content = await readFile('src/pages/en/courses/[course]/[lesson].astro', 'utf8');
	assert.match(content, /import LessonPresentationsMenu from '\.\.\/\.\.\/\.\.\/\.\.\/components\/LessonPresentationsMenu\.astro'/);
	assert.match(content, /<LessonPresentationsMenu/);
	assert.match(content, /lessonPresentations\.length > 0/);
});

test('i18n dictionaries include keys for the presentations menu', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));

	assert.ok(es.courses?.lessonPresentations?.menuButtonLabel, 'es has menuButtonLabel');
	assert.ok(en.courses?.lessonPresentations?.menuButtonLabel, 'en has menuButtonLabel');
	assert.ok(es.courses?.lessonPresentations?.menuHeading, 'es has menuHeading');
	assert.ok(en.courses?.lessonPresentations?.menuHeading, 'en has menuHeading');
});
