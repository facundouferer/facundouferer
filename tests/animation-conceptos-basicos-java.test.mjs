import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/conceptos-basicos-java.ts';
import { resolveScript, validateScript, estimateStepDuration, cueEnd } from '../src/utils/animations.ts';

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

test('every step has a bilingual title and short captions, and localized code/shell content', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 1 && step.subtitles.length <= 3, `${step.id} narrates in one to three captions`);
		for (const lang of ['es', 'en']) {
			assert.ok(step.title[lang]?.length > 0, `${step.id} title.${lang}`);
			for (const sub of step.subtitles) {
				const length = sub.text[lang]?.length ?? 0;
				assert.ok(length >= 15, `${step.id} caption.${lang} should say something: "${sub.text[lang]}"`);
				assert.ok(length <= 120, `${step.id} caption.${lang} should be synthetic (${length} chars): "${sub.text[lang]}"`);
			}
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
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n');
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
		const ids = !step.show || step.show === '*' ? [] : step.show;
		for (const id of [...ids, ...(step.focus ?? [])]) {
			assert.match(block, new RegExp(`data-el="${id}"`), `scene ${step.scene} lacks data-el="${id}" (step ${step.id})`);
		}
		for (const cue of step.motion?.cues ?? []) {
			const targets = [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean);
			for (const id of targets) {
				// Ids built in a loop (`jvm-${platform.id}`) appear as their prefix plus the loop data.
				const [prefix, suffix] = id.split(/-(?=win$|mac$|linux$)/);
				const literal = new RegExp(`data-(el|anchor)="${id}"`);
				const templated = suffix ? new RegExp(`data-el=\\{\`${prefix}-\\$\\{platform\\.id\\}\`\\}`) : null;
				const known = literal.test(block) || (templated?.test(block) ?? false) || (id.startsWith('code-') && /data-el=\{`code-\$\{line\.number\}`\}/.test(block)) || (/^class-(file|mac|linux)$/.test(id) && component.includes(`id: '${id}'`));
				assert.ok(known, `scene ${step.scene} lacks element "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the compilation chapter is a motion prototype: four timed steps on one canvas', async () => {
	const pipeline = script.steps.filter((step) => step.chapter === 'pipeline');
	assert.deepEqual(
		pipeline.map((step) => step.id),
		['pipeline-source', 'pipeline-compile', 'pipeline-jvm', 'pipeline-run'],
	);
	for (const step of pipeline) {
		assert.ok(step.motion, `${step.id} is a motion step`);
		assert.equal(step.scene, 'pipeline');
		assert.ok(step.subtitles.length >= 2, `${step.id} narrates with captions`);
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions to its cues`);
	}
	const kinds = new Set(pipeline.flatMap((step) => step.motion.cues.map((cue) => cue.do)));
	for (const kind of ['camera', 'enter', 'type', 'move', 'draw', 'flow', 'spin', 'pulse', 'exit']) {
		assert.ok(kinds.has(kind), `the prototype exercises the ${kind} cue`);
	}

	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /data-scene="pipeline" data-motion/);
	assert.match(component, /<svg class="mg-canvas" viewBox="0 0 1600 660"/);
	assert.match(component, /<g class="mg-camera" data-camera>/);
	assert.match(component, /highlightCode\(holaMundo\.source\[lang\], 'java'\)/, 'the editor types the real HolaMundo source');

	for (const lang of ['es', 'en']) {
		const resolved = resolveScript(script, lang).steps.filter((step) => step.chapter === 'pipeline');
		for (const step of resolved) {
			const lastCue = Math.max(...step.motion.cues.map(cueEnd));
			assert.ok(step.duration > lastCue, `${step.id} (${lang}) lasts until its last cue ends`);
			const sorted = [...step.motion.cues].sort((a, b) => a.at - b.at);
			assert.deepEqual(step.motion.cues, sorted, 'cues are resolved in time order');
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

test('player plays motion steps: cues, camera, captions and a pausable clock', async () => {
	const player = await readFile(PLAYER, 'utf8');
	assert.match(player, /data-cues=\{step\.motion \? JSON\.stringify\(step\.motion\.cues\) : undefined\}/);
	assert.match(player, /class="anim-subtitle" data-sub-at=\{sub\.at\}/);
	assert.match(player, /import \{ MOTION_CUE_DEFAULT_MS \} from '\.\.\/\.\.\/utils\/animations'/, 'client and server share cue lengths');
	assert.match(player, /getBBox\(\)/, 'camera and moves measure the canvas');
	assert.match(player, /clock = root\.animate\(null, \{ duration: durationMs \}\)/, 'autoplay runs on a pausable clock');
	assert.match(player, /animation\.playState === 'running'\) animation\.pause\(\)/, 'pause freezes every running cue');
	assert.match(player, /root\.dataset\.mode = 'motion'/);
	assert.match(player, /const duration = reduced \? 1 :/, 'reduced motion turns cues into instant state changes');
});

test('wide screens put terminal panels in a column beside the stage', async () => {
	const player = await readFile(PLAYER, 'utf8');
	assert.match(player, /root\.dataset\.panels = step\.querySelector\('\.anim-panels'\) \? 'true' : 'false'/);
	assert.match(player, /\.anim-player\[data-panels='true'\] \.anim-board \{\n\t\t\tgrid-template-columns: minmax\(0, 1fr\) minmax\(24rem, 0\.9fr\);/);
	assert.match(player, /grid-template-areas: 'stage panels';/);
	assert.match(player, /\.anim-player\[data-panels='true'\] \.anim-panels \{[^}]*overflow-y: auto;/, 'a long session scrolls inside its column');
	assert.match(player, /\.anim-player\[data-panels='true'\] \.anim-code \{\n\t\t\twhite-space: pre-wrap;/, 'long lines wrap instead of scrolling sideways');
	assert.match(player, /style=\{`--i:\$\{index\};--indent:\$\{indent\}ch`\}><span class="anim-code"/, 'wrapped code continues under its own indentation');
});

test('every step narrates with captions instead of a narration card', async () => {
	const player = await readFile(PLAYER, 'utf8');
	assert.match(player, /\{step\.subtitles\.map\(\(sub\) =>/, 'captions render for slide and motion steps alike');
	assert.match(player, /<div class="anim-subtitles" aria-hidden="true">\s*<div class="anim-subtitle-track">/, 'the caption band holds only the captions');
	assert.doesNotMatch(player, /anim-caption-kicker|chapterLabel/, 'no chapter tag over the captions');
	assert.doesNotMatch(player, /anim-narration card|anim-step-kicker|anim-step-number/, 'no visible narration card');
	assert.match(player, /\.anim-narration \{\n\t\tposition: absolute;/, 'the full narration stays for assistive tech');
	assert.match(player, /applyScene\(step\);\n\t\t\t\}\n(?:.*\n)?\t\t\trunSubtitles\(step\);/, 'captions play in every step');
});

test('player keeps the visible chrome to the animation: no header, chapter nav or keyboard hint', async () => {
	const player = await readFile(PLAYER, 'utf8');
	assert.doesNotMatch(player, /anim-header|section-subtitle|animations\.kicker/, 'no visible header');
	assert.doesNotMatch(player, /anim-chapters|data-anim-chapter|animations\.chapters/, 'no chapter navigation');
	assert.doesNotMatch(player, /anim-hint|animations\.keyboardHint/, 'no keyboard hint');
	assert.match(player, /<h1 class="anim-visually-hidden">\{title\}<\/h1>/, 'title stays for assistive tech');
	const component = await readFile(COMPONENT, 'utf8');
	assert.doesNotMatch(component, /\n\ttag=|\n\tdescription=/, 'component no longer passes header-only props');
});

test('animation component mounts the player with the script and every scene lives in the scene slot', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { holaMundo, script } from '\.\.\/\.\.\/data\/animations\/conceptos-basicos-java'/);
	assert.match(component, /slot="scene"/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	for (const scene of ['platform', 'pipeline', 'anatomy', 'terminal-flow', 'args', 'conventions', 'ide', 'javadoc', 'errors', 'exercise']) {
		assert.match(component, new RegExp(`data-scene="${scene}"`), `scene ${scene}`);
	}
});
