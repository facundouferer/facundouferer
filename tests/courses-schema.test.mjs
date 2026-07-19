import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

test('content config defines courses and lessons collections (RED before B-2)', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	assert.match(content, /const courses = defineCollection/);
	assert.match(content, /const lessons = defineCollection/);
	assert.match(content, /courses.*lessons\}|courses.*,\s*lessons/);
});

test('courses collection schema has required bilingual fields', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	// Courses schema must have bilingual fields per design: slug, title, title_en,
	// description, description_en, technology, difficulty, published, featured
	assert.match(content, /slug: z\.string\(\)/);
	assert.match(content, /title_en: z\.string\(\)/);
	assert.match(content, /description_en: z\.string\(\)/);
	assert.match(content, /technology: z\.string\(\)/);
	assert.match(content, /difficulty: z\.string\(\)/);
	assert.match(content, /image: z\.string\(\)\.optional\(\)/);
	assert.match(content, /published: z\.boolean\(\)\.default/);
	assert.match(content, /featured: z\.boolean\(\)\.default/);
});

test('lessons collection schema has locale-specific fields', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	// Lessons are locale-split: each file has course, slug, title, order, lang, published
	assert.match(content, /course: z\.string\(\)/);
	assert.match(content, /order: z\.number\(\)\.int\(\)\.nonnegative\(\)/);
	assert.match(content, /lang: z\.enum\(\[.*'es'.*'en'\]\)/);
	// Lessons should NOT have title_en or description_en (locale-own model)
	assert.doesNotMatch(
		content.slice(content.indexOf('const lessons')),
		/title_en|description_en/,
	);
});

test('courses schema uses **/index.md glob for courses collection', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const coursesSection = content.slice(content.indexOf('const courses'), content.indexOf('const lessons'));
	assert.match(coursesSection, /index\.md/);
});

test('lessons schema uses locale-split glob pattern', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const lessonsSection = content.slice(content.indexOf('const lessons'));
	assert.match(lessonsSection, /\+\(es\|en\)\.md/);
});

test('lessons collection has generateId that includes course+slug+lang (prevents duplicate id collisions)', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const lessonsSection = content.slice(content.indexOf('const lessons'), content.indexOf('const lessons') + 1000);
	assert.match(lessonsSection, /generateId:/, 'lessons collection must declare generateId');
	assert.match(lessonsSection, /data\.course/, 'generateId must reference data.course');
	assert.match(lessonsSection, /data\.lang/, 'generateId must reference data.lang');
	assert.match(lessonsSection, /data\.slug/, 'generateId must reference data.slug');
});

test('articles schema does not include title_en or excerpt_en (GREEN after B-12)', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const articlesSection = content.slice(content.indexOf('const articles'), content.indexOf('const projects') > -1 ? content.indexOf('const projects') : undefined);
	assert.doesNotMatch(articlesSection, /title_en: z\.string\(\)/);
	assert.doesNotMatch(articlesSection, /excerpt_en: z\.string\(\)/);
});

test('export collections includes courses and lessons', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const exportLine = content.match(/export const collections = \{([^}]+)\}/);
	assert.ok(exportLine, 'export collections statement found');
	assert.match(exportLine[1], /courses/);
	assert.match(exportLine[1], /lessons/);
});
