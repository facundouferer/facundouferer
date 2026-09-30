import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('lesson detail pages import resolveRoadmap and pass roadmap to LessonsList', async () => {
	for (const file of [
		'src/pages/cursos/[course]/[lesson].astro',
		'src/pages/en/courses/[course]/[lesson].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /import\s*\{\s*resolveRoadmap\s*\}\s*from/, `${file} should import resolveRoadmap`);
		assert.match(content, /const\s+roadmap\s*=\s*resolveRoadmap\(/, `${file} should call resolveRoadmap`);
		assert.match(content, /roadmap=\{roadmap\}/, `${file} should pass roadmap prop to LessonsList`);
	}
});

test('LessonsList accepts roadmap prop and renders tree-folder structure in sidebar variant', async () => {
	const content = await readFile('src/components/LessonsList.astro', 'utf8');
	assert.match(content, /roadmap\?:\s*ResolvedRoadmapNode\[\]/);
	assert.match(content, /tree-folder/);
	assert.match(content, /tree-step/);
	assert.match(content, /tree-folder-icon--closed/);
	assert.match(content, /tree-folder-icon--open/);
	assert.match(content, /sidebar-tree/);
	assert.match(content, /tree-item-link--active/);
});

test('all 4 courses declare a roadmap in their index.md', async () => {
	for (const course of ['git', 'javascript', 'c', 'java']) {
		const file = `src/content/courses/${course}/index.md`;
		const content = await readFile(file, 'utf8');
		assert.match(content, /\nroadmap:\s*\n/, `${file} must declare roadmap in frontmatter`);
	}
});

test('sidebar roadmap tree does not render presentation or activity badges', async () => {
	const content = await readFile('src/components/LessonsList.astro', 'utf8');
	const sidebarTreeStart = content.indexOf('class="tree sidebar-tree"');
	const sidebarTreeEnd = content.indexOf(') : (', sidebarTreeStart);
	const sidebarTreeSection = content.slice(sidebarTreeStart, sidebarTreeEnd);
	assert.doesNotMatch(sidebarTreeSection, /lesson-badges/);
	assert.doesNotMatch(sidebarTreeSection, /lesson-presentation-badge/);
	assert.doesNotMatch(sidebarTreeSection, /lesson-activity-badge/);
});

