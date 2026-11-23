import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/c23-novedades-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'c23-novedades-c';
const LESSON = 'c23-moderno';
const FILE = '38-c23-moderno';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.deepEqual(animation.tag, { es: 'C', en: 'C' });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['standard', 'types', 'constants', 'attribute', 'embed', 'fallback'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['gate', 'words', 'constexpr', 'typeof', 'attribute', 'embed', 'fallback', 'close'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'journey', `${step.id} plays on the single canvas`);
		assert.ok(step.motion, `${step.id} is a motion step`);
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions`);
		assert.ok(step.motion.cues.length >= 8, `${step.id} choreographs the canvas`);
		const starts = step.motion.cues.map((cue) => cue.at);
		assert.deepEqual(starts, [...starts].sort((a, b) => a - b), `${step.id} lists its cues in order`);
	}
	const kinds = new Set(script.steps.flatMap((step) => step.motion.cues.map((cue) => cue.do)));
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'flow', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);
});

test('the particle, the editor bars and each token never start a move before the previous one ends', () => {
	for (const step of script.steps) {
		const movers = new Set(step.motion.cues.filter((cue) => cue.do === 'move').map((cue) => cue.el));
		for (const el of movers) {
			const moves = step.motion.cues.filter((cue) => cue.do === 'move' && cue.el === el);
			moves.slice(1).forEach((cue, index) => {
				assert.ok(cue.at >= cueEnd(moves[index]), `${step.id}: ${el} moves to ${cue.to} while still travelling`);
			});
		}
	}
});

test('the film lasts between 90 and 120 seconds in both languages', () => {
	for (const lang of ['es', 'en']) {
		const steps = resolveScript(script, lang).steps;
		const total = steps.reduce((sum, step) => sum + step.duration, 0);
		console.log(`${SLUG} ${lang}: ${(total / 1000).toFixed(1)} s`);
		assert.ok(total >= 90_000 && total <= 120_000, `${lang} runs for ${Math.round(total / 1000)} s`);
		for (const step of steps) {
			assert.ok(step.duration > Math.max(...step.motion.cues.map(cueEnd)), `${step.id} (${lang}) outlasts its cues`);
		}
	}
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
		}
	}
});

const narration = (lang) =>
	resolveScript(script, lang)
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();

test('narration answers the questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// How to tell standard, extension and optional apart?
		'una etiqueta',
		'estándar c23, extensión u opcional',
		'otra máquina',
		'extensión de gcc y clang',
		'-wpedantic',
		// What do bool and nullptr change?
		'palabras clave',
		'no un puntero',
		'puntero nulo',
		'nunca se convierte a un entero',
		// What does constexpr give?
		'constexpr',
		'el compilador verifica',
		'puede dimensionar el arreglo',
		'lo rechaza',
		// What does typeof do?
		'el tipo de esa expresión',
		// What is an attribute for?
		'es un atributo',
		'no cambia el programa',
		'mejores advertencias',
		'el compilador avisa',
		// What does #embed do?
		'convierte un archivo en bytes',
		// How can code fall back on older compilers?
		'preguntar con qué estándar se compila',
		'__stdc_version__',
		'202311l',
		'201710l',
		'no garantiza todo c23',
		'comprueba antes de usar',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|vos)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'a label',
		'standard c23, extension or optional',
		'another machine',
		'gcc and clang extension',
		'-wpedantic',
		'are now keywords',
		'not a pointer',
		'null pointer',
		'never converts to an integer',
		'constexpr',
		'the compiler checks',
		'can size the',
		'it rejects it',
		'type of that expression',
		'is an attribute',
		'does not change the program',
		'better warnings',
		'the compiler warns',
		'turns a file into bytes',
		'which standard it is compiled with',
		'__stdc_version__',
		'202311l',
		'201710l',
		'does not guarantee all of c23',
		'check before you use them',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
});

test('the flow crosses the gate before it runs the first line, and the labels arrive with their features', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const has = (id, cue) => cues[id].some((entry) => Object.entries(cue).every(([key, value]) => entry[key] === value));
	const index = (id, cue) => cues[id].findIndex((entry) => Object.entries(cue).every(([key, value]) => entry[key] === value));
	assert.ok(index('gate', { do: 'move', el: 'p', to: 'a-gate' }) < index('gate', { do: 'move', el: 'p', to: 'a-m8' }));
	assert.ok(has('gate', { do: 'enter', el: 'gate-on' }));
	// The three examples of the lesson, one per label.
	for (const id of ['ex-std', 'ex-ext', 'ex-opt']) assert.ok(has('gate', { do: 'enter', el: id }));
	// bool and nullptr are lines 8 and 9; NULL is replaced by nullptr.
	assert.ok(has('words', { do: 'type', el: 'cl-8' }) && has('words', { do: 'type', el: 'cl-9' }));
	assert.ok(has('words', { do: 'enter', el: 'lb-null' }) && has('words', { do: 'enter', el: 'lb-nullptr' }));
	assert.ok(has('words', { do: 'enter', el: 'st-bool' }) && has('words', { do: 'enter', el: 'st-null' }));
	// The constant is known at compile time and sizes the array (eight slots).
	assert.ok(has('constexpr', { do: 'enter', el: 'cap' }) && has('constexpr', { do: 'draw', el: 'fl-cap' }));
	for (const n of [0, 1, 2, 3, 4, 5, 6, 7]) assert.ok(has('constexpr', { do: 'enter', el: `s-${n}` }));
	assert.ok(has('constexpr', { do: 'enter', el: 'lb-rand' }));
	assert.ok(has('constexpr', { do: 'enter', el: 'st-cap' }));
	// typeof carries the type of buffer[0] to copia and was an extension before it was standard.
	assert.ok(has('typeof', { do: 'move', el: 'tk-int', to: 'a-c3' }));
	assert.ok(index('typeof', { do: 'enter', el: 'st-old' }) < index('typeof', { do: 'enter', el: 'st-typeof' }));
	assert.ok(has('typeof', { do: 'exit', el: 'st-old' }));
	// The attribute marks the function; the ignored result is what the compiler warns about.
	assert.ok(has('attribute', { do: 'enter', el: 'lb-attr' }) && has('attribute', { do: 'enter', el: 'st-attr' }));
	assert.ok(has('attribute', { do: 'move', el: 'tk-ret', to: 'a-drop' }));
	assert.ok(index('attribute', { do: 'move', el: 'tk-ret', to: 'a-drop' }) < index('attribute', { do: 'enter', el: 'lb-warn' }));
	// #embed: the file flows into the bytes, then the real compile and run are typed in the console.
	assert.ok(has('embed', { do: 'draw', el: 'fl-embed' }) && has('embed', { do: 'enter', el: 'lb-bytes' }) && has('embed', { do: 'enter', el: 'st-embed' }));
	const consoleRows = cues.embed.filter((cue) => cue.do === 'type' && /^co-\d$/.test(cue.el)).map((cue) => cue.el);
	assert.deepEqual(consoleRows, ['co-0', 'co-1', 'co-2', 'co-3', 'co-4', 'co-5']);
	// The warning (compile step) comes before the program output (run step).
	assert.ok(index('embed', { do: 'type', el: 'co-2' }) < index('embed', { do: 'type', el: 'co-4' }));
	// Fallback: the token for C23 goes to the first branch, the one for C17 to the second; the console shows both runs.
	assert.ok(has('fallback', { do: 'move', el: 'tk-v23', to: 'a-b5' }) && has('fallback', { do: 'move', el: 'tk-v17', to: 'a-b7' }));
	assert.deepEqual(
		cues.fallback.filter((cue) => cue.do === 'type').map((cue) => cue.el),
		['cb-0', 'cb-1', 'cb-2', 'cb-3'],
	);
	// The map is pulled back to the whole system at the end.
	assert.ok(cues.close.some((cue) => cue.do === 'camera' && cue.to[0] === 'shot-all'));
	assert.ok(has('close', { do: 'enter', el: 'lb-sup1' }) && has('close', { do: 'enter', el: 'lb-sup2' }));
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`m-${...}`) or listed in the frontmatter (`id: 'lb-cap'`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const prefix = id.replace(/\d+$/, '');
		return prefix !== id && component.includes('`' + prefix + '${');
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the code in the canvas is the program the narration describes, with its real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'#include <stdio.h>'",
		'`constexpr int ${names.capacity} = 8;`',
		'`int ${names.buffer}[${names.capacity}];`',
		'`[[nodiscard]] int ${names.open}(void) { return 0; }`',
		"'int main(void) {'",
		'`    bool ${names.ready} = true;`',
		"'    int *p = nullptr;'",
		'`    typeof(${names.buffer}[0]) ${names.copy} = ${names.capacity};`',
		'`    ${names.open}();`',
		'`    static const char ${names.source}[] = {`',
		"'#embed __FILE__'",
		"'    };'",
		'`    if (${names.ready} && p == nullptr) puts(',
		'`    printf("${names.copy}=%d, %zu bytes\\\\n", ${names.copy}, sizeof ${names.source});`',
		"'#if __STDC_VERSION__ >= 202311L'",
		"'#elif __STDC_VERSION__ >= 201710L'",
		"'#else'",
		"'#endif'",
		"t('Compilado como C23', 'Compiled as C23')",
		"t('Compilado como C17', 'Compiled as C17')",
		"t('Compilado con un estándar anterior a C17', 'Compiled with a standard older than C17')",
		'`$ cc -std=c23 -Wall -Wextra -Wpedantic ${names.file}`',
		'`${names.file}:11:5: warning: ignoring return value of function declared`',
		`"    with 'nodiscard' attribute [-Wunused-result]"`,
		"'$ cc -std=c23 version.c && ./a.out'",
		"'$ cc -std=c17 version.c && ./a.out'",
		"t('441', '436')",
		"t('p no apunta a nada', 'p points to nothing')",
		"capacity: t('CAPACIDAD', 'CAPACITY')",
		"open: t('abrir_recurso', 'open_resource')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
});

test('the program in the canvas compiles with -std=c23 and prints what the console shows (skipped without a C23 compiler)', async (ctx) => {
	const component = await readFile(COMPONENT, 'utf8');
	const block = component.slice(component.indexOf('const names = {'), component.indexOf('const versionSource'));
	const dir = await mkdtemp(join(tmpdir(), 'c23-film-'));
	try {
		for (const lang of ['es', 'en']) {
			const isEs = lang === 'es';
			const t = (es, en) => (isEs ? es : en);
			const { names, source } = new Function('t', `${block}\nreturn { names, source };`)(t);
			const path = join(dir, names.file);
			await writeFile(path, `${source}\n`);
			const build = spawnSync('cc', ['-std=c23', '-Wall', '-Wextra', '-Wpedantic', path, '-o', join(dir, `a-${lang}`)], { encoding: 'utf8', cwd: dir });
			if (build.error || build.status !== 0) {
				if (build.error || /embed|constexpr|nullptr|typeof/.test(build.stderr)) return ctx.skip('no C23 compiler with #embed');
				assert.fail(build.stderr);
			}
			// Exactly one warning: the ignored result of the nodiscard function, on line 11.
			assert.equal((build.stderr.match(/warning:/g) ?? []).length, 1, build.stderr);
			assert.match(build.stderr, new RegExp(`${names.file}:11:5: warning: ignoring return value of function declared with 'nodiscard' attribute \\[-Wunused-result\\]`));
			const run = spawnSync(join(dir, `a-${lang}`), { encoding: 'utf8' });
			const size = Buffer.byteLength(`${source}\n`);
			assert.equal(run.stdout, `${t('p no apunta a nada', 'p points to nothing')}\n${names.copy}=8, ${size} bytes\n`);
			assert.equal(size, isEs ? 441 : 436, 'the console and the bytes caption show the size of the file');
		}
		// The version check prints C23 with -std=c23 and C17 with -std=c17.
		const versions = { es: ['Compilado como C23', 'Compilado como C17'], en: ['Compiled as C23', 'Compiled as C17'] };
		const bBlock = component.slice(component.indexOf('const versionSource'), component.indexOf('/** The tokenizer'));
		for (const lang of ['es', 'en']) {
			const t = (es, en) => (lang === 'es' ? es : en);
			const { versionSource } = new Function('t', `${bBlock}\nreturn { versionSource };`)(t);
			await writeFile(join(dir, 'version.c'), `${versionSource}\n`);
			for (const [index, std] of ['c23', 'c17'].entries()) {
				const build = spawnSync('cc', [`-std=${std}`, '-Wall', '-Wextra', '-Wpedantic', 'version.c', '-o', 'v'], { encoding: 'utf8', cwd: dir });
				assert.equal(build.status, 0, build.stderr);
				assert.equal(build.stderr, '');
				assert.equal(spawnSync(join(dir, 'v'), { encoding: 'utf8' }).stdout, `${versions[lang][index]}\n`);
			}
		}
	} finally {
		await rm(dir, { recursive: true, force: true });
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/c23-novedades-c'/);
	assert.match(component, /highlightCode\(code, 'c'\)/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.doesNotMatch(component, /<filter/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
