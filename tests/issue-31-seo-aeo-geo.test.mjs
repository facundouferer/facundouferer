import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('base layout exposes enriched crawl and social metadata hooks', async () => {
	const layout = await readFile('src/layouts/BaseLayout.astro', 'utf8');
	assert.match(layout, /meta name="robots"/);
	assert.match(layout, /meta name="author"/);
	assert.match(layout, /og:site_name/);
	assert.match(layout, /application\/ld\+json/);
	assert.doesNotMatch(layout, /\/favicon\.png/);
});

test('project exposes robots, sitemap, and llms discovery endpoints', async () => {
	await access('src/pages/robots.txt.ts');
	await access('src/pages/sitemap.xml.ts');
	await access('src/pages/llms.txt.ts');

	const robots = await readFile('src/pages/robots.txt.ts', 'utf8');
	const sitemap = await readFile('src/pages/sitemap.xml.ts', 'utf8');
	const llmsRoute = await readFile('src/pages/llms.txt.ts', 'utf8');
	const schema = await readFile('src/seo/schema.ts', 'utf8');

	assert.match(robots, /Sitemap: https:\/\/facundouferer\.ar\/sitemap\.xml/);
	assert.match(sitemap, /getCollection\('articles'\)/);
	assert.match(sitemap, /getCollection\('projects'\)/);
	assert.match(llmsRoute, /buildLlmsDocument/);
	assert.match(schema, /Facundo Uferer/);
	assert.match(schema, /\/articulos/);
	assert.match(schema, /\/en\/articles/);
});

test('schema helpers cover homepage, collection, and article entities', async () => {
	await access('src/seo/schema.ts');
	const schema = await readFile('src/seo/schema.ts', 'utf8');
	assert.match(schema, /ProfessionalService/);
	assert.match(schema, /Person/);
	assert.match(schema, /WebSite/);
	assert.match(schema, /CollectionPage/);
	assert.match(schema, /BlogPosting/);
	assert.match(schema, /BreadcrumbList/);
});

test('home, listing, and article routes wire schema definitions', async () => {
	const home = await readFile('src/pages/index.astro', 'utf8');
	const articles = await readFile('src/pages/articulos/index.astro', 'utf8');
	const projects = await readFile('src/pages/proyectos.astro', 'utf8');
	const articleLayout = await readFile('src/layouts/ArticleLayout.astro', 'utf8');

	assert.match(home, /schema=\{/);
	assert.match(articles, /schema=\{/);
	assert.match(projects, /schema=\{/);
	assert.match(articleLayout, /schema=\{/);
});
