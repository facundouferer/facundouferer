import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('go to brazil project remains active and includes verified redirect note', async () => {
	const content = await readFile('src/content/projects/go-to-brazil.md', 'utf8');
	assert.match(content, /archived: false/);
	assert.match(content, /redireccion 301/);
	assert.match(content, /respuesta 200/);
});

test('project card can render archived badge when needed', async () => {
	const card = await readFile('src/components/ProjectCard.astro', 'utf8');
	assert.match(card, /\[archived\]/);
	assert.match(card, /project\.archived/);
});
