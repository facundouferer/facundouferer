import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/abstractas-interfaces-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'abstractas-interfaces-java';
const LESSON = '09-clases-abstractas-interfaces-y-modelado';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '11-clases-abstractas-interfaces-y-modelado';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;
const MOTION_SCENES = ['abs', 'contract', 'multi', 'combo', 'fqcn', 'rel'];

test('catalog binds abstractas-interfaces-java to the java abstract classes lesson', () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.ok(getAnimationsForLesson('java', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
});

test('script is valid and covers every section of the lesson', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['intro', 'abstract', 'interface', 'defaults', 'multi', 'choose', 'namespace', 'relations', 'errors', 'exercise', 'closing'],
	);
	assert.ok(script.steps.length >= 40, `expected a detailed script, got ${script.steps.length} steps`);
});

test('every step has a bilingual title and one to four short captions', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 1 && step.subtitles.length <= 4, `${step.id} narrates in one to four captions`);
		for (const lang of ['es', 'en']) {
			assert.ok(step.title[lang]?.length > 0, `${step.id} title.${lang}`);
			for (const sub of step.subtitles) {
				const length = sub.text[lang]?.length ?? 0;
				assert.ok(length >= 15 && length <= 120, `${step.id} caption.${lang} must be short (${length}): ${sub.text[lang]}`);
			}
			if (step.code) assert.ok(step.code.source[lang]?.length > 0, `${step.id} code.${lang}`);
			for (const line of step.shell?.lines ?? []) assert.ok(line.text[lang]?.length > 0, `${step.id} shell.${lang}`);
		}
	}
});

test('most of the lesson plays as motion steps on six canvases with pinned captions', () => {
	const motion = script.steps.filter((step) => step.motion);
	assert.ok(motion.length >= 20, `expected a mostly animated script, got ${motion.length} motion steps`);
	assert.equal(new Set(motion.map((step) => step.scene)).size, MOTION_SCENES.length);
	for (const scene of MOTION_SCENES) assert.ok(motion.some((step) => step.scene === scene), `${scene} has motion steps`);
	for (const step of motion) {
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions`);
		assert.ok(step.motion.cues.length >= 4, `${step.id} choreographs its canvas`);
	}
	const kinds = new Set(motion.flatMap((step) => step.motion.cues.map((cue) => cue.do)));
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'flow', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);

	for (const lang of ['es', 'en']) {
		for (const step of resolveScript(script, lang).steps.filter((entry) => entry.motion)) {
			assert.ok(step.duration > Math.max(...step.motion.cues.map(cueEnd)), `${step.id} (${lang}) outlasts its cues`);
		}
	}
});

test('a motion scene is only visited in one consecutive run so its canvas never resets mid-story', () => {
	const runs = new Map();
	let previous = null;
	for (const step of script.steps) {
		if (step.motion && step.scene !== previous) runs.set(step.scene, (runs.get(step.scene) ?? 0) + 1);
		previous = step.motion ? step.scene : null;
	}
	for (const [scene, count] of runs) assert.equal(count, 1, `${scene} is visited ${count} times`);
});

test('narration mentions the key concepts of each lesson section', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();
	for (const concept of [
		'clase abstracta',
		'instanci',
		'abstract',
		'interfaz',
		'implements',
		'extends',
		'default',
		'static',
		'adaptadora',
		'instanceof',
		'herencia múltiple',
		'package',
		'namespace',
		'fqcn',
		'import',
		'asociación',
		'agregación',
		'composición',
		'copia defensiva',
		'package-private',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
});

test('code panels and terminal sessions cover the lesson programs', () => {
	const titles = new Set(script.steps.filter((step) => step.code).map((step) => step.code.title));
	for (const file of ['Shape.java', 'Circle.java', 'Payable.java', 'CreditCard.java', 'WindowEvents.java', 'Duck.java', 'Product.java', 'Relaciones.java', 'DigitalWallet.java', 'MainCobros.java']) {
		assert.ok(titles.has(file), `missing code panel ${file}`);
	}
	const outputs = script.steps.flatMap((step) => step.shell?.lines ?? []).map((line) => line.text.es);
	assert.ok(outputs.some((text) => text.includes('Shape is abstract; cannot be instantiated')));
	assert.ok(outputs.some((text) => text.includes('Circle → area 28.27, perimeter 18.85')));
	assert.ok(outputs.some((text) => text.includes('cobro omitido')));
});

test('every scene, shown/focused element and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const blocks = new Map();
	const sceneRegex = /data-scene="([^"]+)"/g;
	let match;
	while ((match = sceneRegex.exec(component)) !== null) {
		const next = component.slice(match.index + 1).search(/data-scene="/);
		blocks.set(match[1], component.slice(match.index, next === -1 ? component.length : match.index + 1 + next));
	}

	// Ids built in a loop (`cmp-${n}`) count as present when their prefix is templated.
	const known = (block, id) => {
		if (block.includes(`data-el="${id}"`) || block.includes(`data-anchor="${id}"`)) return true;
		const prefix = id.replace(/\d+$/, '');
		return prefix !== id && component.includes('`' + prefix + '${');
	};

	for (const step of script.steps) {
		const block = blocks.get(step.scene);
		assert.ok(block, `step ${step.id} references unknown scene "${step.scene}"`);
		const ids = !step.show || step.show === '*' ? [] : step.show;
		for (const id of [...ids, ...(step.focus ?? [])]) assert.ok(known(block, id), `scene ${step.scene} lacks "${id}" (step ${step.id})`);
		for (const cue of step.motion?.cues ?? []) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(block, id), `scene ${step.scene} lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
	for (const scene of MOTION_SCENES) assert.match(blocks.get(scene), /data-motion/, `${scene} is a motion canvas`);
	assert.equal(blocks.size, new Set(script.steps.map((step) => step.scene)).size, 'every scene of the component is used');
});

test('animation component mounts the player and keeps every scene in the scene slot', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/abstractas-interfaces-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, new Set(script.steps.map((step) => step.scene)).size);
	assert.match(component, /<svg class="mg-canvas" viewBox="0 0 1600 660"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
});
