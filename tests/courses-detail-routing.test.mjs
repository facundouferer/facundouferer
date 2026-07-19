import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

test('course detail page exists at src/pages/cursos/[course]/index.astro', () => {
	assert.ok(existsSync('src/pages/cursos/[course]/index.astro'));
});

test('course detail page uses getStaticPaths with getCourseSlugsForLocale', async () => {
	const content = await readFile('src/pages/cursos/[course]/index.astro', 'utf8');
	assert.match(content, /getStaticPaths/);
	assert.match(content, /getCourseSlugsForLocale/);
});

test('course detail page calls getLessonsForCourse and renders LessonsList', async () => {
	const content = await readFile('src/pages/cursos/[course]/index.astro', 'utf8');
	assert.match(content, /getLessonsForCourse/);
	assert.match(content, /LessonsList/);
	assert.match(content, /CourseBreadcrumb/);
});

test('lesson page exists at src/pages/cursos/[course]/[lesson].astro', () => {
	assert.ok(existsSync('src/pages/cursos/[course]/[lesson].astro'));
});

test('lesson page uses render from astro:content', async () => {
	const content = await readFile('src/pages/cursos/[course]/[lesson].astro', 'utf8');
	assert.match(content, /render/);
	assert.match(content, /render\(/);
});

test('lesson page uses getStaticPaths to emit course-lesson pairs', async () => {
	const content = await readFile('src/pages/cursos/[course]/[lesson].astro', 'utf8');
	assert.match(content, /getStaticPaths/);
	assert.match(content, /params:\s*\{ course/);
});

test('lesson page renders CourseBreadcrumb with lesson title', async () => {
	const content = await readFile('src/pages/cursos/[course]/[lesson].astro', 'utf8');
	assert.match(content, /CourseBreadcrumb/);
});

test('English course detail page exists at src/pages/en/courses/[course]/index.astro', () => {
	assert.ok(existsSync('src/pages/en/courses/[course]/index.astro'));
});

test('English lesson page exists at src/pages/en/courses/[course]/[lesson].astro', () => {
	assert.ok(existsSync('src/pages/en/courses/[course]/[lesson].astro'));
});

test('English course detail page uses getLessonsForCourse with en locale', async () => {
	const content = await readFile('src/pages/en/courses/[course]/index.astro', 'utf8');
	assert.match(content, /getLessonsForCourse/);
});

test('English lesson page uses render and CourseBreadcrumb', async () => {
	const content = await readFile('src/pages/en/courses/[course]/[lesson].astro', 'utf8');
	assert.match(content, /render\(/);
	assert.match(content, /CourseBreadcrumb/);
});

test('CourseBreadcrumb component exists', () => {
	assert.ok(existsSync('src/components/CourseBreadcrumb.astro'));
});

test('CourseBreadcrumb renders locale-aware breadcrumb with course and optional lesson', async () => {
	const content = await readFile('src/components/CourseBreadcrumb.astro', 'utf8');
	assert.match(content, /courseSlug/);
	assert.match(content, /courseTitle/);
	assert.match(content, /locale/);
});

test('LessonsList component exists', () => {
	assert.ok(existsSync('src/components/LessonsList.astro'));
});

test('LessonsList component renders ordered list of lesson links', async () => {
	const content = await readFile('src/components/LessonsList.astro', 'utf8');
	assert.match(content, /lessons/);
	assert.match(content, /courseSlug/);
	assert.match(content, /locale/);
	assert.match(content, /lesson\.slug/);
});
