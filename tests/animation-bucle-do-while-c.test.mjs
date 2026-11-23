import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/bucle-do-while-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'bucle-do-while-c';
const LESSON = 'sentencia-do-while';
const FILE = '13-sentencia-do-while';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el, to) => cues.find((cue) => cue.do === kind && cue.el === el && (to === undefined || cue.to === to))?.at;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
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
		['once', 'validate', 'scope', 'menu', 'jumps', 'whole'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['once', 'while', 'validate', 'retry', 'scope', 'menu', 'jumps', 'for', 'recap'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'dowhile', `${step.id} plays on the single canvas`);
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
		console.log(`${SLUG} ${lang}: ${(total / 1000).toFixed(1)} s`);
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

// Nothing from later lessons: pointers, arrays, strings, structs, dynamic memory.
const LATER = /puntero|pointer|arreglo|array|cadena|string|struct|malloc|free\(|heap|stack|pila/i;

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// 1. Why does the body run at least once?
		'la puerta de la condición está al final, tras el cuerpo',
		'`el número es 10`',
		'al menos una vez',
		// 2. When does do-while fit better than while?
		'`while` puede dar cero vueltas',
		'pedir un dato ocurre siempre una vez',
		'un menú se muestra al menos una vez',
		// 3. How does the validation loop work?
		'se repite mientras sea inválido',
		'`scanf` no lee un número',
		'`getchar` descarta la línea',
		'otra vuelta',
		'la condición es falsa',
		// 4. Where does break go?
		'`break` termina el `switch`, no el ciclo',
		'`break` sale del ciclo y sigue después de él',
		// 5. Where does continue go?
		'`continue` salta el resto y va a la condición',
		'en un `for`, `continue` salta a la actualización',
		'`1 3 4 | i = 5`',
		// 6. Why can the condition not see a variable declared inside the body?
		'después de la llave de cierre, fuera del bloque',
		'no ve `c`',
		'van antes del `do`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|declará|elegí)\b/i);
	assert.doesNotMatch(all, LATER);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		"the condition's gate sits at the end, after the body",
		'`the number is 10`',
		'at least once',
		'`while` may make zero passes',
		'asking for a value always happens once',
		'a menu is shown at least once',
		'it repeats while invalid',
		'`scanf` reads no number',
		'`getchar` discards the line',
		'another pass',
		'the condition is false',
		'`break` ends the `switch`, not the loop',
		'`break` leaves the loop and goes on after it',
		'`continue` skips the rest and goes to the condition',
		'in a `for`, `continue` jumps to the update',
		'`1 3 4 | i = 5`',
		'after the closing brace, outside the block',
		'it cannot see `c`',
		'go before `do`',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, LATER);
});

test('the body runs before the gate, and a while gate in front gives zero passes', () => {
	const once = cuesOf('once');
	assert.ok(firstAt(once, 'move', 'p', 'a-a7') < firstAt(once, 'move', 'p', 'a-a8'), 'the body runs before the gate');
	assert.ok(firstAt(once, 'type', 'o-a1') < firstAt(once, 'move', 'p', 'a-a8'), 'it prints before asking');
	assert.ok(stopsOf(once, 'p').indexOf('a-a10') > stopsOf(once, 'p').indexOf('a-a8'), 'false: it leaves');
	const before = cuesOf('while');
	assert.deepEqual(stopsOf(before, 'p'), ['a-a-in', 'a-a-gw', 'a-a-by', 'a-a10'], 'the while gate sends the flow past the body');
	assert.ok(!stopsOf(before, 'p').includes('a-a7'));
	for (const id of ['gw-a', 'lb-a-zero']) assert.ok(idsOf(before, 'enter').includes(id));
});

test('validation: bad input is discarded and asked again until the value is valid', () => {
	const cues = cuesOf('validate', 'retry');
	assert.deepEqual(stopsOf(cues, 't-abc'), ['a-b8', 'a-b-bin'], 'abc is read and discarded');
	assert.ok(idsOf(cues, 'exit').includes('t-abc'));
	assert.deepEqual(stopsOf(cues, 't-150'), ['a-b4v']);
	assert.deepEqual(stopsOf(cues, 't-30'), ['a-b4v']);
	const stops = stopsOf(cues, 'p');
	assert.equal(stops.filter((stop) => stop === 'a-b17').length, 3, 'three passes reach the gate');
	assert.equal(stops.filter((stop) => stop === 'a-b-r1').length, 2, 'two of them go back');
	assert.equal(stops.at(-1), 'a-b19', 'the valid age leaves the loop');
	assert.deepEqual(idsOf(cues, 'type').filter((id) => id.startsWith('o-b') || id.startsWith('i-b')), ['o-b0', 'i-b0', 'o-b1', 'o-b2', 'i-b2', 'o-b3', 'o-b4', 'i-b4', 'o-b5']);
	const scope = cuesOf('scope');
	for (const id of ['blk-b', 'x-b', 'warn-b17', 'lb-b-c']) assert.ok(idsOf(scope, 'enter').includes(id));
	for (const id of ['probe-b', 'rd-b']) assert.ok(idsOf(scope, 'draw').includes(id));
});

test('break in the menu ends the switch; continue jumps to the gate; break leaves the loop', () => {
	const menu = cuesOf('menu');
	const stops = stopsOf(menu, 'p');
	assert.equal(stops.filter((stop) => stop === 'a-c-sw').length, 3, 'every break lands at the end of the switch');
	for (let index = 0; index < stops.length; index++) {
		if (stops[index] === 'a-c-sw') assert.equal(stops[index + 1], 'a-c17', 'after the switch the flow goes on to the gate');
	}
	assert.equal(stops.at(-1), 'a-c18', 'option != 0 being false ends the menu');

	const jumps = cuesOf('jumps');
	const d = stopsOf(jumps, 'p');
	const cont = d.indexOf('a-d8');
	assert.deepEqual(d.slice(cont + 1, cont + 3), ['a-d-jc', 'a-d14'], 'continue jumps to the condition');
	const brk = d.indexOf('a-d11');
	assert.deepEqual(d.slice(brk + 1, brk + 3), ['a-d-jb', 'a-d15'], 'break goes past the gate');
	assert.deepEqual(idsOf(jumps, 'type'), ['o-d1', 'o-d3', 'o-d4', 'o-d5']);
	assert.ok(idsOf(cuesOf('for'), 'draw').includes('jc-f'), 'the for continue lands on the update');

	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('every executed module runs on its editor line', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const mod of ['a4', 'a7', 'a8', 'a10', 'b4', 'b5', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12', 'b13', 'b14', 'b15', 'b17', 'b18', 'b19', 'c4', 'c5', 'c7', 'c9', 'c10', 'c11', 'c13', 'c14', 'c17', 'c18', 'd4', 'd6', 'd7', 'd8', 'd10', 'd11', 'd13', 'd14', 'd15', 'd16']) {
		assert.ok(stopsOf(all, 'p').includes(`a-${mod}`), `the flow visits ${mod}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${mod}`), `module ${mod} is built`);
		assert.ok(stopsOf(all, 'hl').includes(`ln-${mod.slice(1)}`), `the bar reaches line ${mod.slice(1)}`);
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="dowhile" data-motion/);
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const mod = id.match(/^(?:m|a)-([abcd]\d+)v?$/);
		if (mod) return component.includes(`id: '${mod[1]}'`);
		const track = id.match(/^(?:trk|arc)-([abcd])$|^a-([abcd])-(?:in|r1|r2)$/);
		if (track) return component.includes(`track: '${track[1] ?? track[2]}'`);
		const line = id.match(/^ln-(\d+)$/);
		if (line) return Number(line[1]) <= 20 && component.includes('data-anchor={`ln-${line}`}');
		if (/^v-d4-\d$/.test(id)) return component.includes('id: `v-d4-${value}`');
		if (/^(?:ed|file)-[abcd]$/.test(id)) return component.includes(`'${id}'`);
		return false;
	};
	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the editor holds the lesson programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the programs use C highlighting');
	const fill = {
		es: { num: 'numero', age: 'edad', read: 'leidos', opt: 'opcion', cnt: 'contador', number: 'El número es', agePrompt: 'Edad (0 a 120): ', notNum: 'Eso no es un número', range: 'Fuera de rango', recorded: 'Edad registrada', menu: '[1] Sumar  [2] Restar  [3] Ver  [0] Salir', option: 'Opción: ', counter: 'Contador', bye: 'Hasta luego', invalid: 'Opción inválida' },
		en: { num: 'number', age: 'age', read: 'items_read', opt: 'option', cnt: 'counter', number: 'The number is', agePrompt: 'Age (0 to 120): ', notNum: 'That is not a number', range: 'Out of range', recorded: 'Age recorded', menu: '[1] Add  [2] Subtract  [3] Show  [0] Quit', option: 'Option: ', counter: 'Counter', bye: 'Goodbye', invalid: 'Invalid option' },
	};
	for (const [lang, values] of Object.entries(fill)) for (const value of Object.values(values)) assert.ok(component.includes(`'${value}'`), `${lang} string ${value}`);
	const lengths = { programOnce: 11, programValidate: 20, programMenu: 19, programJumps: 17 };
	for (const [name, count] of Object.entries(lengths)) {
		const program = component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
		assert.equal(program.length, count, `${name} holds ${count} lines`);
		for (const [lang, values] of Object.entries(fill)) {
			for (const line of program) {
				let filled = line.trim().slice(1, -2).replaceAll('\\\\', '\\');
				filled = filled.replace(/\$\{[ns]\.(\w+)\}/g, (_, key) => values[key]);
				assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
				assert.ok(filled.length <= 64, `${lang} line too long (${filled.length}): ${filled}`);
			}
		}
	}
	for (const fragment of [
		'`    } while (${n.num} < 5);`',
		'`        ${n.read} = scanf("%d", &${n.age});`',
		"while ((c = getchar()) != '\\\\n' && c != EOF) {}",
		'`    } while (${n.read} != 1 || ${n.age} < 0 || ${n.age} > 120);`',
		'`            case 1: ${n.cnt}++; break;`',
		'`    } while (${n.opt} != 0);`',
		"'            continue;'",
		"'            break;'",
		"'    } while (i < 8);'",
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Real output (cc -std=c23): input abc/150/30 for the validation, 1/3/0 for the menu.
	for (const out of ["text: `${s.number} 10`", "text: 'abc', input: true", "text: '150', input: true", "text: `${s.recorded}: 30`", "text: `${s.counter}: 1`", 'text: s.bye', "text: '| i = 5'"]) {
		assert.ok(component.includes(out), `missing output ${out}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/bucle-do-while-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');
	assert.match(component, /font-family: var\(--font-body\)/);
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/);
	assert.match(component, /--xj-magenta: #f7038a;/);
	assert.doesNotMatch(component, /var\(--color-/);
	assert.equal((component.match(/data-slug='bucle-do-while-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i);
});
