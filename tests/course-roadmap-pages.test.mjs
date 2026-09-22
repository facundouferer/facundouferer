import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function assertRoadmapWiredBetweenHeaderAndLessons(file) {
	const content = await readFile(file, 'utf8');

	assert.match(content, /import CourseRoadmap from ['"].*CourseRoadmap\.astro['"]/);
	assert.match(content, /resolveRoadmap/);

	const headerIndex = content.indexOf('course-header');
	const roadmapIndex = content.indexOf('<CourseRoadmap');
	const lessonsIndex = content.indexOf('lessons-section');

	assert.notEqual(headerIndex, -1, `${file}: missing course-header`);
	assert.notEqual(roadmapIndex, -1, `${file}: missing <CourseRoadmap usage`);
	assert.notEqual(lessonsIndex, -1, `${file}: missing lessons-section`);
	assert.ok(headerIndex < roadmapIndex, `${file}: CourseRoadmap must come after .course-header`);
	assert.ok(roadmapIndex < lessonsIndex, `${file}: CourseRoadmap must come before .lessons-section`);
}

test('Spanish course page renders CourseRoadmap between the header and the lessons section', async () => {
	await assertRoadmapWiredBetweenHeaderAndLessons('src/pages/cursos/[course]/index.astro');
});

test('English course page renders CourseRoadmap between the header and the lessons section', async () => {
	await assertRoadmapWiredBetweenHeaderAndLessons('src/pages/en/courses/[course]/index.astro');
});
