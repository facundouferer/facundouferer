import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const COURSES = ['c', 'git', 'java', 'javascript'];

test('no filename under src/content/courses/ contains spaces', async () => {
	for (const course of COURSES) {
		const files = await readdir(`src/content/courses/${course}`);
		for (const file of files) {
			if (file === 'index.md' || file === 'logo.svg' || file === '.DS_Store') continue;
			assert.ok(
				!file.includes(' '),
				`File "${course}/${file}" contains spaces`,
			);
		}
	}
});

test('no filename contains the typo "prinicpio"', async () => {
	for (const course of COURSES) {
		const files = await readdir(`src/content/courses/${course}`);
		for (const file of files) {
			assert.ok(
				!file.includes('prinicpio'),
				`File "${course}/${file}" still has typo "prinicpio"`,
			);
		}
	}
});

test('no raw .md lesson files remain (all must be .es.md or .en.md)', async () => {
	for (const course of COURSES) {
		const files = await readdir(`src/content/courses/${course}`);
		const rawLessonFiles = files.filter(
			(f) => f.endsWith('.md') && f !== 'index.md' && !f.endsWith('.es.md') && !f.endsWith('.en.md'),
		);
		assert.equal(
			rawLessonFiles.length,
			0,
			`Course "${course}" has ${rawLessonFiles.length} raw .md files that should be .es.md/.en.md: ${rawLessonFiles.join(', ')}`,
		);
	}
});

test('each lesson has both .es.md and .en.md sibling with shared stem', async () => {
	for (const course of COURSES) {
		const files = await readdir(`src/content/courses/${course}`);
		const esFiles = files.filter((f) => f.endsWith('.es.md'));
		const enStems = new Set(
			files.filter((f) => f.endsWith('.en.md')).map((f) => f.replace(/\.en\.md$/, '')),
		);

		for (const esFile of esFiles) {
			const stem = esFile.replace(/\.es\.md$/, '');
			assert.ok(
				enStems.has(stem),
				`Missing .en.md for "${stem}" in course "${course}"`,
			);
		}

		// Also check reverse: every .en.md has a .es.md sibling
		const esStems = new Set(esFiles.map((f) => f.replace(/\.es\.md$/, '')));
		const enFiles = files.filter((f) => f.endsWith('.en.md'));
		for (const enFile of enFiles) {
			const stem = enFile.replace(/\.en\.md$/, '');
			assert.ok(
				esStems.has(stem),
				`Missing .es.md for "${stem}" in course "${course}"`,
			);
		}

		// If there are .es.md files, ensure there's at least one pair
		if (esFiles.length > 0) {
			assert.ok(
				esFiles.length <= enFiles.length + 1,
				`Mismatch in .es.md (${esFiles.length}) vs .en.md (${enFiles.length}) counts for course "${course}"`,
			);
		}
	}
});

test('unique numeric prefix per course', async () => {
	for (const course of COURSES) {
		const files = await readdir(`src/content/courses/${course}`);
		// Get unique stems by stripping locale suffix
		const stems = new Set(
			files
				.filter((f) => f.endsWith('.es.md') || f.endsWith('.en.md'))
				.map((f) => f.replace(/\.(es|en)\.md$/, '')),
		);
		const seenPrefixes = new Set();

		for (const stem of stems) {
			const match = stem.match(/^(\d+)-/);
			if (!match) continue;

			const prefix = match[1];
			assert.ok(
				!seenPrefixes.has(prefix),
				`Duplicate numeric prefix "${prefix}" in course "${course}" (stem: ${stem})`,
			);
			seenPrefixes.add(prefix);
		}
	}
});

test('index.md exists exactly once per course folder for all 4 courses', async () => {
	for (const course of COURSES) {
		const files = await readdir(`src/content/courses/${course}`);
		const indexFiles = files.filter((f) => f === 'index.md');
		assert.equal(indexFiles.length, 1, `Course "${course}" should have exactly 1 index.md`);
	}
});

test('specific known lesson stem examples exist', async () => {
	// Cross-check specific examples
	const checkLesson = (course, stem) => {
		assert.ok(existsSync(`src/content/courses/${course}/${stem}.es.md`), `Missing ${course}/${stem}.es.md`);
		assert.ok(existsSync(`src/content/courses/${course}/${stem}.en.md`), `Missing ${course}/${stem}.en.md`);
	};

	checkLesson('java', '01-conceptos-basicos');
	checkLesson('javascript', '01-introduccion');
	checkLesson('c', '02-procesos-y-estados');
});
