import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// --- content.config.ts: activities collection schema ------------------------

test('content config defines an activities collection', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	assert.match(content, /const activities = defineCollection/);
});

test('activities collection glob loader targets src/content/activities', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const section = content.slice(content.indexOf('const activities'));
	assert.match(section, /base:\s*'\.\/src\/content\/activities'/);
});

test('activities schema is a discriminated union on kind with project and quiz branches', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const section = content.slice(content.indexOf('const activities'));
	assert.match(section, /z\.discriminatedUnion\('kind'/);
	assert.match(content, /kind:\s*z\.literal\('project'\)/);
	assert.match(content, /kind:\s*z\.literal\('quiz'\)/);
});

test('activity base fields cover course, lesson, slug, title, description, order, lang, published, estimatedMinutes', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const activitiesSection = content.slice(content.indexOf('// --- activities'));
	assert.match(activitiesSection, /course:\s*z\.string\(\)/);
	assert.match(activitiesSection, /lesson:\s*z\.string\(\)/);
	assert.match(activitiesSection, /slug:\s*z\.string\(\)/);
	assert.match(activitiesSection, /title:\s*z\.string\(\)/);
	assert.match(activitiesSection, /description:\s*z\.string\(\)/);
	assert.match(activitiesSection, /order:\s*z\.number\(\)\.int\(\)\.nonnegative\(\)/);
	assert.match(activitiesSection, /lang:\s*z\.enum\(\['es', 'en'\]\)/);
	assert.match(activitiesSection, /published:\s*z\.boolean\(\)\.default/);
	assert.match(activitiesSection, /estimatedMinutes:\s*z\.number\(\)\.int\(\)\.positive\(\)\.optional\(\)/);
});

test('quiz question schema is a discriminated union of single-choice and true-false', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	assert.match(content, /kind:\s*z\.literal\('single-choice'\)/);
	assert.match(content, /kind:\s*z\.literal\('true-false'\)/);
	assert.match(content, /correctOptionId:\s*z\.string\(\)/);
	assert.match(content, /correctAnswer:\s*z\.boolean\(\)/);
	assert.match(content, /explanation:\s*z\.string\(\)/);
});

test('project activity schema has objectives and requirements checklists', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const projectSection = content.slice(content.indexOf('const projectActivity'), content.indexOf('const quizActivity'));
	assert.match(projectSection, /objectives:\s*z\.array\(z\.string\(\)\)/);
	assert.match(projectSection, /requirements:\s*z\.array\(z\.string\(\)\)/);
});

test('export collections includes activities', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const exportLine = content.match(/export const collections = \{([^}]+)\}/);
	assert.ok(exportLine, 'export collections statement found');
	assert.match(exportLine[1], /activities/);
});

// --- src/utils/activities.ts: collection helpers -----------------------------

let activitiesModule;

test('src/utils/activities.ts can be loaded and exports the required helpers', async () => {
	activitiesModule = await import('../src/utils/activities.ts');
	assert.equal(typeof activitiesModule.getActivitiesForLesson, 'function');
	assert.equal(typeof activitiesModule.getActivityCountsForCourse, 'function');
	assert.equal(typeof activitiesModule.resolveActivityEntry, 'function');
});

function fakeEntry(overrides) {
	return {
		id: `${overrides.course}/${overrides.lesson}/${overrides.slug}__${overrides.lang ?? 'es'}`,
		collection: 'activities',
		data: {
			course: overrides.course,
			lesson: overrides.lesson,
			slug: overrides.slug,
			title: overrides.title ?? 'Title',
			description: overrides.description ?? 'Description',
			kind: overrides.kind ?? 'project',
			order: overrides.order ?? 1,
			lang: overrides.lang ?? 'es',
			published: overrides.published ?? true,
			...(overrides.extra ?? {}),
		},
	};
}

test('getActivitiesForLesson returns published activities for course+lesson+lang, sorted by order', () => {
	const entries = [
		fakeEntry({ course: 'java', lesson: '07-fundamentos-poo-clases-y-objetos', slug: 'quiz-1', order: 2, kind: 'quiz' }),
		fakeEntry({ course: 'java', lesson: '07-fundamentos-poo-clases-y-objetos', slug: 'project-1', order: 1, kind: 'project' }),
		fakeEntry({ course: 'java', lesson: 'other-lesson', slug: 'unrelated', order: 1 }),
		fakeEntry({ course: 'c', lesson: '07-fundamentos-poo-clases-y-objetos', slug: 'other-course', order: 1 }),
		fakeEntry({
			course: 'java',
			lesson: '07-fundamentos-poo-clases-y-objetos',
			slug: 'unpublished',
			order: 0,
			published: false,
		}),
	];

	const result = activitiesModule.getActivitiesForLesson(entries, 'java', '07-fundamentos-poo-clases-y-objetos', 'es');
	assert.deepEqual(
		result.map((entry) => entry.data.slug),
		['project-1', 'quiz-1'],
	);
});

test('getActivitiesForLesson returns an empty array for a lesson with no activities', () => {
	const result = activitiesModule.getActivitiesForLesson([], 'java', 'no-activities-lesson', 'es');
	assert.deepEqual(result, []);
});

test('getActivityCountsForCourse maps lesson slug to activity count, excluding unpublished and other courses', () => {
	const entries = [
		fakeEntry({ course: 'java', lesson: 'lesson-a', slug: 'p1' }),
		fakeEntry({ course: 'java', lesson: 'lesson-a', slug: 'q1', kind: 'quiz' }),
		fakeEntry({ course: 'java', lesson: 'lesson-b', slug: 'p2' }),
		fakeEntry({ course: 'java', lesson: 'lesson-b', slug: 'p2-unpub', published: false }),
		fakeEntry({ course: 'c', lesson: 'lesson-a', slug: 'other-course' }),
	];

	const counts = activitiesModule.getActivityCountsForCourse(entries, 'java', 'es');
	assert.equal(counts['lesson-a'], 2);
	assert.equal(counts['lesson-b'], 1);
	assert.equal(counts['other-course'], undefined);
});

test('resolveActivityEntry finds a published activity by course+lesson+slug+lang', () => {
	const entries = [
		fakeEntry({ course: 'java', lesson: '07-fundamentos-poo-clases-y-objetos', slug: 'quiz-1', kind: 'quiz' }),
	];
	const found = activitiesModule.resolveActivityEntry(entries, 'java', '07-fundamentos-poo-clases-y-objetos', 'quiz-1', 'es');
	assert.ok(found);
	assert.equal(found.data.slug, 'quiz-1');
});

test('resolveActivityEntry returns undefined for an unknown activity slug (no throw)', () => {
	const found = activitiesModule.resolveActivityEntry([], 'java', 'lesson', 'unknown-slug', 'es');
	assert.equal(found, undefined);
});
