import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/estructuras-registros-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'estructuras-registros-c';
const LESSON = 'concepto-de-estructuras';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '22-concepto-de-estructuras';
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
		['record', 'array', 'copy', 'enum', 'union', 'padding'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'access', 'array', 'copy', 'enum', 'union', 'padding', 'close'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'journey', `${step.id} plays on the single canvas`);
		assert.ok(step.motion, `${step.id} is a motion step`);
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions`);
		assert.ok(step.motion.cues.length >= 10, `${step.id} choreographs the canvas`);
		const starts = step.motion.cues.map((cue) => cue.at);
		assert.deepEqual(starts, [...starts].sort((a, b) => a - b), `${step.id} lists its cues in order`);
	}
	const kinds = new Set(script.steps.flatMap((step) => step.motion.cues.map((cue) => cue.do)));
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'flow', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);
});

test('the particle and the editor bar never start a move before the previous one ends', () => {
	for (const step of script.steps) {
		for (const el of ['p', 'hl']) {
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

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// What does a struct group?
		'agrupa campos de tipos distintos',
		'registro',
		// How are fields accessed?
		'se alcanza con un punto',
		'`a.legajo`',
		// What happens when a struct is passed to a function?
		'copia el registro completo',
		'solo la copia',
		'copiar todos los bytes cuesta',
		// What does enum name?
		'da nombre a números enteros',
		'`entero` vale 0 y `real` vale 1',
		// Why does a union need a tag?
		'comparten una celda',
		'no recuerda cuál escribiste',
		'la etiqueta `tipo`',
		'reinterpreta los bytes',
		// Why can sizeof exceed the sum of the fields?
		'mayor que la suma de los campos',
		'relleno',
		'múltiplo de 8',
		'`sizeof` baja a 16',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'groups fields of different types',
		'record',
		'reached with a dot',
		'`a.id`',
		'copies the whole record',
		'only the copy',
		'copying every byte costs',
		'gives names to integers',
		'`integer` is 0 and `real` is 1',
		'share one cell',
		'forgets which one you wrote',
		'the `kind` tag',
		'reinterprets the bytes',
		'can exceed the sum of the fields',
		'padding',
		'multiple of 8',
		'`sizeof` drops to 16',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('the copy changes inside the frame and the caller keeps its values until the copy returns', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const has = (id, cue) => cues[id].some((entry) => Object.entries(cue).every(([key, value]) => entry[key] === value));
	// The caller's plate shows 1.0 and 2.0 once and nothing in the call ever rewrites it.
	assert.ok(has('copy', { do: 'enter', el: 'pa-x' }) && has('copy', { do: 'enter', el: 'pa-y' }));
	assert.ok(!cues.copy.some((cue) => cue.el === 'pa-x2' || (cue.do === 'exit' && /^pa-/.test(cue.el))), 'the caller plate is never changed');
	// A whole-plate ghost goes up into the frame; only the copy changes.
	assert.ok(has('copy', { do: 'move', el: 'gh-2', to: 'a-pp' }));
	assert.ok(has('copy', { do: 'exit', el: 'pp-x' }) && has('copy', { do: 'enter', el: 'pp-x2' }));
	assert.ok(has('copy', { do: 'enter', el: 'hx-b' }));
	// `return` brings another whole plate down to `b`, and the frame is popped.
	assert.ok(has('copy', { do: 'move', el: 'gh-3', to: 'a-pb' }));
	assert.ok(has('copy', { do: 'exit', el: 'f-fn' }));
	assert.ok(has('copy', { do: 'enter', el: 'pb-x' }));
	// The first array element is a copy of `a`.
	assert.ok(has('array', { do: 'move', el: 'gh-1', to: 'a-g0' }));
});

test('the padding scene shows 24 bytes against 16 and the sum of the fields', () => {
	const cues = script.steps.find((step) => step.id === 'padding').motion.cues;
	const order = (ids) => ids.map((id) => cues.findIndex((cue) => cue.do === 'enter' && cue.el === id));
	// Fields first, then the gaps, then the reordered strip.
	const [fields, gap, reordered, total2] = order(['seg-1-0', 'seg-1-1', 'seg-2-0', 'tot-2']);
	assert.ok(fields >= 0 && fields < gap && gap < reordered && reordered < total2);
	for (const id of ['seg-1-1', 'seg-1-4', 'seg-2-4', 'tot-sum', 'tot-1', 'tot-2']) assert.ok(cues.some((cue) => cue.el === id), `shows ${id}`);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// The executable lines of each program (`MOD_LINES`) become modules and anchors.
	const modLines = Object.fromEntries(
		[...component.matchAll(/^\t([abcd]): \[([\d, ]+)\],$/gm)].map((match) => [match[1], match[2].split(',').map((n) => Number(n.trim()))]),
	);
	assert.deepEqual(Object.keys(modLines), ['a', 'b', 'c', 'd']);

	// Ids built in a loop (`m-${...}`) or listed in the frontmatter (`id: 'r-a'`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`'${id}'`)) return true;
		const mod = id.match(/^(?:m|on|at)-([abcd])-(\d+)$/);
		if (mod) return modLines[mod[1]]?.includes(Number(mod[2])) ?? false;
		const line = id.match(/^ln-(\d+)$/);
		if (line) return Number(line[1]) >= 1 && Number(line[1]) <= 18;
		const editor = id.match(/^ed-([abcd])$/);
		return Boolean(editor) && component.includes('data-el={`ed-${view.id}`}');
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('every line a module is lit for exists in its program', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	// Programs stay within the editor: at most 18 lines, 64 characters each.
	const sources = [...component.matchAll(/source: \[\n([\s\S]*?)\n\t\t\],/g)].map((match) => match[1].split('\n'));
	assert.equal(sources.length, 4);
	for (const source of sources) assert.ok(source.length <= 18, `a program has ${source.length} lines`);
	const lit = new Map();
	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			const match = cue.el?.match(/^on-([abcd])-(\d+)$/);
			if (match) lit.set(match[1], [...(lit.get(match[1]) ?? []), Number(match[2])]);
		}
	}
	const lengths = { a: 14, b: 17, c: 18, d: 18 };
	for (const [view, lines] of lit) for (const line of lines) assert.ok(line <= lengths[view], `${view}: line ${line} is lit but the program ends at ${lengths[view]}`);
});

test('the code in the canvas is the lesson programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'#include <stdio.h>'",
		'`struct ${names.student} {`',
		'`    int ${names.id};`',
		'`    char ${names.name}[40];`',
		'`    double ${names.average};`',
		'`    struct ${names.student} a = {1021, "Ana Gomez", 8.5};`',
		'{a, {1022, "Luis Perez", 7.25}};',
		'`    ${names.group}[1].${names.average} += 0.5;`',
		'`struct ${names.point} ${names.translate}(struct ${names.point} p, double dx, double dy) {`',
		"'    p.x += dx;'",
		"'    return p;'",
		'`    struct ${names.point} b = ${names.translate}(a, 3.0, -1.0);`',
		'`typedef enum { ${names.intTag}, REAL } ${names.kindType};`',
		"'    union {'",
		'`        int ${names.integer};`',
		'`    } ${names.data};`',
		'.${names.data}.real = 3.5};',
		'`    char ${names.active};`',
		'`    double ${names.balance};`',
		'`    int ${names.number};`',
		"names = {",
		"student: t('alumno', 'student')",
		"id: t('legajo', 'id')",
		"translate: t('trasladar', 'translate')",
		"kindType: t('TipoValor', 'ValueKind')",
		"intTag: t('ENTERO', 'INTEGER')",
		"record: t('registro', 'record')",
		"ordered: t('registro_ordenado', 'ordered_record')",
		"text: '1021 Ana Gomez 8.50'",
		"text: 'Luis Perez 7.75'",
		"text: '(1.0, 2.0)'",
		"text: '(4.0, 1.0)'",
		'`${names.intTag} = 0, REAL = 1`',
		"text: 'real: 3.500'",
		'`sizeof(${names.valueType}) = 16`',
		"text: 'original: 24'",
		'`${names.orderedWord}: 16`',
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// No pointer code: pointers come in a later lesson, and the call is by value.
	assert.doesNotMatch(component, /int \*|&\$\{names|\w->/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/estructuras-registros-c'/);
	assert.match(component, /highlightCode\(view\.source\.join\('\\n'\), 'c'\)/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
