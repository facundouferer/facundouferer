import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/conceptos-basicos-java.ts';
import { resolveScript, validateScript, estimateStepDuration } from '../src/utils/animations.ts';

const SLUG = 'conceptos-basicos-java';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;
const PLAYER = 'src/components/animations/AnimationPlayer.astro';

test('catalog binds conceptos-basicos-java to java/01-conceptos-basicos', () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: '01-conceptos-basicos' });
	assert.ok(getAnimationsForLesson('java', '01-conceptos-basicos').some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: '01-conceptos-basicos' });
	assert.ok(existsSync(`public${animation.image}`));
});

test('script is referentially valid and covers the ten lesson sections plus intro and closing', () => {
	assert.deepEqual(validateScript(script), []);
	const chapterIds = script.chapters.map((chapter) => chapter.id);
	assert.deepEqual(chapterIds, [
		'intro',
		'wora',
		'pipeline',
		'anatomy',
		'terminal',
		'args',
		'conventions',
		'ide',
		'javadoc',
		'errors',
		'exercise',
	]);
	assert.ok(script.steps.length >= 36, `expected a detailed script, got ${script.steps.length} steps`);
});

test('every step has bilingual title and text, and localized code/shell content', () => {
	for (const step of script.steps) {
		for (const lang of ['es', 'en']) {
			assert.ok(step.title[lang]?.length > 0, `${step.id} title.${lang}`);
			assert.ok(step.text[lang]?.length > 40, `${step.id} text.${lang} should explain, not label`);
			if (step.code) assert.ok(step.code.source[lang]?.length > 0, `${step.id} code.${lang}`);
			for (const line of step.shell?.lines ?? []) assert.ok(line.text[lang]?.length > 0, `${step.id} shell.${lang}`);
		}
	}
});

test('code panels cover every program of the lesson and shell panels show javac/java sessions', () => {
	const codeTitles = new Set(script.steps.filter((step) => step.code).map((step) => step.code.title));
	for (const file of ['HolaMundo.java', 'SaludoPersonalizado.java', 'VistaPrevia.java', 'PerfilDesarrollador.java']) {
		assert.ok(codeTitles.has(file), `missing code panel for ${file}`);
	}
	const shellCommands = script.steps.flatMap((step) => step.shell?.lines ?? []).filter((line) => line.kind === 'cmd');
	const commands = shellCommands.map((line) => line.text.es);
	assert.ok(commands.includes('javac HolaMundo.java'));
	assert.ok(commands.includes('java HolaMundo'));
	assert.ok(commands.includes('java SaludoPersonalizado Facundo'));
	assert.ok(commands.some((command) => command.startsWith('java --version')));
	const outputs = script.steps.flatMap((step) => step.shell?.lines ?? []).filter((line) => line.kind !== 'cmd');
	assert.ok(outputs.some((line) => line.text.es.includes('¡Hola, Mundo desde Java!')));
	assert.ok(outputs.some((line) => line.text.en.includes('Hello, World from Java!')));
	assert.ok(outputs.some((line) => line.text.es.includes('Could not find or load main class HolaMundo')));
	assert.ok(outputs.some((line) => line.text.es.includes('ArrayIndexOutOfBoundsException')));
});

test('narration mentions the key concepts of each lesson section', () => {
	const all = script.steps.map((step) => `${step.title.es} ${step.text.es}`).join('\n');
	for (const concept of [
		'WORA',
		'JDK',
		'JRE',
		'JVM',
		'Class Loader',
		'Bytecode Verifier',
		'JIT',
		'Garbage Collector',
		'javac',
		'bytecode',
		'public',
		'static',
		'void',
		'main',
		'String[] args',
		'System.out.println',
		'args.length',
		'PascalCase',
		'camelCase',
		'UPPER_SNAKE_CASE',
		'Javadoc',
		'IDE',
		'LTS',
		'java.base',
		'java.lang',
		'substring',
		'Math.min',
		'IndexOutOfBoundsException',
		'Deprecated',
		'UnsupportedClassVersionError',
		'PerfilDesarrollador',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
});

test('every scene, shown element and focused element referenced by the script exists in the component', async () => {
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
		const ids = step.show === '*' ? [] : step.show;
		for (const id of [...ids, ...(step.focus ?? [])]) {
			assert.match(block, new RegExp(`data-el="${id}"`), `scene ${step.scene} lacks data-el="${id}" (step ${step.id})`);
		}
	}
});

test('resolveScript localizes every field and estimates durations within bounds', () => {
	for (const lang of ['es', 'en']) {
		const resolved = resolveScript(script, lang);
		assert.equal(resolved.steps.length, script.steps.length);
		assert.equal(resolved.chapters.length, script.chapters.length);
		for (const step of resolved.steps) {
			assert.equal(typeof step.title, 'string');
			assert.equal(typeof step.text, 'string');
			assert.ok(step.duration >= 3000 && step.duration <= 26000, `${step.id} duration ${step.duration}`);
		}
		const chapterStarts = resolved.chapters.map((chapter) => chapter.firstStepIndex);
		assert.deepEqual(chapterStarts, [...chapterStarts].sort((a, b) => a - b), 'chapters follow step order');
	}
	assert.equal(estimateStepDuration({ text: { es: 'x', en: 'x' }, duration: 5000 }, 'es'), 5000);
});

test('player provides controls, keyboard support, live step announcements and reduced-motion handling', async () => {
	const player = await readFile(PLAYER, 'utf8');
	assert.match(player, /data-anim-prev/);
	assert.match(player, /data-anim-next/);
	assert.match(player, /data-anim-play/);
	assert.match(player, /data-anim-restart/);
	assert.match(player, /aria-live="polite"/);
	assert.match(player, /prefers-reduced-motion: reduce/);
	assert.match(player, /ArrowRight/);
	assert.match(player, /ArrowLeft/);
	assert.match(player, /astro:page-load/);
	assert.match(player, /anim-terminal/);
	assert.match(player, /tok-kw/);
	assert.match(player, /stroke-width="2\.75"/);
	assert.match(player, /t\('animations\.controls\.play'\)/);
});

test('animation component mounts the player with the script and every scene lives in the scene slot', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/conceptos-basicos-java'/);
	assert.match(component, /slot="scene"/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	for (const scene of ['platform', 'pipeline', 'anatomy', 'terminal-flow', 'args', 'conventions', 'ide', 'javadoc', 'errors', 'exercise']) {
		assert.match(component, new RegExp(`data-scene="${scene}"`), `scene ${scene}`);
	}
});
