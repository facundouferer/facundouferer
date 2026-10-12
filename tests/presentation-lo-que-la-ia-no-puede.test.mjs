import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import {
	presentations,
	categories,
	getArticleForPresentation,
	getLessonForPresentation,
	getPresentationCountsForCourse,
} from '../src/data/presentations.ts';

const SLUG = 'lo-que-la-ia-no-puede-hacer-por-nosotros';
const ARTICLE_SLUG = 'lo-que-la-ia-no-puede-hacer-por-nosotros';
const COMPONENT = `src/components/presentaciones/${SLUG}.astro`;
const IMAGE_DIR = 'public/img/articles/lo_que_la_ia_no_puede';
const IMAGE_URL_BASE = '/img/articles/lo_que_la_ia_no_puede';

const SLIDE_IMAGES = [
	'presentacion-01-el-cuello-de-botella.png',
	'presentacion-02-deuda-cognitiva.png',
	'presentacion-03-deuda-de-intencion.png',
	'presentacion-04-conocimiento-del-dominio.png',
	'presentacion-05-leer-bien.png',
];

const CONCEPT_IMAGES = [
	'el-cuello-de-botella-01.png',
	'el-cuello-de-botella-02.png',
	'deuda-cognitiva-01.png',
	'deuda-de-intencion-01.png',
	'conocimiento-del-dominio-01.png',
	'leer-bien-01.png',
];

const ROUTES = ['src/pages/presentaciones/[slug].astro', 'src/pages/[lang]/presentaciones/[slug].astro'];

test('article images use ASCII kebab-case filenames', async () => {
	const files = (await readdir(IMAGE_DIR)).filter((file) => file.endsWith('.png'));
	for (const file of files) {
		assert.match(file, /^[a-z0-9-]+\.png$/, `${file} should be ASCII kebab-case`);
	}
	for (const file of [...SLIDE_IMAGES, ...CONCEPT_IMAGES]) {
		assert.ok(existsSync(`${IMAGE_DIR}/${file}`), `Missing image: ${IMAGE_DIR}/${file}`);
	}
});

test('presentations catalog registers the article-bound AI presentation', () => {
	const pres = presentations.find((item) => item.slug === SLUG);
	assert.ok(pres, `${SLUG} must be registered in the presentations array`);
	assert.equal(pres.tag.es, 'IA');
	assert.equal(pres.tag.en, 'AI');
	assert.equal(pres.title.es, 'Lo que la IA no puede hacer por nosotros');
	assert.equal(pres.title.en, "What AI Can't Do for Us");
	assert.deepEqual(pres.article, { slug: ARTICLE_SLUG });
	assert.equal(pres.lesson, undefined, 'an article-bound presentation has no lesson');
	assert.ok(existsSync(`public${pres.image}`), `Missing card image: public${pres.image}`);
});

test('categories list includes the IA category filter', () => {
	const aiCat = categories.find((category) => category.filter === 'IA');
	assert.ok(aiCat, 'IA filter must exist in categories array');
	assert.equal(aiCat.label.es, '~/ia');
	assert.equal(aiCat.label.en, '~/ai');
});

test('lesson helpers skip the article-bound presentation and the article helper resolves it', () => {
	assert.equal(getLessonForPresentation(SLUG), undefined);
	assert.deepEqual(getArticleForPresentation(SLUG), { slug: ARTICLE_SLUG });
	assert.equal(getArticleForPresentation('this-presentation-does-not-exist'), undefined);
	assert.doesNotThrow(() => getPresentationCountsForCourse('c'));
});

test('presentation component exists, defines title + 5 concept + closing slides with all 5 slide images', async () => {
	assert.ok(existsSync(COMPONENT), `Missing component: ${COMPONENT}`);
	const content = await readFile(COMPONENT, 'utf8');
	assert.match(content, /class="ia-screen"/);
	assert.match(content, /data-slide="1"/, 'title slide is slide 1');
	assert.match(content, /data-slide=\{String\(index \+ 2\)\}/, 'concept slides follow the title slide');
	assert.match(content, /data-slide=\{String\(totalSlides\)\}/, 'closing slide is the last slide');
	assert.match(content, /const totalSlides = conceptSlides\.length \+ 2;/);
	for (const file of SLIDE_IMAGES) {
		assert.ok(content.includes(`${IMAGE_URL_BASE}/${file}`), `${COMPONENT} should reference ${file}`);
	}
	assert.match(content, /object-fit:\s*contain/, 'slide images must stay fully visible');
	assert.ok(content.includes(`/articulos/${ARTICLE_SLUG}`), 'closing slide links to the es article');
	assert.ok(content.includes(`/en/articles/${ARTICLE_SLUG}`), 'closing slide links to the en article');
	assert.doesNotMatch(content, /(?<!&)#[0-9a-fA-F]{3,8}\b/, 'new presentation components must use tokens, not raw hex');
});

test('both presentation detail routes import and map the AI presentation', async () => {
	for (const file of ROUTES) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /import LoQueLaIaNoPuedeHacerPorNosotros from/, `${file} should import the component`);
		assert.match(content, new RegExp(`'${SLUG}': LoQueLaIaNoPuedeHacerPorNosotros`), `${file} should map the slug`);
	}
});

test('PresentationLessonLink links article-bound presentations back to their article', async () => {
	const content = await readFile('src/components/PresentationLessonLink.astro', 'utf8');
	assert.match(content, /getArticleForPresentation/);
	assert.match(content, /\/articulos\/\$\{/, 'expected an es article href');
	assert.match(content, /\/en\/articles\/\$\{/, 'expected an en article href');
});

test('article es/en follow the new draft structure and show the concept images', async () => {
	const es = await readFile(`src/content/articles/${ARTICLE_SLUG}.es.md`, 'utf8');
	const en = await readFile(`src/content/articles/${ARTICLE_SLUG}.en.md`, 'utf8');

	for (const [label, content] of [['es', es], ['en', en]]) {
		for (const file of CONCEPT_IMAGES) {
			assert.ok(content.includes(`(${IMAGE_URL_BASE}/${file})`), `${label} article should show ${file}`);
		}
		assert.doesNotMatch(content, /&#32;/, `${label} article should not keep draft artifacts`);
	}

	assert.match(es, /^## Plan de capacitaciones$/m);
	assert.match(es, /^### Capacitaciones$/m);
	assert.match(es, /^### Prácticas que conviene promover$/m);
	assert.doesNotMatch(es, /Qué puede promover la empresa/);
	assert.ok(es.includes(`(/presentaciones/${SLUG})`), 'es article links to the presentation');

	assert.match(en, /^## Training plan$/m);
	assert.match(en, /^### Training programs$/m);
	assert.match(en, /^### Practices worth promoting$/m);
	assert.doesNotMatch(en, /What the company can promote/);
	assert.ok(en.includes(`(/en/presentaciones/${SLUG})`), 'en article links to the presentation');
});
