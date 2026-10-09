import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

test('projects schema requires a date', async () => {
	const content = await readFile('src/content.config.ts', 'utf8');
	const projectsBlock = content.slice(content.indexOf('const projects'), content.indexOf('const articles'));
	assert.match(projectsBlock, /date: z\.coerce\.date\(\)/);
});

test('every project declares the date it was added', async () => {
	const files = (await readdir('src/content/projects')).filter((file) => file.endsWith('.md'));
	for (const file of files) {
		const content = await readFile(`src/content/projects/${file}`, 'utf8');
		assert.match(content, /^date: \d{4}-\d{2}-\d{2}$/m, `${file} is missing date`);
	}
});

test('projects helper sorts published projects newest first', async () => {
	const content = await readFile('src/utils/projects.ts', 'utf8');
	assert.match(content, /export async function getPublishedProjects/);
	assert.match(content, /b\.data\.date\.valueOf\(\) - a\.data\.date\.valueOf\(\)/);
});

test('every project listing uses the chronological helper', async () => {
	for (const path of [
		'src/components/ProjectsCatalog.astro',
		'src/components/FeaturedProjects.astro',
		'src/pages/proyectos.astro',
		'src/pages/en/projects.astro',
		'src/pages/sitemap.xml.ts',
		'src/pages/llms-full.txt.ts',
	]) {
		const content = await readFile(path, 'utf8');
		assert.match(content, /getPublishedProjects\(/, `${path} does not use getPublishedProjects`);
	}
});
