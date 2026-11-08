import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/control-flujo-bucles-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'control-flujo-bucles-java';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test('catalog binds control-flujo-bucles-java to java/03-control-de-flujo-y-bucles', () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: '03-control-de-flujo-y-bucles' });
	assert.ok(getAnimationsForLesson('java', '03-control-de-flujo-y-bucles').some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: '03-control-de-flujo-y-bucles' });
	assert.ok(existsSync(`public${animation.image}`));
});

test('script is referentially valid and covers the five lesson sections plus intro', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['intro', 'conditionals', 'switch', 'loops', 'jumps', 'exercise'],
	);
	assert.ok(script.steps.length >= 18, `expected a detailed script, got ${script.steps.length} steps`);
});

test('every step has a bilingual title and one to three short captions', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 1 && step.subtitles.length <= 3, `${step.id} narrates in one to three captions`);
		for (const lang of ['es', 'en']) {
			assert.ok(step.title[lang]?.length > 0, `${step.id} title.${lang}`);
			for (const sub of step.subtitles) {
				const length = sub.text[lang]?.length ?? 0;
				assert.ok(length >= 15 && length <= 120, `${step.id} caption.${lang} is ${length} chars: "${sub.text[lang]}"`);
			}
			if (step.code) assert.ok(step.code.source[lang]?.length > 0, `${step.id} code.${lang}`);
			for (const line of step.shell?.lines ?? []) assert.ok(line.text[lang]?.length > 0, `${step.id} shell.${lang}`);
		}
	}
});

test('code panels and terminal sessions cover the programs of the lesson', () => {
	const panels = script.steps.filter((step) => step.code).map((step) => step.code);
	const titles = new Set(panels.map((panel) => panel.title));
	for (const file of ['Condicionales.java', 'Ternario.java', 'DiaSemana.java', 'SwitchExpresion.java', 'Menu.java', 'BucleFor.java', 'BucleWhile.java', 'BucleDoWhile.java', 'SumaPares.java']) {
		assert.ok(titles.has(file), `missing code panel for ${file}`);
	}
	const sources = panels.map((panel) => panel.source.es).join('\n');
	for (const snippet of ['else if (nota >= 70)', '? "Aprobado" :', 'switch (dia)', 'break;', 'case 1 ->', 'for (int i = 1; i <= 5; i++)', 'while (contador < 3)', '} while (numero < 5);', 'i += 2']) {
		assert.ok(sources.includes(snippet), `code should include ${snippet}`);
	}
	const outputs = script.steps.flatMap((step) => step.shell?.lines ?? []).filter((line) => line.kind === 'out').map((line) => line.text.es);
	assert.ok(outputs.includes('Iteración número: 5'));
	assert.ok(outputs.includes('Contador: 2'));
	assert.ok(outputs.includes('Se ejecuta al menos una vez'));
	assert.ok(outputs.includes('Suma de pares: 2550'));
});

test('captions mention the key concepts of each lesson section', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n');
	for (const concept of ['if', 'else if', 'else', 'ternario', 'switch', 'case', 'default', 'break', 'continue', 'for', 'while', 'do-while', 'al menos una vez', 'bucle infinito', 'pares', '2550', '43 ejercicios']) {
		assert.ok(all.includes(concept), `captions should mention ${concept}`);
	}
});

test('every scene, shown/focused element and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const sceneBlocks = new Map();
	const sceneRegex = /data-scene="([^"]+)"/g;
	let match;
	while ((match = sceneRegex.exec(component)) !== null) {
		const start = match.index;
		const nextMatch = component.slice(start + 1).search(/data-scene="/);
		const end = nextMatch === -1 ? component.length : start + 1 + nextMatch;
		sceneBlocks.set(match[1], component.slice(start, end));
	}

	for (const step of script.steps) {
		const block = sceneBlocks.get(step.scene);
		assert.ok(block, `step ${step.id} references unknown scene "${step.scene}"`);
		const ids = !step.show || step.show === '*' ? [] : step.show;
		for (const id of [...ids, ...(step.focus ?? [])]) {
			assert.match(block, new RegExp(`data-el="${id}"`), `scene ${step.scene} lacks data-el="${id}" (step ${step.id})`);
		}
		for (const cue of step.motion?.cues ?? []) {
			const targets = [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean);
			for (const id of targets) {
				const literal = new RegExp(`data-(el|anchor)="${id}"`).test(block);
				const templated = id.startsWith('code-') && /data-el=\{`code-\$\{line\.number\}`\}/.test(block);
				assert.ok(literal || templated, `scene ${step.scene} lacks element "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('break/continue chapter is a motion chapter on one persistent canvas', async () => {
	const jumps = script.steps.filter((step) => step.chapter === 'jumps');
	assert.deepEqual(
		jumps.map((step) => step.id),
		['jumps-setup', 'jumps-continue', 'jumps-break'],
	);
	for (const step of jumps) {
		assert.ok(step.motion, `${step.id} is a motion step`);
		assert.equal(step.scene, 'jumps');
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions to its cues`);
	}
	const kinds = new Set(jumps.flatMap((step) => step.motion.cues.map((cue) => cue.do)));
	for (const kind of ['camera', 'enter', 'type', 'move', 'draw', 'flow', 'pulse', 'exit']) {
		assert.ok(kinds.has(kind), `the chapter exercises the ${kind} cue`);
	}

	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /data-scene="jumps" data-motion/);
	assert.match(component, /<svg class="mg-canvas" viewBox="0 0 1600 660"/);
	assert.match(component, /<g class="mg-camera" data-camera>/);
	for (let i = 1; i <= 10; i += 1) assert.match(component, new RegExp(`data-el="c${i}"`), `track node ${i}`);
	// The printed numbers must match the lesson: 1 2 3 4 6 7 (5 skipped, loop cut at 8).
	for (const n of [1, 2, 3, 4, 6, 7]) assert.match(component, new RegExp(`data-el="out-${n}"`));
	for (const n of [5, 8, 9, 10]) assert.doesNotMatch(component, new RegExp(`data-el="out-${n}"`), `${n} is never printed`);

	for (const lang of ['es', 'en']) {
		for (const step of resolveScript(script, lang).steps.filter((entry) => entry.chapter === 'jumps')) {
			assert.ok(step.duration > Math.max(...step.motion.cues.map(cueEnd)), `${step.id} (${lang}) lasts until its last cue ends`);
		}
	}
});

test('animation component mounts the player and defines every scene', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/control-flujo-bucles-java'/);
	assert.match(component, /slot="scene"/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.match(component, /highlightCode\(loopCode, 'java'\)/, 'the canvas types the lesson loop');
	for (const scene of ['intro', 'branches', 'ternary', 'switch', 'switch-expr', 'menu', 'loops', 'for-trace', 'while-trace', 'dowhile', 'jumps', 'exercise', 'closing']) {
		assert.match(component, new RegExp(`data-scene="${scene}"`), `scene ${scene}`);
	}
	assert.match(component, /l03_control_de_flujo_y_bucles/, 'links the course repository folder');
});

test('resolveScript localizes every field within the dwell-time bounds', () => {
	for (const lang of ['es', 'en']) {
		const resolved = resolveScript(script, lang);
		assert.equal(resolved.steps.length, script.steps.length);
		for (const step of resolved.steps) {
			assert.equal(typeof step.title, 'string');
			assert.ok(step.duration >= 3000 && step.duration <= 26000, `${step.id} duration ${step.duration}`);
		}
	}
});
