import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/switch-bloques-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'switch-bloques-c';
const LESSON = 'sentencia-switch-y-bloques-de-codigo';
const FILE = '10-sentencia-switch-y-bloques-de-codigo';
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
		['jump', 'break', 'fall', 'default', 'block', 'close'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'jump', 'break', 'fall', 'mark', 'default', 'scope', 'close'],
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

test('the particle, the token and the editor bar never start a move before the previous one ends', () => {
	for (const step of script.steps) {
		for (const el of ['p', 'hl', 'tk-3', 'tk-2', 'tk-7']) {
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
		// Where does switch jump?
		'evalúa `plan` una sola vez',
		'salta directo a la etiqueta que coincide',
		// What does break do?
		'`break`: termina el `switch`',
		'después de la llave de cierre',
		// What happens without break?
		'sin `break`, la ejecución cae al siguiente caso',
		'solo puntos de entrada',
		// What is default for?
		'atrapa todos los valores que no tienen su `case`',
		// What does [[fallthrough]] say?
		'`[[fallthrough]];`',
		'la caída es intencional',
		// Where is a block variable visible?
		'oculta a la de afuera',
		'solo se ve dentro de su bloque',
		'alcance',
		'deja de existir',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'evaluates `plan` once',
		'jumps straight to the matching label',
		'`break`: it ends the `switch`',
		'after the closing brace',
		'without `break`, execution falls into the next case',
		'only entry points',
		'catches every value without its own `case`',
		'`[[fallthrough]];`',
		'the fall-through is intentional',
		'shadows the outer one',
		'visible only inside its block',
		'scope',
		'ceases to exist',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('each run jumps straight to its own door and the block variable dies at the closing brace', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const jumps = (id, token) => cues[id].filter((cue) => cue.do === 'move' && cue.el === token).map((cue) => cue.to);
	// The token goes to the switch (line 6) and from there in one jump to its label.
	assert.deepEqual(jumps('jump', 'tk-3'), ['a-k6', 'a-d3']);
	assert.deepEqual(jumps('fall', 'tk-2'), ['a-k6', 'a-d2']);
	assert.deepEqual(jumps('default', 'tk-7'), ['a-k6', 'a-d4']);
	// Without break, the flow crosses the next label; the attribute then marks it as wanted.
	assert.ok(cues.fall.some((cue) => cue.do === 'draw' && cue.el === 'fl-fall'));
	assert.ok(cues.fall.some((cue) => cue.do === 'enter' && cue.el === 'warn'));
	assert.ok(cues.mark.some((cue) => cue.do === 'type' && cue.el === 'ft-12'));
	assert.ok(cues.mark.some((cue) => cue.do === 'exit' && cue.el === 'warn'));
	// break leaves the switch and execution continues at line 21.
	assert.ok(cues.break.some((cue) => cue.do === 'move' && cue.el === 'p' && cue.to === 'a-m21'));
	// The inner x exists only between lines 6 and 9; the outer one is never changed.
	assert.ok(cues.scope.some((cue) => cue.do === 'enter' && cue.el === 'cx-in'));
	assert.ok(cues.close.some((cue) => cue.do === 'exit' && cue.el === 'cx-in'));
	assert.ok(cues.close.some((cue) => cue.do === 'exit' && cue.el === 'blk'));
	for (const step of script.steps) {
		assert.ok(!step.motion.cues.some((cue) => cue.do === 'exit' && cue.el === 'cx-out'), `${step.id} keeps the outer x`);
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`m-${...}`) or listed in the frontmatter (`id: 'out-1'`) count as present.
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

test('the code in the canvas is the lesson programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'    switch (plan) {'",
		"'        case 1:'",
		"'        case 2:'",
		"'        case 3:'",
		"'            break;'",
		"'        default:'",
		"const FALL = '            [[fallthrough]];'",
		"'// 1 = completo, 2 = intermedio, 3 = básico', '// 1 = full, 2 = standard, 3 = basic'",
		"support: t('- soporte prioritario', '- priority support')",
		"backups: t('- copias de seguridad', '- backups')",
		"email: t('- correo', '- email')",
		"unknown: t('- nada: plan desconocido', '- nothing: unknown plan')",
		"'    int x = 1;'",
		'`        int x = 2;  ',
		"inside: t('adentro', 'inside')",
		"outside: t('afuera', 'outside')",
		'`${names.inside}: 2`',
		'`${names.outside}: 1`',
		"'warning: this statement may fall through'",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// Each run of plan.c prints what the real program prints for 3, 2 and 7.
	assert.match(component, /\[3, 2, 7\]\.map/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/switch-bloques-c'/);
	assert.match(component, /highlightCode\(source, 'c'\)/);
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
