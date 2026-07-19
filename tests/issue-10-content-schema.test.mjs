import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

test('content config defines projects, articles, courses, and lessons collections', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	assert.match(content, /const projects = defineCollection/);
	assert.match(content, /const articles = defineCollection/);
	assert.match(content, /readingTime/);
	assert.match(content, /lang: z.enum/);
	assert.match(content, /generateId:/);
	assert.match(content, /const courses = defineCollection/);
	assert.match(content, /const lessons = defineCollection/);
});

test('project and article seed files exist', async () => {
	const projects = await readdir('src/content/projects');
	const articles = await readdir('src/content/articles');
	assert.equal(projects.length, 8);
	assert.equal(articles.length, 32);
});

test('articles schema does not include title_en or excerpt_en (RED until B-12)', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const articlesSection = content.slice(
		content.indexOf('const articles'),
		content.indexOf('const courses'),
	);
	// These will fail (RED) because articles schema still has title_en/excerpt_en
	assert.doesNotMatch(articlesSection, /title_en: z\.string\(\)/);
	assert.doesNotMatch(articlesSection, /excerpt_en: z\.string\(\)/);
});

test('Spanish article files lack title_en and excerpt_en fields in frontmatter', async () => {
	const files = await readdir('src/content/articles');
	const esFiles = files.filter((f) => f.endsWith('.es.md'));

	assert.ok(esFiles.length > 0, 'No Spanish article files found');
	
	for (const file of esFiles.slice(0, 3)) {
		const content = await readFile(`src/content/articles/${file}`, 'utf8');
		const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
		if (!frontmatter) continue;
		
		// Check frontmatter for _en fields — these should be ABSENT after migration
		// This will fail (RED) until B-14 migration script runs
		assert.doesNotMatch(
			frontmatter[1],
			/^title_en:/m,
			`${file} should not have title_en in frontmatter`,
		);
		assert.doesNotMatch(
			frontmatter[1],
			/^excerpt_en:/m,
			`${file} should not have excerpt_en in frontmatter`,
		);
	}
});

test('English article files use canonical title/excerpt without _en suffix', async () => {
	const files = await readdir('src/content/articles');
	const enFiles = files.filter((f) => f.endsWith('.en.md'));

	assert.ok(enFiles.length > 0, 'No English article files found');
	
	for (const file of enFiles.slice(0, 3)) {
		const content = await readFile(`src/content/articles/${file}`, 'utf8');
		const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
		if (!frontmatter) continue;
		
		// Should have canonical title and excerpt
		assert.match(frontmatter[1], /^title:/m, `${file} should have title field`);
		assert.match(frontmatter[1], /^excerpt:/m, `${file} should have excerpt field`);
		
		// Should NOT have _en suffixed versions
		assert.doesNotMatch(
			frontmatter[1],
			/^title_en:/m,
			`${file} should not have title_en`,
		);
		assert.doesNotMatch(
			frontmatter[1],
			/^excerpt_en:/m,
			`${file} should not have excerpt_en`,
		);
	}
});
