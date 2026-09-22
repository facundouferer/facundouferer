import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readComponent() {
	return readFile('src/components/CourseRoadmap.astro', 'utf8');
}

test('CourseRoadmap component renders nothing when there is no resolved roadmap', async () => {
	const content = await readComponent();
	assert.match(content, /return null/);
});

test('CourseRoadmap component uses native details/summary disclosure for the outer container and each folder', async () => {
	const content = await readComponent();
	assert.match(content, /<details/);
	assert.match(content, /<summary/);
	assert.match(content, /tree-root/);
	assert.match(content, /tree-folder/);
});

test('CourseRoadmap component uses Lucide icons at stroke-width 2.75 with closed/open folder states', async () => {
	const content = await readComponent();
	assert.match(content, /stroke-width="2\.75"/);
	assert.match(content, /tree-folder-icon--closed/);
	assert.match(content, /tree-folder-icon--open/);
});

test('CourseRoadmap component shows numbered module steps and lesson order badges', async () => {
	const content = await readComponent();
	assert.match(content, /tree-step/);
	assert.match(content, /\bbadge\b/);
});

test('CourseRoadmap component recurses over nested modules with Astro.self', async () => {
	const content = await readComponent();
	assert.match(content, /Astro\.self/);
});

test('CourseRoadmap component reads i18n heading/hint strings and locale-owned titles from the resolved roadmap', async () => {
	const content = await readComponent();
	assert.match(content, /courses\.roadmap\.heading/);
	assert.match(content, /courses\.roadmap\.hint/);
});

test('CourseRoadmap component contains no raw hex colors (tokens only)', async () => {
	const content = await readComponent();
	assert.doesNotMatch(content, /#[0-9a-fA-F]{3,8}\b/);
});

test('global.css defines reusable tree classes with tokens only, not one-off hex values', async () => {
	const css = await readFile('src/styles/global.css', 'utf8');
	assert.match(css, /\.tree\b/);
	assert.match(css, /\.tree-folder\b/);
	assert.match(css, /\.tree-item\b/);
	const treeSectionStart = css.indexOf('.tree-root');
	const treeSectionEnd = css.indexOf('/* Scroll', treeSectionStart);
	const treeSection = css.slice(treeSectionStart, treeSectionEnd === -1 ? undefined : treeSectionEnd);
	assert.doesNotMatch(treeSection, /#[0-9a-fA-F]{3,8}\b/);
});
