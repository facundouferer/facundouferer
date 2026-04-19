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
	assert.match(esFile, /!\[Imagen por defecto del articulo\]\(\/img\/articles\/imagenotfound\.png\)/);
	assert.match(enFile, /!\[Default article image\]\(\/img\/articles\/imagenotfound\.png\)/);
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
	assert.match(esFile, /!\[IA escribiendo\]\(\/img\/articles\/iaescribiendo\.png\)/);
	assert.match(enFile, /!\[AI writing\]\(\/img\/articles\/iaescribiendo\.png\)/);
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
	assert.match(esFile, /!\[IA y programacion\]\(\/img\/articles\/ias\.png\)/);
	assert.match(enFile, /!\[AI and programming\]\(\/img\/articles\/ias\.png\)/);
});

test('ai is everywhere article is split into localized files and references the provided image', async () => {
	await access('src/content/articles/ai-is-everywhere.es.md');
	await access('src/content/articles/ai-is-everywhere.en.md');

	const esFile = await readFile('src/content/articles/ai-is-everywhere.es.md', 'utf8');
	const enFile = await readFile('src/content/articles/ai-is-everywhere.en.md', 'utf8');

	assert.match(esFile, /lang: es|lang: 'es'|lang: "es"/);
	assert.match(enFile, /lang: en|lang: 'en'|lang: "en"/);
	assert.match(esFile, /published: true/);
	assert.match(enFile, /published: true/);
	assert.match(esFile, /!\[IA en todas partes\]\(\/img\/articles\/entodaspartes\.png\)/);
	assert.match(enFile, /!\[AI is everywhere\]\(\/img\/articles\/entodaspartes\.png\)/);
});

test('productividad sin demanda article is split into localized files and references the provided image', async () => {
	await access('src/content/articles/productivity-without-demand.es.md');
	await access('src/content/articles/productivity-without-demand.en.md');

	const esFile = await readFile('src/content/articles/productivity-without-demand.es.md', 'utf8');
	const enFile = await readFile('src/content/articles/productivity-without-demand.en.md', 'utf8');

	assert.match(esFile, /lang: es|lang: 'es'|lang: "es"/);
	assert.match(enFile, /lang: en|lang: 'en'|lang: "en"/);
	assert.match(esFile, /published: true/);
	assert.match(enFile, /published: true/);
	assert.match(esFile, /!\[Productividad sin demanda\]\(\/img\/articles\/empresasia\.png\)/);
	assert.match(enFile, /!\[Productivity without demand\]\(\/img\/articles\/empresasia\.png\)/);
});

test('all localized article files include an article image reference', async () => {
	const files = [
		'src/content/articles/ai-assisted-development-beyond-autocomplete.es.md',
		'src/content/articles/ai-assisted-development-beyond-autocomplete.en.md',
		'src/content/articles/go-to-brazil-experiment.es.md',
		'src/content/articles/go-to-brazil-experiment.en.md',
		'src/content/articles/why-coding-matters-in-ai-era.es.md',
		'src/content/articles/why-coding-matters-in-ai-era.en.md',
		'src/content/articles/ai-is-everywhere.es.md',
		'src/content/articles/ai-is-everywhere.en.md',
		'src/content/articles/productivity-without-demand.es.md',
		'src/content/articles/productivity-without-demand.en.md',
	];

	for (const filePath of files) {
		const content = await readFile(filePath, 'utf8');
		assert.match(content, /!\[.*\]\(\/img\/articles\/.*\.png\)/);
	}
});
