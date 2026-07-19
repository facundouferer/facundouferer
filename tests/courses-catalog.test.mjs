import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

test('courses catalog page exists at src/pages/cursos/index.astro', () => {
	assert.ok(existsSync('src/pages/cursos/index.astro'));
});

test('courses catalog uses getCoursesForLocale with es locale', async () => {
	const content = await readFile('src/pages/cursos/index.astro', 'utf8');
	assert.match(content, /getCoursesForLocale\(/);
	assert.match(content, /'es'/);
});

test('courses catalog renders CourseCard component', async () => {
	const content = await readFile('src/pages/cursos/index.astro', 'utf8');
	assert.match(content, /CourseCard/);
	assert.match(content, /locale="es"/);
});

test('courses catalog uses BaseLayout with lang-derived locale', async () => {
	const content = await readFile('src/pages/cursos/index.astro', 'utf8');
	assert.match(content, /BaseLayout/);
	assert.match(content, /getLangFromUrl\(Astro\.url\)/);
	assert.match(content, /useTranslations/);
});

test('CourseCard component exists and renders course metadata', async () => {
	assert.ok(existsSync('src/components/CourseCard.astro'));
	const content = await readFile('src/components/CourseCard.astro', 'utf8');
	assert.match(content, /course\.image/);
	assert.match(content, /course\.title/);
	assert.match(content, /course\.description/);
	assert.match(content, /course\.difficulty/);
	assert.match(content, /\/(cursos|courses)\/.*slug/);
});

test('English courses catalog exists at src/pages/en/courses/index.astro', () => {
	assert.ok(existsSync('src/pages/en/courses/index.astro'));
});

test('English courses catalog uses getCoursesForLocale with en locale', async () => {
	const content = await readFile('src/pages/en/courses/index.astro', 'utf8');
	assert.match(content, /getCoursesForLocale\(/);
	assert.match(content, /'en'/);
});
