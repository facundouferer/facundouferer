import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('NAVIGATION.es includes Cursos entry between Articulos and Sobre mi', async () => {
	const content = await readFile('src/config/site.ts', 'utf8');
	// Find the NAVIGATION.es array section
	const esMatch = content.match(/es:\s*\[([\s\S]*?)\]/);
	assert.ok(esMatch, 'NAVIGATION.es array not found');

	const esNav = esMatch[1];
	assert.match(esNav, /href: '\/cursos'/);
	assert.match(esNav, /label: 'Cursos'/);
});

test('NAVIGATION.es has Cursos between Articulos and Sobre mi', async () => {
	const content = await readFile('src/config/site.ts', 'utf8');
	const esMatch = content.match(/es:\s*\[([\s\S]*?)\]/);
	assert.ok(esMatch, 'NAVIGATION.es array not found');

	const esNav = esMatch[1];
	const proyectosIdx = esNav.indexOf('Proyectos');
	const articulosIdx = esNav.indexOf('Articulos');
	const cursosIdx = esNav.indexOf('Cursos');
	const sobreMiIdx = esNav.indexOf('Sobre mi');

	assert.ok(proyectosIdx >= 0, 'Proyectos not found');
	assert.ok(articulosIdx >= 0, 'Articulos not found');
	assert.ok(cursosIdx >= 0, 'Cursos not found');
	assert.ok(sobreMiIdx >= 0, 'Sobre mi not found');

	// Order: Proyectos < Articulos < Cursos < Sobre mi
	assert.ok(articulosIdx > proyectosIdx, 'Articulos should come after Proyectos');
	assert.ok(cursosIdx > articulosIdx, 'Cursos should come after Articulos');
	assert.ok(sobreMiIdx > cursosIdx, 'Sobre mi should come after Cursos');
});

test('NAVIGATION.en includes Courses entry between Articles and About', async () => {
	const content = await readFile('src/config/site.ts', 'utf8');
	const enMatch = content.match(/en:\s*\[([\s\S]*?)\]/);
	assert.ok(enMatch, 'NAVIGATION.en array not found');

	const enNav = enMatch[1];
	assert.match(enNav, /href: '\/en\/courses'/);
	assert.match(enNav, /label: 'Courses'/);
});

test('NAVIGATION.en has Courses between Articles and About', async () => {
	const content = await readFile('src/config/site.ts', 'utf8');
	const enMatch = content.match(/en:\s*\[([\s\S]*?)\]/);
	assert.ok(enMatch, 'NAVIGATION.en array not found');

	const enNav = enMatch[1];
	const projectsIdx = enNav.indexOf('Projects');
	const articlesIdx = enNav.indexOf('Articles');
	const coursesIdx = enNav.indexOf('Courses');
	const aboutIdx = enNav.indexOf('About');

	assert.ok(projectsIdx >= 0, 'Projects not found');
	assert.ok(articlesIdx >= 0, 'Articles not found');
	assert.ok(coursesIdx >= 0, 'Courses not found');
	assert.ok(aboutIdx >= 0, 'About not found');

	assert.ok(articlesIdx > projectsIdx, 'Articles should come after Projects');
	assert.ok(coursesIdx > articlesIdx, 'Courses should come after Articles');
	assert.ok(aboutIdx > coursesIdx, 'About should come after Courses');
});

test('es.json nav.courses resolves to Cursos', async () => {
	const content = await readFile('src/i18n/es.json', 'utf8');
	const parsed = JSON.parse(content);
	assert.equal(parsed.nav.courses, 'Cursos');
});

test('en.json nav.courses resolves to Courses', async () => {
	const content = await readFile('src/i18n/en.json', 'utf8');
	const parsed = JSON.parse(content);
	assert.equal(parsed.nav.courses, 'Courses');
});

test('es.json has courses.* keys for catalog UI', async () => {
	const content = await readFile('src/i18n/es.json', 'utf8');
	const parsed = JSON.parse(content);
	assert.ok(parsed.courses, 'courses key missing from es.json');
	assert.equal(typeof parsed.courses.catalogTitle, 'string');
	assert.equal(typeof parsed.courses.catalogSubtitle, 'string');
	assert.equal(typeof parsed.courses.lessonsLabel, 'string');
	assert.equal(typeof parsed.courses.backToCourse, 'string');
	assert.equal(typeof parsed.courses.backToCatalog, 'string');
});

test('en.json has courses.* keys for catalog UI', async () => {
	const content = await readFile('src/i18n/en.json', 'utf8');
	const parsed = JSON.parse(content);
	assert.ok(parsed.courses, 'courses key missing from en.json');
	assert.equal(typeof parsed.courses.catalogTitle, 'string');
	assert.equal(typeof parsed.courses.catalogSubtitle, 'string');
	assert.equal(typeof parsed.courses.lessonsLabel, 'string');
	assert.equal(typeof parsed.courses.backToCourse, 'string');
	assert.equal(typeof parsed.courses.backToCatalog, 'string');
});
