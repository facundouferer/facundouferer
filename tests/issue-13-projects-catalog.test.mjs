import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('projects catalog defines all requested filters', async () => {
	const content = await readFile('src/components/ProjectsCatalog.astro', 'utf8');
	for (const filter of ['All', 'Civic Tech', 'EdTech', 'Government', 'Tourism', 'Portfolio & Art']) {
		assert.match(content, new RegExp(filter.replace('&', '\\&')));
	}
});

test('projects pages render shared catalog component', async () => {
	const esPage = await readFile('src/pages/proyectos.astro', 'utf8');
	const enPage = await readFile('src/pages/en/projects.astro', 'utf8');
	assert.match(esPage, /<ProjectsCatalog locale="es"/);
	assert.match(enPage, /<ProjectsCatalog locale="en"/);
});
