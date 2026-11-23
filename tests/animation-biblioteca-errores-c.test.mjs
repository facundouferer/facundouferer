import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/biblioteca-errores-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'biblioteca-errores-c';
const LESSON = 'biblioteca-estandar-y-errores';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '34-biblioteca-estandar-y-errores';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;
const firstMove = (cues, el, to) => cues.find((cue) => cue.do === 'move' && cue.el === el && cue.to === to)?.at;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG), 'the film is listed for the lesson');
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['stop', 'end', 'range', 'status', 'caller', 'exit'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['cells', 'trailing', 'empty', 'range', 'status', 'caller', 'paths', 'cleanup'],
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

test('the film lasts between 90 and 120 seconds in both languages', () => {
	for (const lang of ['es', 'en']) {
		const steps = resolveScript(script, lang).steps;
		const total = steps.reduce((sum, step) => sum + step.duration, 0);
		console.log(`# ${lang}: ${Math.round(total / 1000)} s`);
		assert.ok(total >= 90_000 && total <= 120_000, `${lang} runs for ${Math.round(total / 1000)} s`);
		for (const step of steps) {
			assert.ok(step.duration > Math.max(...step.motion.cues.map(cueEnd)), `${step.id} (${lang}) outlasts its cues`);
		}
	}
});

test('every step has a bilingual title and two or three short captions', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 2 && step.subtitles.length <= 3, `${step.id} narrates in two or three captions`);
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
		// 1. How does strtol report where it stopped?
		'strtol deja un puntero donde se detuvo',
		'`strtol` consume "42" y deja `fin` en la primera celda sin usar',
		// 2. Why check the end pointer?
		'`*fin` es `a`, no `\\0`',
		'quedó basura',
		'`fin == texto`',
		'nada que consumir',
		// 3. How is overflow detected?
		'`long_max`',
		'`errno` en `erange`',
		'`errno == erange`',
		// 4. Why clear errno first?
		'`errno = 0`',
		'valor viejo',
		'por eso se limpia antes',
		// 5. Return codes and output parameters.
		'`*resultado`',
		'`true`',
		'`false`',
		'el retorno dice si salió bien',
		'condición del `if`',
		// 6. Why one cleanup exit?
		'tres puntos',
		'`goto limpiar`',
		'misma estación',
		'`free(texto)` no hace nada con `null`',
		'`free(datos)` libera el bloque',
		'`estado = 0`',
		'un solo camino de limpieza',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|liberá|pedí|llamás)\b/i);
	// Curriculum sequencing: nothing from later lessons (files, sanitizers).
	assert.doesNotMatch(all, /fopen|fclose|sanitizer|valgrind/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'strtol leaves a pointer where it stopped',
		'`strtol` consumes "42" and leaves `end` on the first unused cell',
		'`*end` is `a`, not `\\0`',
		'garbage left',
		'`end == text`',
		'nothing to consume',
		'`long_max`',
		'sets `errno` to `erange`',
		'`errno == erange`',
		'`errno = 0`',
		'stale value',
		'that is why it is cleared first',
		'`*result`',
		'`true`',
		'`false`',
		'the return value says if it worked',
		'`if` condition',
		'three points',
		'`goto cleanup`',
		'same station',
		'`free(text)` does nothing with `null`',
		'`free(data)` frees the block',
		'`status = 0`',
		'one cleanup path',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /fopen|fclose|sanitizer|valgrind/i);
});

test('strtol stops on a cell, errno is cleared first, and the end pointer exposes garbage and emptiness', () => {
	// Scene 1: errno holds a stale value, line 3 clears it, strtol eats two digits.
	const cells = cuesOf('cells');
	for (const id of ['f-a', 'f-e', 'str-1', 'v-errno', 'ev-34', 'pin-t', 'pin-f', 'lb-stale', 'lb-clear', 'lb-stop']) assert.ok(idsOf(cells, 'enter').includes(id), `cells shows ${id}`);
	assert.ok(firstAt(cells, 'enter', 'ev-0') > firstAt(cells, 'exit', 'ev-34'), 'the stale value is replaced by 0');
	assert.ok(firstAt(cells, 'enter', 'on-3') < firstAt(cells, 'enter', 'ev-0'), 'line 3 runs before errno shows 0');
	assert.deepEqual(idsOf(cells, 'enter').filter((id) => /^eat-/.test(id)), ['eat-1-0', 'eat-1-1']);
	assert.equal(stopsOf(cells, 'pin-f').at(-1), 'a-f-1-2', 'the end pointer rests on the first unused cell');
	assert.ok(firstMove(cells, 'p', 'a-c-1-0') < firstMove(cells, 'p', 'a-c-1-1'), 'the particle consumes the digits in order');

	// Scene 2: line 5 passes, line 8 sees the garbage, line 9 returns false.
	const trailing = cuesOf('trailing');
	const bar = (cues, line) => firstMove(cues, 'hl', `ln-${line}`);
	assert.ok(bar(trailing, 5) < bar(trailing, 8) && bar(trailing, 8) < bar(trailing, 9), 'lines 5, 8 and 9 run in order');
	assert.ok(idsOf(trailing, 'enter').includes('lb-garbage'));

	// Scene 3: the empty input has a single cell, so the end pointer stays on the text.
	const empty = cuesOf('empty');
	assert.ok(idsOf(empty, 'enter').includes('str-2'));
	assert.ok(stopsOf(empty, 'pin-t').includes('a-t-2-0') && stopsOf(empty, 'pin-f').includes('a-f-2-0'), 'both pointers sit on the only cell');
	assert.ok(bar(empty, 5) < bar(empty, 6), 'line 5 returns false');
	assert.ok(idsOf(empty, 'enter').includes('lb-nodigit'));
});

test('an overflow saturates the result, sets ERANGE and is caught by line 11', () => {
	const range = cuesOf('range');
	assert.deepEqual(idsOf(range, 'enter').filter((id) => /^eat-/.test(id)), ['eat-3-0', 'eat-3-1', 'eat-3-2', 'eat-3-3', 'eat-3-4']);
	assert.equal(stopsOf(range, 'pin-f').at(-1), 'a-f-3-5', 'the end pointer reaches the terminator');
	assert.ok(firstAt(range, 'enter', 'ev-erange') > firstAt(range, 'exit', 'ev-0'), 'errno goes from 0 to ERANGE');
	for (const id of ['val-max', 'lb-sat', 'lb-erange']) assert.ok(idsOf(range, 'enter').includes(id), `range shows ${id}`);
	assert.ok(firstMove(range, 'hl', 'ln-11') > firstAt(range, 'enter', 'ev-erange'), 'line 11 looks at errno after strtol set it');
	assert.ok(firstMove(range, 'hl', 'ln-11') < firstMove(range, 'hl', 'ln-12'), 'line 12 returns false');
});

test('the status and the result travel apart: *resultado writes into the caller, the return says it worked', () => {
	const status = cuesOf('status');
	assert.deepEqual(idsOf(status, 'enter').filter((id) => /^eat-/.test(id)), ['eat-4-0', 'eat-4-1']);
	for (const id of ['f-m', 'v-main', 'vm-q', 'v-res', 'res-ptr', 'lb-out', 'tk-true', 'lb-status']) assert.ok(idsOf(status, 'enter').includes(id), `status shows ${id}`);
	assert.ok(firstAt(status, 'draw', 'ar-res') < firstAt(status, 'enter', 'vm-42'), 'the value reaches the caller through the pointer');
	assert.ok(firstMove(status, 'hl', 'ln-14') < firstMove(status, 'hl', 'ln-15'), 'line 14 writes before line 15 returns');
	assert.equal(stopsOf(status, 'tk-true').at(-1), 'a-main', 'the status token flies back to the caller');

	// The caller reads each status in turn and prints the real output.
	const caller = cuesOf('caller');
	assert.deepEqual(idsOf(caller, 'enter').filter((id) => /^st-/.test(id)), ['st-1', 'st-2', 'st-3', 'st-4']);
	assert.deepEqual(idsOf(caller, 'type'), ['out-1', 'out-2', 'out-3', 'out-4']);
	assert.ok(firstMove(caller, 'hl', 'ln-b-6') < firstMove(caller, 'hl', 'ln-b-9'), 'the condition is checked before the message');
	assert.ok(stopsOf(caller, 'hl').includes('ln-b-7'), 'the true status prints the value');
});

test('three failure paths converge on one cleanup station that releases what exists', () => {
	const paths = cuesOf('paths');
	for (const id of ['f-p', 'f-s', 'v-datos', 'v-texto', 'pd-null', 'pt-null', 'lb-one']) assert.ok(idsOf(paths, 'enter').includes(id), `paths shows ${id}`);
	assert.deepEqual(idsOf(paths, 'draw'), ['fl-g7', 'fl-g11', 'fl-g15']);
	assert.ok(firstMove(paths, 'hl', 'ln-c-9') < firstMove(paths, 'hl', 'ln-c-13'), 'datos is reserved before texto');
	assert.ok(firstAt(paths, 'enter', 'pd-addr') > firstAt(paths, 'exit', 'pd-null'));
	assert.ok(stopsOf(paths, 'p').at(-1) === 'a-st', 'the particle ends on the station');

	const cleanup = cuesOf('cleanup');
	assert.ok(firstMove(cleanup, 'hl', 'ln-c-19') < firstMove(cleanup, 'hl', 'ln-c-20'));
	assert.ok(firstMove(cleanup, 'hl', 'ln-c-20') < firstMove(cleanup, 'hl', 'ln-c-21'));
	assert.ok(firstMove(cleanup, 'hl', 'ln-c-21') < firstMove(cleanup, 'hl', 'ln-c-22'));
	for (const id of ['lb-null', 'fr-datos', 'lb-free']) assert.ok(idsOf(cleanup, 'enter').includes(id), `cleanup shows ${id}`);
	assert.ok(firstAt(cleanup, 'draw', 'fl-ok17') > 0, 'the success path also falls into the cleanup');
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all'], 'the camera pulls back to show every floor');
});

test('every instruction runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	const programs = [
		{ bar: 'ln-', particle: 'a-m', module: 'm-', lit: 'on-', lines: [3, 4, 5, 6, 8, 9, 11, 12, 14, 15] },
		{ bar: 'ln-b-', particle: 'a-b', module: 'mb-', lit: 'onb-', lines: [4, 5, 6, 7, 9] },
		{ bar: 'ln-c-', particle: 'a-p', module: 'mc-', lit: 'onc-', lines: [7, 9, 11, 13, 15, 17, 20, 21, 22] },
	];
	for (const program of programs) {
		for (const line of program.lines) {
			assert.ok(stopsOf(all, 'hl').includes(`${program.bar}${line}`), `the bar reaches ${program.bar}${line}`);
			assert.ok(stopsOf(all, 'p').includes(`${program.particle}${line}`), `the flow visits ${program.particle}${line}`);
			assert.ok(idsOf(all, 'enter').includes(`${program.module}${line}`), `module ${program.module}${line} is built`);
			assert.ok(idsOf(all, 'enter').includes(`${program.lit}${line}`), `module ${program.lit}${line} lights up`);
		}
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`file: '${id}'`)) return true;
		// Generated ids: modules, lit states, strings, eaten cells, anchors, floors, lines.
		const patterns = [
			[/^(m|mb|mc)-\d+$/, "makeModules('"],
			[/^(on|onb|onc)-\d+$/, 'litPrefix'],
			[/^str-\d$/, '`str-${s.g}`'],
			[/^eat-\d-\d$/, '`eat-${s.g}-${i}`'],
			[/^a-m\d+$/, '`a-m${m.line}`'],
			[/^a-b\d+$/, '`a-b${m.line}`'],
			[/^a-p\d+$/, '`a-p${m.line}`'],
			[/^a-t-\d-\d$/, '`a-t-${s.g}-${i}`'],
			[/^a-f-\d-\d$/, '`a-f-${s.g}-${i}`'],
			[/^a-c-\d-\d$/, '`a-c-${s.g}-${i}`'],
			[/^ln-\d+$/, '`ln-${line.n}`'],
			[/^ln-b-\d+$/, '`ln-b-${line.n}`'],
			[/^ln-c-\d+$/, '`ln-c-${line.n}`'],
		];
		return patterns.some(([pattern, marker]) => pattern.test(id) && component.includes(marker));
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
	// Every module of the three programs exists, with its editor line on its face.
	for (const line of [3, 4, 5, 6, 8, 9, 11, 12, 14, 15, 7, 2, 10, 13, 17, 20, 21, 22]) {
		assert.match(component, new RegExp(`\\[${line}, '(flow|violet|magenta)'`), `module spec for line ${line}`);
	}
	// Strings: four inputs, the empty one with a single cell.
	for (const chars of ["['4', '2', 'a', 'b', 'c', '\\\\0']", "['\\\\0']", "['9', '9', '9', '…', '9', '\\\\0']", "['4', '2', '\\\\0']"]) {
		assert.ok(component.includes(chars), `input cells ${chars}`);
	}
});

test('the editor holds the lesson programs, fits its lines and uses C highlighting', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the editor uses C highlighting');
	for (const fragment of [
		'`bool ${n.fn}(const char *${n.text}, int *${n.result}) {`',
		'`    char *${n.end};`',
		"'    errno = 0;'",
		'`    long ${n.value} = strtol(${n.text}, &${n.end}, 10);`',
		'`    if (${n.end} == ${n.text}) {`',
		"`    if (*${n.end} != '\\\\0') {`",
		'`    if (errno == ERANGE || ${n.value} < INT_MIN || ${n.value} > INT_MAX) {`',
		'`    *${n.result} = (int)${n.value};`',
		"'    return true;'",
		'`        if (${n.fn}(${n.tests}[i], &${n.value})) {`',
		'`        goto ${n.cleanup};`',
		'`    ${n.cleanup}:`'.replace('    ', ''),
		'`    free(${n.text});`',
		'`    free(${n.data});`',
		'`    return ${n.status};`',
		// Identifiers localized like the lesson.
		"t('leer_entero', 'read_int')",
		"t('resultado', 'result')",
		"t('fin', 'end')",
		"t('procesar', 'process')",
		"t('estado', 'status')",
		"t('datos', 'data')",
		"t('limpiar', 'cleanup')",
		"t('no es un entero válido', 'not a valid integer')",
		// Real output of `cc -std=c23` with the inputs "42abc", "", twenty nines and "42".
		'"99999999999999999999" -> ${n.invalid}',
		"'\"42\" -> 42'",
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Every line fits the editor (about 70 characters at 12.5 px) in both languages.
	const longest = { '${n.fn}': 'leer_entero', '${n.text}': 'texto', '${n.result}': 'resultado', '${n.end}': 'fin', '${n.value}': 'valor', '${n.proc}': 'procesar', '${n.status}': 'estado', '${n.data}': 'datos', '${n.cleanup}': 'limpiar', '${n.tests}': 'pruebas', '${n.invalid}': 'no es un entero válido' };
	const body = component.split('const sourceA = [')[1].split('/** The tokenizer')[0];
	for (const raw of body.split('\n').filter((line) => /^\t[`'].*[`'],$/.test(line))) {
		let filled = raw.trim().slice(1, -2).replaceAll('\\\\', '\\');
		for (const [slot, value] of Object.entries(longest)) filled = filled.replaceAll(slot, value);
		assert.ok(!filled.includes('${') || filled.includes('testsDecl'), `unfilled slot in ${raw}`);
		assert.ok(filled.length <= 70, `a program line is too long (${filled.length}): ${filled}`);
	}
});
