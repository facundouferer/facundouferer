import test from 'node:test';
import assert from 'node:assert/strict';

let roadmapModule;

test('src/utils/roadmap.ts can be loaded and exports resolveRoadmap', async () => {
	roadmapModule = await import('../src/utils/roadmap.ts');
	assert.equal(typeof roadmapModule.resolveRoadmap, 'function');
});

function fakeLesson(slug, order, title) {
	return {
		id: `demo/${slug}__es`,
		collection: 'lessons',
		data: {
			course: 'demo',
			slug,
			title: title ?? `Title ${slug}`,
			order,
			lang: 'es',
			published: true,
		},
	};
}

test('resolveRoadmap returns undefined when the course has no roadmap', () => {
	const result = roadmapModule.resolveRoadmap(undefined, [fakeLesson('a', 1)], 'es', 'demo');
	assert.equal(result, undefined);
});

test('resolveRoadmap returns undefined when the roadmap is an empty array', () => {
	const result = roadmapModule.resolveRoadmap([], [fakeLesson('a', 1)], 'es', 'demo');
	assert.equal(result, undefined);
});

test('resolveRoadmap resolves lesson leaves with step number, order and href (Spanish)', () => {
	const lessons = [fakeLesson('a', 1, 'A'), fakeLesson('b', 2, 'B')];
	const roadmap = [{ title: 'Modulo 1', title_en: 'Module 1', lessons: ['a', 'b'] }];

	const [resolved] = roadmapModule.resolveRoadmap(roadmap, lessons, 'es', 'demo');

	assert.equal(resolved.kind, 'lessons');
	assert.equal(resolved.step, '1');
	assert.equal(resolved.title, 'Modulo 1');
	assert.deepEqual(resolved.lessons.map((l) => l.slug), ['a', 'b']);
	assert.equal(resolved.lessons[0].order, 1);
	assert.equal(resolved.lessons[0].title, 'A');
	assert.equal(resolved.lessons[0].href, '/cursos/demo/a');
});

test('resolveRoadmap resolves English titles, English hrefs, and dotted group/child steps', () => {
	const lessons = [fakeLesson('a', 1), fakeLesson('b', 2), fakeLesson('c', 3)];
	const roadmap = [
		{
			title: 'Grupo',
			title_en: 'Group',
			children: [
				{ title: 'Sub 1', title_en: 'Sub 1 EN', lessons: ['a', 'b'] },
				{ title: 'Sub 2', title_en: 'Sub 2 EN', lessons: ['c'] },
			],
		},
	];

	const [group] = roadmapModule.resolveRoadmap(roadmap, lessons, 'en', 'demo');

	assert.equal(group.kind, 'group');
	assert.equal(group.step, '1');
	assert.equal(group.title, 'Group');
	assert.equal(group.children[0].step, '1.1');
	assert.equal(group.children[0].title, 'Sub 1 EN');
	assert.equal(group.children[1].step, '1.2');
	assert.equal(group.children[0].lessons[0].href, '/en/courses/demo/a');
});

test('resolveRoadmap carries an optional localized description', () => {
	const lessons = [fakeLesson('a', 1)];
	const roadmap = [
		{ title: 'M', title_en: 'M EN', description: 'Desc ES', description_en: 'Desc EN', lessons: ['a'] },
	];

	const [es] = roadmapModule.resolveRoadmap(roadmap, lessons, 'es', 'demo');
	const [en] = roadmapModule.resolveRoadmap(roadmap, lessons, 'en', 'demo');

	assert.equal(es.description, 'Desc ES');
	assert.equal(en.description, 'Desc EN');
});

test('resolveRoadmap throws when a roadmap lesson slug does not exist', () => {
	const lessons = [fakeLesson('a', 1)];
	const roadmap = [{ title: 'M', title_en: 'M', lessons: ['missing'] }];

	assert.throws(
		() => roadmapModule.resolveRoadmap(roadmap, lessons, 'es', 'demo'),
		/no published lesson/i,
	);
});

test('resolveRoadmap throws when a lesson slug appears more than once', () => {
	const lessons = [fakeLesson('a', 1), fakeLesson('b', 2)];
	const roadmap = [
		{ title: 'M1', title_en: 'M1', lessons: ['a'] },
		{ title: 'M2', title_en: 'M2', lessons: ['a', 'b'] },
	];

	assert.throws(
		() => roadmapModule.resolveRoadmap(roadmap, lessons, 'es', 'demo'),
		/more than once/i,
	);
});

test('resolveRoadmap throws when a published lesson is missing from the roadmap', () => {
	const lessons = [fakeLesson('a', 1), fakeLesson('b', 2)];
	const roadmap = [{ title: 'M', title_en: 'M', lessons: ['a'] }];

	assert.throws(
		() => roadmapModule.resolveRoadmap(roadmap, lessons, 'es', 'demo'),
		/missing published lesson/i,
	);
});

test('resolveRoadmap throws when the flattened depth-first order does not match the lessons order', () => {
	const lessons = [fakeLesson('a', 1), fakeLesson('b', 2)];
	const roadmap = [{ title: 'M', title_en: 'M', lessons: ['b', 'a'] }];

	assert.throws(
		() => roadmapModule.resolveRoadmap(roadmap, lessons, 'es', 'demo'),
		/does not match the lessons' order/i,
	);
});

test('resolveRoadmap throws when a node declares neither lessons nor children', () => {
	const lessons = [fakeLesson('a', 1)];
	const roadmap = [{ title: 'M', title_en: 'M' }];

	assert.throws(
		() => roadmapModule.resolveRoadmap(roadmap, lessons, 'es', 'demo'),
		/must declare either/i,
	);
});
