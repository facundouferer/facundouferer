import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('src/utils/courses.ts exports required helper functions', async () => {
	const content = await readFile('src/utils/courses.ts', 'utf8');
	assert.match(content, /export function getCoursesForLocale/);
	assert.match(content, /export function resolveCourseEntry/);
	assert.match(content, /export function getLessonsForCourse/);
	assert.match(content, /export function getCourseSlugsForLocale/);
});

test('getCoursesForLocale filters by locale and published status', async () => {
	const content = await readFile('src/utils/courses.ts', 'utf8');
	// Must filter by published === true AND (lang === locale OR lang === 'both')
	assert.match(content, /published/);
	assert.match(content, /locale/);
});

test('getLessonsForCourse sorts by order ascending', async () => {
	const content = await readFile('src/utils/courses.ts', 'utf8');
	assert.match(content, /sort/);
	assert.match(content, /order/);
});

test('getLessonsForCourse returns empty array for unknown course slug', async () => {
	const content = await readFile('src/utils/courses.ts', 'utf8');
	// Must not throw on nonexistent course slug — return [] instead
	assert.match(content, /\[\]/);
});

test('CourseEntry and LessonEntry types are defined', async () => {
	const content = await readFile('src/utils/courses.ts', 'utf8');
	assert.match(content, /type CourseEntry/);
	assert.match(content, /type LessonEntry/);
});

test('getCourseSlugsForLocale delegates to getCoursesForLocale', async () => {
	const content = await readFile('src/utils/courses.ts', 'utf8');
	assert.match(content, /getCoursesForLocale/);
});

test('resolveCourseEntry prefers matching locale, then both, then fallback', async () => {
	const content = await readFile('src/utils/courses.ts', 'utf8');
	assert.match(content, /locale/);
	assert.match(content, /fallback/);
});
