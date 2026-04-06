import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

test('content config defines projects and articles collections', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	assert.match(content, /const projects = defineCollection/);
	assert.match(content, /const articles = defineCollection/);
	assert.match(content, /readingTime/);
	assert.match(content, /lang: z.enum/);
	assert.match(content, /generateId:/);
});

test('project and article seed files exist', async () => {
	const projects = await readdir('src/content/projects');
	const articles = await readdir('src/content/articles');
	assert.equal(projects.length, 5);
	assert.equal(articles.length, 6);
});
