import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/entrada-salida-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'entrada-salida-c';
const LESSON = 'entrada-y-salida';
const FILE = '06-entrada-y-salida';
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
		['read', 'invalid', 'discard', 'leftover', 'format', 'double'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['read', 'invalid', 'discard', 'retry', 'leftover', 'format', 'double', 'close'],
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

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// What does scanf return?
		'devuelve `1`',
		'la cantidad de valores que cargó',
		// Why check it?
		'devuelve `0`',
		'sigue valiendo 0',
		'por eso se compara con `!= 1`',
		// What stays in the buffer after invalid input?
		'siguen en el búfer',
		'quedó pendiente',
		// How to discard it?
		'un ciclo de `getchar`',
		'un carácter por vuelta',
		'descartar la línea es la receta',
		// What does a specifier do?
		'según cada especificador',
		'rellenando con espacios',
		'2 decimales',
		'`%zu` muestra un `size_t`',
		// Why does %lf differ between scanf and printf?
		'lo lee con `%lf`',
		'`scanf` escribiría un `float` en el lugar de un `double`',
		'lo muestra con `%f`',
		'revisa siempre lo que devuelve `scanf`',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|revisá|descartá|escribí)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'returns `1`',
		'the number of values it stored',
		'returns `0`',
		'is still 0',
		'that is why it is compared with `!= 1`',
		'still in the buffer',
		'still pending',
		'a `getchar` loop',
		'one character per turn',
		'discarding the line is the recipe',
		'according to each specifier',
		'padding with spaces',
		'2 decimals',
		'`%zu` shows a `size_t`',
		'reads it with `%lf`',
		'`scanf` would write a `float` where a `double` lives',
		'shows it with `%f`',
		'always check what `scanf` returns',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('each run does what the program does with its input', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const has = (id, cue) => cues[id].some((entry) => Object.entries(cue).every(([key, value]) => entry[key] === value));
	// A move of one millisecond is the reset of the particle at the first module of a new district.
	const visited = (id) => cues[id].filter((cue) => cue.do === 'move' && cue.el === 'p' && cue.dur !== 1).map((cue) => cue.to);
	const moved = (id, tile) => cues[id].filter((cue) => cue.do === 'move' && cue.el === tile).map((cue) => cue.to);
	const all = (...ids) => ids.flatMap((id) => cues[id]);

	// 25: scanf consumes the two digits into the cell and the `\n` stays; the error branch is skipped.
	assert.deepEqual(moved('read', 't-a1'), ['k-a-cell']);
	assert.deepEqual(moved('read', 't-a2'), ['k-a-cell']);
	assert.deepEqual(moved('read', 't-a3'), [], 'the newline is never consumed');
	assert.ok(has('read', { do: 'enter', el: 'v-a25' }));
	assert.deepEqual(visited('read').slice(0, 4), ['a-a6', 'a-a7', 'a-a12', 'a-a13']);
	assert.ok(!visited('read').some((to) => ['a-a8', 'a-a9'].includes(to)));

	// abc: the cell never changes, no tile is consumed, and the error branch runs.
	assert.ok(!has('invalid', { do: 'exit', el: 'v-b0' }));
	for (const tile of ['t-b1', 't-b2', 't-b3', 't-b4']) assert.ok(!has('invalid', { do: 'exit', el: tile }), `${tile} stays in the buffer`);
	assert.deepEqual(moved('invalid', 't-b1'), ['k-b-cell', 's-b-1'], 'scanf looks at the first character and gives it back');
	assert.deepEqual(visited('invalid').slice(0, 4), ['a-b6', 'a-b7', 'a-b8', 'a-b9']);
	assert.ok(has('invalid', { do: 'enter', el: 'zone-b' }));

	// The discard loop: four turns, four characters, one tile each.
	for (const n of [1, 2, 3, 4]) {
		assert.deepEqual(moved('discard', `t-c${n}`), ['k-c-cc']);
		assert.ok(has('discard', { do: 'exit', el: `t-c${n}` }));
	}
	assert.equal(cues.discard.filter((cue) => cue.do === 'pulse' && cue.el === 'm-c8').length, 4, 'the loop turns four times');
	assert.ok(visited('discard').includes('a-c8'));

	// The second read: only the `7` is consumed and the invalid branch is never reached.
	assert.deepEqual(moved('retry', 't-c5'), ['k-c-cell']);
	assert.ok(has('retry', { do: 'exit', el: 'v-c0' }) && has('retry', { do: 'enter', el: 'v-c7' }));
	assert.deepEqual(visited('retry').slice(0, 4), ['a-c11', 'a-c12', 'a-c17', 'a-c18']);
	assert.ok(!all('retry').some((cue) => cue.do === 'move' && ['a-c13', 'a-c14'].includes(cue.to)));

	// 12abc: reads 12, success, and `abc` plus the newline stay queued.
	assert.deepEqual(moved('leftover', 't-d1'), ['k-d-cell']);
	assert.deepEqual(moved('leftover', 't-d2'), ['k-d-cell']);
	for (const tile of ['t-d3', 't-d4', 't-d5', 't-d6']) assert.deepEqual(moved('leftover', tile), [], `${tile} is left unread`);
	assert.ok(has('leftover', { do: 'enter', el: 'v-d12' }) && has('leftover', { do: 'enter', el: 'zone-d' }));
	assert.ok(visited('leftover').includes('a-d12') && !visited('leftover').includes('a-d8'));

	// printf: the six lines in order, each one types its row of the output, then the return.
	assert.deepEqual(visited('format'), ['a-e5', 'a-e6', 'a-e7', 'a-e8', 'a-e9', 'a-e10']);
	const typed = cues.format.filter((cue) => cue.do === 'type').map((cue) => cue.el);
	assert.deepEqual(typed, ['out-e1', 'out-e2', 'out-e3', 'out-e4', 'out-e5', 'out-e6']);
	for (const line of [4, 5, 6, 7, 8, 9]) assert.ok(has('format', { do: 'enter', el: `sp-e${line}` }) && has('format', { do: 'enter', el: `o-e${line}` }));

	// A double: scanf with %lf (the %f mistake is shown and dismissed), then printf with %f.
	assert.ok(has('double', { do: 'enter', el: 'lf-scan' }) && has('double', { do: 'enter', el: 'lf-wrong' }) && has('double', { do: 'exit', el: 'lf-wrong' }));
	for (const tile of ['t-f1', 't-f2', 't-f3', 't-f4']) assert.deepEqual(moved('double', tile), ['k-f-cell']);
	assert.deepEqual(moved('double', 't-f5'), [], 'the newline stays');
	assert.ok(has('double', { do: 'enter', el: 'v-f175' }) && has('double', { do: 'enter', el: 'lf-print' }));
	assert.ok(visited('double').includes('a-f12') && !visited('double').includes('a-f8'));

	// The film ends by pulling back over the whole map.
	assert.ok(cues.close.some((cue) => cue.do === 'camera' && cue.to[0] === 'shot-all'));
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Targets built from the district data (`m-a7`, `on-c8`, `run-b-e`, `t-d3`, `shot-c-buf`...)
	// are listed here against the frontmatter that generates them.
	const read = ['4', '6', '7', '8', '9', '12', '13'];
	const districts = {
		a: { keys: read, tiles: 3, slots: 5 },
		b: { keys: read, tiles: 4, slots: 5 },
		c: { keys: ['4', '5', '6', '7', '8', '11', '12', '13', '14', '17', '18'], tiles: 6, slots: 6 },
		d: { keys: read, tiles: 6, slots: 6 },
		e: { keys: ['4', '5', '6', '7', '8', '9', '10'], tiles: 0, slots: 0 },
		f: { keys: read, tiles: 5, slots: 5 },
	};
	const generated = new Set(['hl', 'p', 'pg-a', 'pg-c', 'pg-e', 'pg-f', 'k-c-cc']);
	for (const [d, spec] of Object.entries(districts)) {
		generated.add(`dist-${d}`).add(`shot-${d}`).add(`tag-${d}`).add(`k-${d}-cell`);
		for (const key of spec.keys) for (const prefix of ['m-', 'on-', 'a-']) generated.add(`${prefix}${d}${key}`);
		for (let n = 1; n <= spec.tiles; n++) generated.add(`t-${d}${n}`);
		for (let n = 1; n <= spec.slots; n++) generated.add(`s-${d}-${n}`);
		if (spec.slots) generated.add(`kb-${d}`).add(`zone-${d}`).add(`shot-${d}-buf`);
	}
	for (const d of ['a', 'b', 'd', 'f']) {
		for (const n of [1, 2, 3, 4, 'e']) generated.add(`run-${d}-${n}`);
	}
	for (let n = 1; n <= 8; n++) generated.add(`run-c-${n}`);
	for (let n = 4; n <= 9; n++) generated.add(`run-e-${n}`).add(`sp-e${n}`).add(`o-e${n}`);
	for (let n = 1; n <= 19; n++) generated.add(`ln-${n}`);
	const known = (id) => generated.has(id) || component.includes(`data-el="${id}"`) || component.includes(`id: '${id}'`) || component.includes(`'${id}'`);
	for (const [d, spec] of Object.entries(districts)) {
		for (const key of spec.keys) assert.match(component, new RegExp(`key: '${key}'`), `district ${d} has station ${key}`);
	}
	// The generated ids that are not literals really are produced by the component.
	for (const fragment of ['data-el={`dist-${d.id}`}', 'data-el={`m-${module.id}`}', 'data-el={`on-${module.id}`}', 'data-el={`kb-${d.id}`}', 'data-el={`zone-${d.id}`}', 'data-el={tile.id}', 'data-el={run.id}', 'data-el={tag.id}', 'id: `s-${d.id}-${slot.n}`', 'id: `a-${module.id}`', 'id: `t-${d}${index + 1}`', 'id: `sp-e${row.line}`', 'id: `o-e${row.line}`', 'data-anchor={`ln-${n}`}']) {
		assert.ok(component.includes(fragment), `component builds ${fragment}`);
	}

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the code in the canvas is the lesson programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"age: t('edad', 'age')",
		"quantity: t('cantidad', 'quantity')",
		"height: t('altura', 'height')",
		'`    if (scanf("%d", &${names.age}) != 1) {`',
		'`    if (scanf("%d", &${names.age}) != 1) {`',
		'`        if (scanf("%d", &${names.quantity}) != 1) {`',
		`while ((c = getchar()) != '\\\\n' && c != EOF) {`,
		'`    if (scanf("%lf", &${names.height}) != 1) {`',
		`'    printf("[%5d]\\\\n", 42);'`,
		`'    printf("[%-5d]\\\\n", 42);'`,
		`'    printf("[%05d]\\\\n", 42);'`,
		`'    printf("[%.2f]\\\\n", 3.14159);'`,
		`'    printf("[%8.2f]\\\\n", 3.14159);'`,
		`'    printf("[%zu]\\\\n", sizeof(double));'`,
		"t('Ingrese su edad: ', 'Enter your age: ')",
		"t('Error: se esperaba un número entero.', 'Error: an integer was expected.')",
		"t('Usted tiene %d años', 'You are %d years old')",
		"t('No es un número. Intente otra vez: ', 'Not a number. Try again: ')",
		"t('Altura en metros: ', 'Height in meters: ')",
		// The real output of each run (piped input).
		"t('Ingrese su edad: Usted tiene 25 años', 'Enter your age: You are 25 years old')",
		"t('Ingrese su edad: Usted tiene 12 años', 'Enter your age: You are 12 years old')",
		"t('Cantidad: No es un número. Intente otra vez: Cantidad: 7', 'Quantity: Not a number. Try again: Quantity: 7')",
		"text: '[   42]'",
		"text: '[42   ]'",
		"text: '[00042]'",
		"text: '[3.14]'",
		"text: '[    3.14]'",
		"text: '[8]'",
		"t('Altura en metros: 1.75 m', 'Height in meters: 1.75 m')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	assert.match(component, /const CONSOLE_TOP = 496;/, 'the longest program (19 lines) fits above the console');
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/entrada-salida-c'/);
	assert.match(component, /highlightCode\(lines\.join\('\\n'\), 'c'\)/);
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
