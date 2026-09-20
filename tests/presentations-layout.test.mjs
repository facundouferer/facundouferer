import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const PRESENTATIONS_DIR = 'src/components/presentaciones';

// Baseline raw-hex-literal count in src/components/presentaciones, measured with
// `rg -oP "(?<!&)#[0-9a-fA-F]{3,8}\b" src/components/presentaciones -g '!*.svg' | wc -l`
// (the lookbehind excludes HTML numeric entities such as `&#123;`, which are not colors)
// before this layout change. These components predate the Organic design system
// and carry their own literal palettes (see DESIGN.md §9); this change only
// touches layout (width/height/flex), never color, so the count must not grow.
const BASELINE_HEX_COUNT = 389;

function extractRule(content, selector) {
	const re = new RegExp(`\\.${selector}\\s*\\{[\\s\\S]*?\\}`);
	return content.match(re)?.[0];
}

async function getPresentationFiles() {
	const files = await readdir(PRESENTATIONS_DIR);
	return files.filter((f) => f.endsWith('.astro')).sort();
}

test('every presentation component drops its <header class="XX-header"> block', async () => {
	const files = await getPresentationFiles();
	assert.equal(files.length, 47, 'expected 47 presentation components');

	for (const file of files) {
		const content = await readFile(`${PRESENTATIONS_DIR}/${file}`, 'utf8');
		assert.doesNotMatch(
			content,
			/<header class="[a-z]{2}-header"/,
			`${file} should no longer render a <header class="XX-header"> block`,
		);
	}
});

test('every presentation shell is fluid (full width, no max-width cap)', async () => {
	const files = await getPresentationFiles();

	for (const file of files) {
		const content = await readFile(`${PRESENTATIONS_DIR}/${file}`, 'utf8');
		const prefix = content.match(/class="([a-z]{2})-screen"/)?.[1];
		assert.ok(prefix, `${file} should still expose an XX-screen root class`);

		const shellRule = extractRule(content, `${prefix}-shell`);
		assert.ok(shellRule, `${file} should still define .${prefix}-shell`);
		assert.match(shellRule, /max-width:\s*none/, `${file}'s .${prefix}-shell should drop its max-width cap`);
		assert.match(shellRule, /width:\s*100%/, `${file}'s .${prefix}-shell should be full width`);
	}
});

test('every presentation screen fills the viewport height below the site header', async () => {
	const files = await getPresentationFiles();

	for (const file of files) {
		const content = await readFile(`${PRESENTATIONS_DIR}/${file}`, 'utf8');
		const prefix = content.match(/class="([a-z]{2})-screen"/)?.[1];
		const screenRule = extractRule(content, `${prefix}-screen`);
		assert.ok(screenRule, `${file} should still define .${prefix}-screen`);
		assert.match(screenRule, /100dvh/, `${file}'s .${prefix}-screen should size against 100dvh`);
	}
});

test('no presentation simulator container keeps a fixed pixel max-width cap', async () => {
	const files = await getPresentationFiles();

	for (const file of files) {
		const content = await readFile(`${PRESENTATIONS_DIR}/${file}`, 'utf8');
		assert.doesNotMatch(
			content,
			/max-width:\s*(800|840|500)px/,
			`${file} should not keep an 800px/840px/500px simulator cap`,
		);
	}
});

test('raw hex literal count in src/components/presentaciones does not increase', async () => {
	const files = await getPresentationFiles();
	let total = 0;
	const hexPattern = /(?<!&)#[0-9a-fA-F]{3,8}\b/g;
	for (const file of files) {
		const content = await readFile(`${PRESENTATIONS_DIR}/${file}`, 'utf8');
		total += (content.match(hexPattern) || []).length;
	}
	assert.ok(
		total <= BASELINE_HEX_COUNT,
		`expected raw hex count to stay at or below baseline ${BASELINE_HEX_COUNT}, got ${total}`,
	);
});

test('src/styles/global.css defines a --site-header-height token', async () => {
	const content = await readFile('src/styles/global.css', 'utf8');
	assert.match(content, /--site-header-height:\s*[^;]+;/);
});

test('presentation detail pages keep PresentationLessonLink in a full-width, compact wrapper', async () => {
	for (const file of ['src/pages/presentaciones/[slug].astro', 'src/pages/[lang]/presentaciones/[slug].astro']) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /<PresentationLessonLink/, `${file} should still render <PresentationLessonLink>`);
		assert.doesNotMatch(
			content,
			/class="container presentation-lesson-link-wrap"/,
			`${file} should not cap the presentation-lesson-link-wrap with .container`,
		);
		assert.match(
			content,
			/\.presentation-lesson-link-wrap\s*\{[^}]*padding:\s*var\(--space-3\)\s*var\(--space-6\)\s*0\s*var\(--space-8\)/,
			`${file} should indent presentation-lesson-link-wrap with var(--space-*) padding`,
		);
	}
});

test('every presentation viewport centers the active slide and scales it on wide screens', async () => {
	const files = await getPresentationFiles();

	for (const file of files) {
		const content = await readFile(`${PRESENTATIONS_DIR}/${file}`, 'utf8');
		const prefix = content.match(/class="([a-z]{2})-screen"/)?.[1];
		assert.match(
			content,
			new RegExp(`\\.${prefix}-viewport \\{ display: flex; flex-direction: column; justify-content: center; \\}`),
			`${file} should vertically center the active slide inside .${prefix}-viewport`,
		);
		const zoomSteps = content.match(new RegExp(`@media \\(min-width: \\d+px\\) \\{ \\.${prefix}-viewport \\{ zoom: [0-9.]+; \\} \\}`, 'g')) ?? [];
		assert.equal(zoomSteps.length, 3, `${file} should define three wide-screen zoom steps for .${prefix}-viewport`);
	}
});
