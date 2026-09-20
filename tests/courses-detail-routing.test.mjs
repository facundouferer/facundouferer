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

test('LessonsList Lesson type accepts an optional presentationCount', async () => {
	const content = await readFile('src/components/LessonsList.astro', 'utf8');
	assert.match(content, /presentationCount\?:\s*number/);
});

test('LessonsList renders a presentation count badge conditionally in both variants', async () => {
	const content = await readFile('src/components/LessonsList.astro', 'utf8');
	assert.match(content, /class="badge/);
	const conditionOccurrences = content.match(/lesson\.presentationCount/g) ?? [];
	assert.ok(
		conditionOccurrences.length >= 2,
		'expected the presentationCount condition to appear in both the cards and list variants',
	);
});

test('course detail pages compute presentation counts and pass them into LessonsList', async () => {
	for (const file of [
		'src/pages/cursos/[course]/index.astro',
		'src/pages/en/courses/[course]/index.astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(
			content,
			/getPresentationCountsForCourse/,
			`${file} should import getPresentationCountsForCourse`,
		);
		assert.match(content, /presentationCount/, `${file} should pass presentationCount into LessonsList`);
	}
});

test('lesson detail pages pass presentationCount into the sidebar LessonsList', async () => {
	for (const file of [
		'src/pages/cursos/[course]/[lesson].astro',
		'src/pages/en/courses/[course]/[lesson].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(
			content,
			/getPresentationCountsForCourse/,
			`${file} should import getPresentationCountsForCourse`,
		);
		assert.match(
			content,
			/presentationCount/,
			`${file} should pass presentationCount into the sidebar LessonsList`,
		);
	}
});

test('lesson detail pages render presentations for the current lesson via LessonPresentations', async () => {
	for (const file of [
		'src/pages/cursos/[course]/[lesson].astro',
		'src/pages/en/courses/[course]/[lesson].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /getPresentationsForLesson/, `${file} should import getPresentationsForLesson`);
		assert.match(content, /LessonPresentations/, `${file} should render LessonPresentations`);
	}
});

test('LessonPresentations component exists', () => {
	assert.ok(existsSync('src/components/LessonPresentations.astro'));
});

test('LessonPresentations renders a card per presentation using system classes and the open i18n key', async () => {
	const content = await readFile('src/components/LessonPresentations.astro', 'utf8');
	assert.match(content, /presentations:\s*Presentation\[\]/);
	assert.match(content, /locale/);
	assert.match(content, /class="card /);
	assert.match(content, /presentations\.card\.open/);
});

test('i18n dictionaries expose lesson-presentation badge and heading keys', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));
	for (const dict of [es, en]) {
		assert.ok(dict.courses?.lessonPresentations?.badge?.one, 'courses.lessonPresentations.badge.one present');
		assert.ok(dict.courses?.lessonPresentations?.badge?.other, 'courses.lessonPresentations.badge.other present');
		assert.ok(dict.courses?.lessonPresentations?.heading, 'courses.lessonPresentations.heading present');
	}
	assert.equal(es.courses.lessonPresentations.badge.one, '1 presentación');
	assert.equal(en.courses.lessonPresentations.badge.one, '1 presentation');
});
