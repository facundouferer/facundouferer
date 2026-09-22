import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('content config defines a recursive roadmapNodeSchema with z.lazy', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	assert.match(content, /const roadmapNodeSchema[^=]*=\s*z\.lazy\(/);
});

test('roadmap node schema declares bilingual titles, optional bilingual descriptions, and a lessons array', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const section = content.slice(content.indexOf('const roadmapNodeSchema'), content.indexOf('const courses'));
	assert.match(section, /title:\s*z\.string\(\)/);
	assert.match(section, /title_en:\s*z\.string\(\)/);
	assert.match(section, /description:\s*z\.string\(\)\.optional\(\)/);
	assert.match(section, /description_en:\s*z\.string\(\)\.optional\(\)/);
	assert.match(section, /lessons:\s*z\.array\(z\.string\(\)\)/);
});

test('roadmap node schema references itself for nested children', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const section = content.slice(content.indexOf('const roadmapNodeSchema'), content.indexOf('const courses'));
	assert.match(section, /children:\s*z\.array\(roadmapNodeSchema\)/);
});

test('roadmap node schema rejects a node declaring both or neither of lessons/children', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const section = content.slice(content.indexOf('const roadmapNodeSchema'), content.indexOf('const courses'));
	assert.match(section, /superRefine/);
});

test('courses collection schema declares roadmap as an optional array of roadmap nodes', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const coursesSection = content.slice(content.indexOf('const courses'), content.indexOf('const lessons'));
	assert.match(coursesSection, /roadmap:\s*z\.array\(roadmapNodeSchema\)\.optional\(\)/);
});
