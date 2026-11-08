import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/herencia-polimorfismo-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'herencia-polimorfismo-java';
const LESSON = '08-herencia-polimorfismo-y-sobrecarga';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '10-herencia-polimorfismo-y-sobrecarga';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;
const MOTION_SCENES = ['hier', 'chain', 'ovl', 'poly', 'fleet', 'compose', 'obj'];

test(`catalog binds ${SLUG} to java/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.ok(getAnimationsForLesson('java', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
});

test('lesson files for the animation exist in both languages', () => {
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.en.md`));
});

test('script is valid and covers the lesson sections', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['intro', 'extends', 'ctor', 'override', 'overload', 'poly', 'usage', 'avoid', 'object', 'errors', 'exercise'],
	);
	assert.ok(script.steps.length >= 38, `expected a detailed script, got ${script.steps.length} steps`);
});

test('every step has a bilingual title and one to three short captions', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 1 && step.subtitles.length <= 3, `${step.id} narrates in one to three captions`);
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

test('most chapters play as motion steps on the seven canvases and pin their captions', () => {
	const motion = script.steps.filter((step) => step.motion);
	assert.ok(motion.length > script.steps.length / 2, 'more than half of the steps are motion steps');
	assert.equal(new Set(motion.map((step) => step.scene)).size, MOTION_SCENES.length);
	for (const scene of MOTION_SCENES) assert.ok(motion.some((step) => step.scene === scene), `${scene} has motion steps`);
	for (const step of motion) {
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions`);
		assert.ok(step.motion.cues.length >= 4, `${step.id} choreographs its canvas`);
	}
	const kinds = new Set(motion.flatMap((step) => step.motion.cues.map((cue) => cue.do)));
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);

	for (const lang of ['es', 'en']) {
		for (const step of resolveScript(script, lang).steps.filter((entry) => entry.motion)) {
			assert.ok(step.duration > Math.max(...step.motion.cues.map(cueEnd)), `${step.id} (${lang}) outlasts its cues`);
		}
	}
});

test('each motion canvas is played in one contiguous run of steps', () => {
	const seen = new Set();
	let previous = '';
	for (const step of script.steps.filter((entry) => entry.motion || MOTION_SCENES.includes(entry.scene))) {
		if (step.scene !== previous) {
			assert.ok(!seen.has(step.scene), `${step.scene} is revisited after other scenes, which would reset its canvas`);
			seen.add(step.scene);
		}
		previous = step.scene;
	}
});

test('narration mentions the key concepts of each lesson section', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n');
	for (const concept of [
		'extends',
		'herencia simple',
		'es un',
		'super(',
		'@Override',
		'Sobrecarga',
		'Sobrescritura',
		'polimorfismo',
		'Despacho dinámico',
		'instanceof',
		'ClassCastException',
		'composición',
		'final',
		'Object',
		'toString()',
		'equals()',
		'hashCode()',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('code panels and terminal sessions cover the lesson programs in both languages', () => {
	const es = resolveScript(script, 'es').steps;
	const titles = new Set(es.filter((step) => step.code).map((step) => step.code.title));
	for (const file of ['Vehiculo.java', 'Auto.java', 'Taller.java', 'Cuenta.java', 'Empleado.java', 'MainNomina.java']) {
		assert.ok(titles.has(file), `missing code panel ${file}`);
	}
	const sources = es.filter((step) => step.code).map((step) => step.code.source).join('\n');
	for (const snippet of ['extends Vehiculo', 'super(marca)', '@Override', 'public final class', 'for (Empleado e : nomina)']) {
		assert.ok(sources.includes(snippet), `code should include ${snippet}`);
	}
	const outputs = es.flatMap((step) => step.shell?.lines ?? []).map((line) => line.text);
	assert.ok(outputs.some((text) => text.includes('cannot be applied to given types')));
	assert.ok(outputs.some((text) => text.includes('method does not override or implement a method from a supertype')));
	assert.ok(outputs.some((text) => text.includes('TOTAL')));
});

test('English code and terminal text use the English lesson identifiers', () => {
	const steps = resolveScript(script, 'en').steps;
	const texts = steps.flatMap((step) => [step.code?.source ?? '', ...(step.shell?.lines ?? []).map((line) => line.text)]);
	const joined = texts.join('\n');
	for (const english of ['class Car extends Vehicle', 'super(brand)', 'Garage', 'computeSalary', 'Employee Ana Torres', 'public final class Coordinate']) {
		assert.ok(joined.includes(english), `English panels should include ${english}`);
	}
	for (const text of texts) {
		assert.ok(!/[áéíóúñ¿¡]/.test(text), `English panel text keeps no Spanish characters: ${text.slice(0, 60)}`);
		assert.ok(!/\b(arrancar|frenar|Vehiculo|Auto|marca|sueldoBase|Empleado|Gerente|Vendedor|Taller)\b/.test(text), `English panel text keeps no Spanish identifiers: ${text.slice(0, 60)}`);
	}
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

	// Ids built in a loop (`cell-${i}`) or listed in the frontmatter (`id: 't1'`) count as present.
	const known = (block, id) => {
		if (block.includes(`data-el="${id}"`) || block.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const prefix = id.replace(/\d+$/, '');
		return prefix !== id && block.includes('`' + prefix + '${');
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
});

test('travelling elements only move to fixed targets', async () => {
	// `move` aims at the bounding-box center of its target, which ignores the target's own translation.
	const component = await readFile(COMPONENT, 'utf8');
	const blocks = new Map();
	const sceneRegex = /data-scene="([^"]+)"/g;
	let match;
	while ((match = sceneRegex.exec(component)) !== null) {
		const next = component.slice(match.index + 1).search(/data-scene="/);
		blocks.set(match[1], component.slice(match.index, next === -1 ? component.length : match.index + 1 + next));
	}
	for (const step of script.steps) {
		for (const cue of (step.motion?.cues ?? []).filter((entry) => entry.do === 'move')) {
			const block = blocks.get(step.scene);
			const travelling = new RegExp(`data-el="${cue.to}"[^>]*data-x=`).test(block);
			assert.ok(!travelling, `${step.id}: "${cue.to}" travels, so a move cannot target it`);
		}
	}
});

test('animation component mounts the player and keeps every scene in the scene slot', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/herencia-polimorfismo-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, new Set(script.steps.map((step) => step.scene)).size);
	assert.match(component, /<svg class="mg-canvas" viewBox="0 0 1600 660"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.ok(!/#[0-9a-fA-F]{6}\b/.test(component), 'colors come from tokens');
});
