import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/variables-tipos-datos-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'variables-tipos-datos-java';
const LESSON = { course: 'java', slug: '02-variables-tipos-datos-y-operadores' };
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test('catalog binds variables-tipos-datos-java to java/02-variables-tipos-datos-y-operadores', () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, LESSON);
	assert.ok(getAnimationsForLesson(LESSON.course, LESSON.slug).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), LESSON);
	assert.ok(existsSync(`public${animation.image}`));
});

test('script is referentially valid and follows the six lesson sections', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['intro', 'declare', 'scope', 'types', 'casting', 'operators', 'exercise'],
	);
	assert.ok(script.steps.length >= 20, `expected a detailed script, got ${script.steps.length} steps`);
});

test('every step has a bilingual title and one to three short captions', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 1 && step.subtitles.length <= 3, `${step.id} narrates in one to three captions`);
		for (const lang of ['es', 'en']) {
			assert.ok(step.title[lang]?.length > 0, `${step.id} title.${lang}`);
			for (const sub of step.subtitles) {
				const length = sub.text[lang]?.length ?? 0;
				assert.ok(length >= 15, `${step.id} caption.${lang} should say something`);
				assert.ok(length <= 120, `${step.id} caption.${lang} should be synthetic (${length} chars): "${sub.text[lang]}"`);
			}
			if (step.code) assert.ok(step.code.source[lang]?.length > 0, `${step.id} code.${lang}`);
			for (const line of step.shell?.lines ?? []) assert.ok(line.text[lang]?.length > 0, `${step.id} shell.${lang}`);
		}
	}
});

test('code panels cover the lesson programs and the exercise shows a javac/java session', () => {
	const titles = new Set(script.steps.filter((step) => step.code).map((step) => step.code.title));
	for (const file of ['Declaraciones.java', 'Cuenta.java', 'Bloque.java', 'AsignacionDefinida.java', 'Operadores.java', 'PromedioAlumno.java']) {
		assert.ok(titles.has(file), `missing code panel for ${file}`);
	}
	const solution = script.steps.find((step) => step.id === 'exercise-solution');
	const commands = solution.shell.lines.filter((line) => line.kind === 'cmd').map((line) => line.text.es);
	assert.deepEqual(commands, ['javac PromedioAlumno.java', 'java PromedioAlumno']);
	assert.ok(solution.shell.lines.some((line) => line.text.es === 'Promedio: 7.0'));
	assert.ok(solution.shell.lines.some((line) => line.text.en === 'Passed? true'));
	assert.match(solution.code.source.es, /double promedio = \(nota1 \+ nota2 \+ nota3\) \/ 3;/);
	assert.match(solution.code.source.es, /boolean aprobo = promedio >= 6\.0;/);
});

test('captions mention the key concepts of each lesson section', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n');
	for (const concept of [
		'estáticamente tipado',
		'final',
		'ámbito',
		'visibilidad',
		'tiempo de vida',
		'sombrea',
		'this.saldo',
		'asignación definida',
		'`null`',
		'`byte`',
		'`long`',
		'`double`',
		'`boolean`',
		'`char`',
		'stack',
		'heap',
		'widening',
		'narrowing',
		'(int)',
		'`%`',
		'`&&`',
		'promedio',
		'l02_variables_tipos_datos_y_operadores',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `captions should mention ${concept}`);
	}
});

/** Splits the component into one block per `data-scene`. */
async function sceneBlocks() {
	const component = await readFile(COMPONENT, 'utf8');
	const blocks = new Map();
	const regex = /data-scene="([^"]+)"/g;
	let match;
	while ((match = regex.exec(component)) !== null) {
		const next = component.slice(match.index + 1).search(/data-scene="/);
		const end = next === -1 ? component.length : match.index + 1 + next;
		blocks.set(match[1], component.slice(match.index, end));
	}
	return { component, blocks };
}

test('every scene, shown element, focused element and cue target exists in the component', async () => {
	const { blocks } = await sceneBlocks();
	// Ids built in a loop: `code-${line.number}` for the three editor lines.
	const known = (block, id) =>
		new RegExp(`data-(el|anchor)="${id}"`).test(block) || (/^code-[123]$/.test(id) && block.includes('data-el={`code-${line.number}`}'));

	for (const step of script.steps) {
		const block = blocks.get(step.scene);
		assert.ok(block, `step ${step.id} references unknown scene "${step.scene}"`);
		const ids = !step.show || step.show === '*' ? [] : step.show;
		for (const id of [...ids, ...(step.focus ?? [])]) assert.ok(known(block, id), `scene ${step.scene} lacks data-el="${id}" (step ${step.id})`);
		for (const cue of step.motion?.cues ?? []) {
			const targets = [cue.el, ...(cue.to === 'all' || cue.to === undefined ? [] : [cue.to].flat())].filter(Boolean);
			for (const id of targets) assert.ok(known(block, id), `scene ${step.scene} lacks "${id}" (cue ${cue.do} of ${step.id})`);
		}
	}
});

test('memory and casting are motion chapters on SVG canvases', async () => {
	const motion = script.steps.filter((step) => step.motion);
	assert.deepEqual(
		motion.map((step) => step.id),
		['mem-primitives', 'mem-reference', 'mem-compare', 'cast-widening', 'cast-narrowing'],
	);
	const kinds = new Set(motion.flatMap((step) => step.motion.cues.map((cue) => cue.do)));
	for (const kind of ['camera', 'enter', 'exit', 'type', 'move', 'draw', 'pulse']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);

	const { blocks } = await sceneBlocks();
	for (const scene of ['memory', 'casting']) {
		assert.match(blocks.get(scene), /^data-scene="[a-z]+" data-motion/);
		assert.match(blocks.get(scene), /<svg class="mg-canvas" viewBox="0 0 1600 660"/);
		assert.match(blocks.get(scene), /<g class="mg-camera" data-camera>/);
	}

	for (const lang of ['es', 'en']) {
		for (const step of resolveScript(script, lang).steps.filter((entry) => entry.motion)) {
			assert.ok(step.duration > Math.max(...step.motion.cues.map(cueEnd)), `${step.id} (${lang}) lasts until its last cue ends`);
		}
	}
});

test('resolveScript localizes every field and keeps durations within bounds', () => {
	for (const lang of ['es', 'en']) {
		const resolved = resolveScript(script, lang);
		assert.equal(resolved.steps.length, script.steps.length);
		for (const step of resolved.steps) {
			assert.equal(typeof step.title, 'string');
			assert.ok(step.duration >= 3000 && step.duration <= 26000, `${step.id} duration ${step.duration}`);
		}
		const starts = resolved.chapters.map((chapter) => chapter.firstStepIndex);
		assert.deepEqual(starts, [...starts].sort((a, b) => a - b), 'chapters follow step order');
	}
});

test('component mounts the player, imports the scene styles and keeps tokens only', async () => {
	const { component } = await sceneBlocks();
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/variables-tipos-datos-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.match(component, /slot="scene"/);
	const hexes = component.match(/(?<!&)#[0-9a-fA-F]{3,8}\b/g) ?? [];
	assert.deepEqual(hexes, [], 'the component must use Organic tokens, not raw hex');
	assert.doesNotMatch(component, /stroke-width="(?!2\.75")[0-9.]+"[^>]*aria-hidden/, 'Lucide icons use stroke-width 2.75');
});
