import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const COURSES = ['c', 'git', 'java', 'javascript'];

test('course logo exists at public/img/courses/<slug>/logo.svg for all 4 courses', () => {
	for (const course of COURSES) {
		const logoPath = `public/img/courses/${course}/logo.svg`;
		assert.ok(
			existsSync(logoPath),
			`Logo not found at ${logoPath}`,
		);
	}
});

test('no logo.svg remains under src/content/courses/', async () => {
	for (const course of COURSES) {
		const files = await readdir(`src/content/courses/${course}`);
		const hasLogo = files.includes('logo.svg');
		assert.ok(
			!hasLogo,
			`logo.svg still present at src/content/courses/${course}/logo.svg`,
		);
	}
});

test('each course index.md image field points to /img/courses/<slug>/logo.svg', async () => {
	for (const course of COURSES) {
		const content = await readFile(`src/content/courses/${course}/index.md`, 'utf8');
		const match = content.match(/image:\s*['"]?([^'"\n]+)['"]?/);
		assert.ok(match, `image field not found in ${course}/index.md`);
		assert.equal(
			match[1],
			`/img/courses/${course}/logo.svg`,
			`Unexpected image path in ${course}/index.md: ${match[1]}`,
		);
	}
});
