import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const COMPONENT_PATH = 'src/components/presentaciones/pilares-poo-java.astro';
const DATA_MODULE_PATH = '../src/data/presentations.ts';
const IMAGE_PATH = 'public/img/presentations/pilares-poo-java.svg';
const DETAIL_PAGES = [
	'src/pages/presentaciones/[slug].astro',
	'src/pages/[lang]/presentaciones/[slug].astro',
];

const PRESENTATION_SLUG = 'pilares-poo-java';

// Organic literals allowed inside the standalone SVG asset (DESIGN.md §3.1/§3.2).
// Custom properties do not resolve in a public/ asset, so the tokens are inlined.
const ORGANIC_LITERALS = new Set([
	'#f5ead8',
	'#ebddc5',
	'#201e1d',
	'#c67139',
	'#7a8a5e',
	'#f9f4ed',
	'#eee7db',
	'#dcd3c4',
	'#c0b6a5',
	'#a19786',
	'#82796a',
	'#645c50',
	'#474238',
	'#2e2b25',
	'#fff2eb',
	'#ffe1d0',
	'#ffc6a5',
	'#f6a06b',
	'#d67f48',
	'#b2622d',
	'#8c491a',
	'#643312',
	'#402310',
	'#f0fae1',
	'#e1eecc',
	'#ccdbb2',
	'#aebf92',
	'#8fa073',
	'#728157',
	'#56633f',
	'#3d472b',
	'#272e1b',
]);

let component;
let dataModule;

test('the pilares-poo-java presentation component exists', async () => {
	assert.ok(existsSync(COMPONENT_PATH), `${COMPONENT_PATH} should exist`);
	component = await readFile(COMPONENT_PATH, 'utf8');
});

test('the component uses the unique two-letter prefix "po"', async () => {
	component ??= await readFile(COMPONENT_PATH, 'utf8');
	const prefix = component.match(/class="([a-z]{2})-screen"/)?.[1];
	assert.equal(prefix, 'po', 'expected the deck root to be class="po-screen"');
	assert.match(component, /class="po-shell"/);
	assert.match(component, /class="po-deck-card"/);
	assert.match(component, /class="po-viewport"/);
});

test('the component renders exactly 8 numbered slides', async () => {
	component ??= await readFile(COMPONENT_PATH, 'utf8');
	const slides = component.match(/data-slide="\d+"/g) ?? [];
	assert.equal(slides.length, 8, 'expected 8 data-slide slides');
	const numbers = slides.map((s) => Number(s.match(/\d+/)[0])).sort((a, b) => a - b);
	assert.deepEqual(numbers, [1, 2, 3, 4, 5, 6, 7, 8]);
	assert.match(component, /const totalSlides = 8;/);
});

test('the component does not render a <header class="po-header"> block', async () => {
	component ??= await readFile(COMPONENT_PATH, 'utf8');
	assert.doesNotMatch(component, /<header class="po-header"/);
});

test('the component names the four pillars in both locales', async () => {
	component ??= await readFile(COMPONENT_PATH, 'utf8');
	const pairs = [
		['Abstracción', 'Abstraction'],
		['Encapsulamiento', 'Encapsulation'],
		['Herencia', 'Inheritance'],
		['Polimorfismo', 'Polymorphism'],
	];
	for (const [es, en] of pairs) {
		assert.ok(component.includes(es), `expected the Spanish pillar name "${es}"`);
		assert.ok(component.includes(en), `expected the English pillar name "${en}"`);
	}
	assert.ok(
		(component.match(/isEs \?/g) ?? []).length >= 20,
		'expected the component to be bilingual through the isEs prop',
	);
});

test('the component is graphic: at least 3 inline SVG figures', async () => {
	component ??= await readFile(COMPONENT_PATH, 'utf8');
	const svgs = component.match(/<svg[\s>]/g) ?? [];
	assert.ok(svgs.length >= 3, `expected at least 3 inline <svg> figures, got ${svgs.length}`);
	assert.match(component, /stroke-width="2\.75"/, 'expected Lucide icons at stroke-width 2.75');
});

test('the component exposes the encapsulation and polymorphism demo hooks', async () => {
	component ??= await readFile(COMPONENT_PATH, 'utf8');
	for (const id of [
		'po-bank-balance',
		'po-bank-log',
		'po-bank-deposit',
		'po-bank-withdraw',
		'po-poly-run',
		'po-poly-output',
		'po-inherit-btn',
		'po-inherit-step',
	]) {
		assert.ok(component.includes(`id="${id}"`), `expected an element with id="${id}"`);
		assert.ok(component.includes(`'${id}'`), `expected the script to wire up ${id}`);
	}
});

test('the component uses design tokens only — no raw hex literals', async () => {
	component ??= await readFile(COMPONENT_PATH, 'utf8');
	const hex = component.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
	assert.deepEqual(hex, [], `expected no raw hex literals, found: ${hex.join(', ')}`);
});

test('the component keeps the shared deck layout contract', async () => {
	component ??= await readFile(COMPONENT_PATH, 'utf8');
	assert.match(component, /\.po-shell \{[^}]*width: 100%[^}]*max-width: none/);
	assert.match(component, /\.po-screen \{[\s\S]*?100dvh/);
	assert.match(component, /\.po-viewport \{ display: flex; flex-direction: column; justify-content: center; \}/);
	const zoomSteps = component.match(/@media \(min-width: \d+px\) \{ \.po-viewport \{ zoom: [0-9.]+; \} \}/g) ?? [];
	assert.equal(zoomSteps.length, 3);
});

test('src/data/presentations.ts carries the pilares-poo-java record', async () => {
	dataModule = await import(DATA_MODULE_PATH);
	const record = dataModule.presentations.find((p) => p.slug === PRESENTATION_SLUG);
	assert.ok(record, `expected a presentation with slug "${PRESENTATION_SLUG}"`);
	assert.equal(record.file, 'Dispositivos.java');
	assert.equal(record.image, '/img/presentations/pilares-poo-java.svg');
	assert.equal(record.tag.es, 'Java');
	assert.equal(record.tag.en, 'Java');
	assert.equal(record.tagClass, 'text-orange-500 bg-orange-500/10 border-orange-500/20');
	assert.ok(record.title.es.length > 0);
	assert.ok(record.title.en.length > 0);
	assert.ok(record.description.es.length > 0);
	assert.ok(record.description.en.length > 0);
	assert.deepEqual(record.lesson, { course: 'java', slug: '06-introduccion-y-pilares-poo' });
});

test('getPresentationsForLesson maps the record to the OOP pillars lesson', async () => {
	dataModule ??= await import(DATA_MODULE_PATH);
	const result = dataModule.getPresentationsForLesson('java', '06-introduccion-y-pilares-poo');
	assert.deepEqual(
		result.map((p) => p.slug),
		[PRESENTATION_SLUG],
	);
	assert.deepEqual(dataModule.getLessonForPresentation(PRESENTATION_SLUG), {
		course: 'java',
		slug: '06-introduccion-y-pilares-poo',
	});
});

test('both presentation detail pages import and map the component', async () => {
	for (const file of DETAIL_PAGES) {
		const content = await readFile(file, 'utf8');
		assert.match(
			content,
			/import PilaresPooJava from '(\.\.\/)+components\/presentaciones\/pilares-poo-java\.astro';/,
			`${file} should import the pilares-poo-java component`,
		);
		assert.match(
			content,
			/'pilares-poo-java': PilaresPooJava,/,
			`${file} should map the pilares-poo-java slug`,
		);
	}
});

test('the catalog card image exists and uses Organic palette literals only', async () => {
	assert.ok(existsSync(IMAGE_PATH), `${IMAGE_PATH} should exist`);
	const svg = await readFile(IMAGE_PATH, 'utf8');
	assert.match(svg, /<svg[^>]*viewBox="0 0 400 200"/);
	const literals = svg.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
	assert.ok(literals.length > 0, 'expected the standalone asset to carry Organic literals');
	for (const literal of literals) {
		assert.ok(
			ORGANIC_LITERALS.has(literal.toLowerCase()),
			`${literal} is not an Organic token literal (DESIGN.md §3.1/§3.2)`,
		);
	}
});
