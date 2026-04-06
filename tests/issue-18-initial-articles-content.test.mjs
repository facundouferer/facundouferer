import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const slugs = [
];

test('initial article files exist and are marked published', async () => {
	for (const slug of slugs) {
		const file = await readFile(`src/content/articles/${slug}.md`, 'utf8');
		assert.match(file, /published: true/);
	}
});

test('ai-assisted-development article is split into localized files', async () => {
	await access('src/content/articles/ai-assisted-development-beyond-autocomplete.es.md');
	await access('src/content/articles/ai-assisted-development-beyond-autocomplete.en.md');

	const esFile = await readFile(
		'src/content/articles/ai-assisted-development-beyond-autocomplete.es.md',
		'utf8',
	);
	const enFile = await readFile(
		'src/content/articles/ai-assisted-development-beyond-autocomplete.en.md',
		'utf8',
	);

	assert.match(esFile, /lang: es|lang: 'es'|lang: "es"/);
	assert.match(enFile, /lang: en|lang: 'en'|lang: "en"/);
	assert.match(esFile, /published: true/);
	assert.match(enFile, /published: true/);
});

test('go to brazil article is split into localized files', async () => {
	await access('src/content/articles/go-to-brazil-experiment.es.md');
	await access('src/content/articles/go-to-brazil-experiment.en.md');

	const esFile = await readFile('src/content/articles/go-to-brazil-experiment.es.md', 'utf8');
	const enFile = await readFile('src/content/articles/go-to-brazil-experiment.en.md', 'utf8');

	assert.match(esFile, /lang: es|lang: 'es'|lang: "es"/);
	assert.match(enFile, /lang: en|lang: 'en'|lang: "en"/);
	assert.match(esFile, /published: true/);
	assert.match(enFile, /published: true/);
});

test('why-coding-matters article is split into localized files', async () => {
	await access('src/content/articles/why-coding-matters-in-ai-era.es.md');
	await access('src/content/articles/why-coding-matters-in-ai-era.en.md');

	const esFile = await readFile('src/content/articles/why-coding-matters-in-ai-era.es.md', 'utf8');
	const enFile = await readFile('src/content/articles/why-coding-matters-in-ai-era.en.md', 'utf8');

	assert.match(esFile, /lang: es|lang: 'es'|lang: "es"/);
	assert.match(enFile, /lang: en|lang: 'en'|lang: "en"/);
	assert.match(esFile, /published: true/);
	assert.match(enFile, /published: true/);
});
