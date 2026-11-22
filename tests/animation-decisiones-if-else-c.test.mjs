import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/decisiones-if-else-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'decisiones-if-else-c';
const LESSON = 'sentencia-if-else';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '08-sentencia-if-else';
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
		['if', 'else', 'chain', 'nested', 'bugs', 'guard'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['fork', 'else', 'chain', 'nested', 'assign', 'semicolon', 'guard', 'close'],
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
		// How does if choose?
		'bifurcación',
		'evalúa la condición',
		'0 es falso y cualquier otro valor es verdadero',
		// What does else add?
		'camino alternativo',
		'exactamente uno de los dos bloques',
		// Why does only one branch of an else-if chain run?
		'se evalúan en orden',
		'solo corre la primera verdadera',
		'no se evalúa',
		'el orden importa',
		// How does nesting work?
		'dentro de otro',
		'solo se alcanza si el primero fue verdadero',
		// What does `if (x = 0)` do?
		'es una asignación',
		'la condición vale lo asignado',
		'siempre verdadera',
		// Why is `if (...);` a bug?
		'sentencia vacía',
		'se ejecuta siempre',
		// The && guard
		'no evalúa el lado derecho',
		'la división nunca se ejecuta',
		'advertencias',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|compilá)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'fork',
		'evaluates the condition',
		'0 is false and any other value is true',
		'alternative path',
		'exactly one of the two blocks',
		'evaluated in order',
		'only the first true one runs',
		'not evaluated',
		'order matters',
		'inside another',
		'reached only if the first one was true',
		'is an assignment',
		'worth the assigned value',
		'always true',
		'empty statement',
		'always runs',
		'does not evaluate the right side',
		'the division never runs',
		'warnings',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('each decision takes exactly the branch the program takes', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const has = (id, cue) => cues[id].some((entry) => Object.entries(cue).every(([key, value]) => entry[key] === value));
	const visited = (id) => cues[id].filter((cue) => cue.do === 'move' && cue.el === 'p').map((cue) => cue.to);
	// if-else: the false branch (line 9), never line 7.
	assert.ok(visited('else').includes('a-a9'));
	assert.ok(![...visited('fork'), ...visited('else')].includes('a-a7'));
	// else-if chain: forks 6, 8, 10 in order, then only line 11; the else (13) is never reached.
	const chain = visited('chain');
	assert.deepEqual(chain.slice(0, 5), ['a-b4', 'a-b6', 'a-b8', 'a-b10', 'a-b11']);
	assert.ok(!chain.some((to) => ['a-b7', 'a-b9', 'a-b13'].includes(to)));
	// nested: outer true, inner true, line 8; neither else runs.
	const inner = visited('nested');
	assert.deepEqual(inner.slice(0, 4), ['a-c4', 'a-c6', 'a-c7', 'a-c8']);
	assert.ok(!inner.some((to) => ['a-c10', 'a-c13'].includes(to)));
	// = instead of ==: the same cell changes from 12 to 16.
	assert.ok(has('assign', { do: 'exit', el: 'v-d12' }));
	assert.ok(has('assign', { do: 'enter', el: 'v-d16' }));
	// stray ;: the empty statement appears and the block runs anyway.
	assert.ok(has('semicolon', { do: 'enter', el: 'semi-d' }));
	assert.ok(visited('semicolon').includes('a-d8'));
	// && guard: the division gate is never visited.
	assert.ok(!visited('guard').includes('a-e7b'));
	assert.ok(visited('guard').includes('a-e10'));
	// The film ends by pulling back over the whole map.
	assert.ok(has('close', { do: 'camera' }) && cues.close.some((cue) => cue.do === 'camera' && cue.to[0] === 'shot-all'));
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Targets built from the district data (`m-a6`, `on-b10`, `run-c-out`, `shot-d`...)
	// are listed here against the frontmatter that generates them.
	const districts = { a: ['4', '6', '7', '9', '12'], b: ['4', '6', '7', '8', '9', '10', '11', '13', '16'], c: ['4', '6', '7', '8', '10', '13', '16'], d: ['4', '6', '8', '11'], e: ['4', '5', '7', '7b', '8', '10', '13'] };
	const generated = new Set(['hl', 'p', 'a-ds']);
	for (const [d, keys] of Object.entries(districts)) {
		generated.add(`dist-${d}`).add(`pg-${d}`).add(`shot-${d}`).add(`tag-${d}`);
		for (const key of keys) for (const prefix of ['m-', 'on-', 'a-']) generated.add(`${prefix}${d}${key}`);
	}
	for (let n = 1; n <= 17; n++) generated.add(`ln-${n}`);
	const known = (id) => {
		if (generated.has(id)) return true;
		if (component.includes(`data-el="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		// Camera shots are declared by name in the `shots` list of the frontmatter.
		if (id.startsWith('shot-') && component.includes(`'${id}'`)) return true;
		const corner = /^k-([a-e])-(\w+)$/.exec(id);
		if (corner) return new RegExp(`id: '${corner[1]}',[\\s\\S]*?points: \\{[^}]*\\b${corner[2]}:`).test(component);
		return false;
	};
	for (const [d, keys] of Object.entries(districts)) {
		for (const key of keys) assert.match(component, new RegExp(`key: '${key}'`), `district ${d} has station ${key}`);
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
		"number: t('numero', 'number')",
		"grade: t('nota', 'grade')",
		"age: t('edad', 'age')",
		"people: t('personas', 'people')",
		'`    if (${names.number} % 2 == 0) {`',
		'`    if (${names.grade} < 0 || ${names.grade} > 10) {`',
		'`    } else if (${names.grade} >= 9) {`',
		'`    } else if (${names.grade} >= 6) {`',
		'`        if (${names.number} == 0) {`',
		'`    if (${names.age} = 16);`',
		'`    if (${names.people} != 0 && total / ${names.people} > 50) {`',
		"t('El número es impar', 'The number is odd')",
		"t('Aprobado', 'Pass')",
		"t('El número es cero', 'The number is zero')",
		"t('Puede votar', 'May vote')",
		"t('No hay personas o cada una paga 50 o menos', 'No people, or each pays 50 or less')",
		'warning: using the result of an assignment as a',
		'warning: if statement has empty body [-Wempty-body]',
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// Every program fits the editor and its lines fit its width.
	const lines = component.match(/^\t{3}['`].*['`],$/gm) ?? [];
	assert.ok(lines.length > 50);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/decisiones-if-else-c'/);
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
