import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const slugs = [
	'ai-assisted-development-beyond-autocomplete',
	'go-to-brazil-experiment',
	'why-coding-matters-in-ai-era',
];

test('initial article files exist and are marked published', async () => {
	for (const slug of slugs) {
		const file = await readFile(`src/content/articles/${slug}.md`, 'utf8');
		assert.match(file, /published: true/);
	}
});

test('at least one article is single-language for fallback behavior', async () => {
	const file = await readFile('src/content/articles/go-to-brazil-experiment.md', 'utf8');
	assert.match(file, /lang: 'es'/);
});
