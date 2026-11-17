import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/jdbc-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'jdbc-java';
const LESSON = '19-acceso-a-bases-de-datos-jdbc';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '21-acceso-a-bases-de-datos-jdbc';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);

test(`catalog binds ${SLUG} to java/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.ok(getAnimationsForLesson('java', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['bridge', 'injection', 'prepared', 'autocommit', 'transaction', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['connect', 'inject', 'template', 'bind', 'autocommit', 'rollback', 'commit', 'recap'],
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

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();
	for (const concept of [
		// 1. What sits between the Java code and the database?
		'drivermanager',
		'connection',
		'interfaz',
		'driver',
		'try-with-resources',
		// 2. Why is concatenating the user input into the SQL dangerous?
		'concatena',
		"'1'='1'",
		'el dato se volvió código',
		'todos los usuarios',
		'inyección sql',
		// 3. How does a PreparedStatement prevent it?
		'preparedstatement',
		'plantilla',
		'?',
		'fija su estructura',
		'como dato',
		'arrancan en 1',
		'no encuentra a nadie',
		// 4. Why is autocommit dangerous for two dependent operations?
		'autocommit',
		'al instante',
		'no llegó a la otra',
		// 5. How do commit and rollback keep the database consistent?
		'setautocommit(false)',
		'pendientes',
		'rollback()',
		'deshace todo',
		'commit()',
		// 6. What does the finally restore, and what is the rule to remember?
		'finally',
		'setautocommit(true)',
		'todo o nada',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|conectá)\b/i);
	// Concepts from outside this lesson stay out of the film.
	assert.doesNotMatch(all, /hibernate|jpa|spring|orm\b/i);
});

test('the concatenated query reaches every row, the prepared one finds nobody', () => {
	const inject = cuesOf('inject');
	assert.deepEqual(stopsOf(inject, 'q-bad'), ['a-port', 'a-conn', 'a-engine', 'a-users']);
	assert.ok(idsOf(inject, 'draw').includes('fl-bad'), 'the dangerous query travels a magenta line');
	assert.ok(idsOf(inject, 'enter').includes('rows-bad'), 'every row lights up');
	assert.ok(idsOf(inject, 'enter').includes('res-all'));

	// The template travels first and is compiled; the value travels apart, as data.
	const template = cuesOf('template');
	assert.deepEqual(stopsOf(template, 'q-tpl'), ['a-port', 'a-conn', 'a-engine']);
	assert.ok(idsOf(template, 'enter').includes('plan'), 'the database fixes the structure');
	const bind = cuesOf('bind');
	assert.deepEqual(stopsOf(bind, 'q-val'), ['a-port', 'a-conn', 'a-engine', 'a-users']);
	assert.ok(idsOf(bind, 'enter').includes('res-none'));
	assert.deepEqual(idsOf(bind, 'type').filter((id) => id.startsWith('out-')), ['out-a']);
	assert.ok(!idsOf(bind, 'enter').includes('rows-bad'), 'no row is returned');
});

test('autocommit loses the money; the transaction rolls back, then commits both updates', () => {
	const auto = cuesOf('autocommit');
	assert.deepEqual(stopsOf(auto, 'q-deb'), ['a-port', 'a-conn', 'a-engine', 'a-acc-a']);
	assert.deepEqual(stopsOf(auto, 'q-acr'), ['a-port', 'a-conn', 'a-cut']);
	for (const id of ['sa-auto', 'cut', 'lb-evap', 'acc-a-bad']) assert.ok(idsOf(auto, 'enter').includes(id), `autocommit shows ${id}`);

	const rollback = cuesOf('rollback');
	assert.ok(idsOf(rollback, 'enter').includes('tx-box'), 'setAutoCommit(false) opens the transaction');
	assert.deepEqual(stopsOf(rollback, 'q-acr').slice(-3), ['a-port', 'a-conn', 'a-cut']);
	assert.ok(idsOf(rollback, 'draw').includes('fl-rb'), 'rollback travels to the database');
	const pendingOut = rollback.find((cue) => cue.do === 'exit' && cue.el === 'sa-pend');
	const restored = rollback.filter((cue) => cue.do === 'enter' && cue.el === 'sa-0').at(-1);
	assert.ok(pendingOut && restored && restored.at > pendingOut.at, 'rollback restores the original balance');

	const commit = cuesOf('commit');
	assert.deepEqual(stopsOf(commit, 'q-acr').slice(-4), ['a-port', 'a-conn', 'a-engine', 'a-acc-b']);
	for (const id of ['sa-ok', 'sb-ok', 'lb-reset']) assert.ok(idsOf(commit, 'enter').includes(id), `commit shows ${id}`);
	const committed = commit.find((cue) => cue.do === 'enter' && cue.el === 'sa-ok');
	const closed = commit.find((cue) => cue.do === 'exit' && cue.el === 'tx-box');
	assert.ok(closed && closed.at > committed.at, 'the finally runs after commit');
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

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

test('the code in the canvas is the program the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'DriverManager.getConnection(url, "${strings.user}", "${strings.secret}")) {',
		'Statement st = conn.createStatement();',
		'`    String sql = "SELECT * FROM ${names.users} WHERE email = \'"`',
		'`            + email + "\'";`',
		'ResultSet ${names.all} = st.executeQuery(sql);',
		'try (PreparedStatement ps = conn.prepareStatement(',
		'WHERE email = ?")) {',
		'ps.setString(1, email);',
		'ResultSet rs = ps.executeQuery();',
		'conn.setAutoCommit(false);',
		'`    ${names.debit}(conn, ${names.source}, 5000);`',
		'`    ${names.credit}(conn, ${names.target}, 5000);`',
		'conn.commit();',
		'} catch (SQLException e) {',
		'conn.rollback();',
		'} finally {',
		'conn.setAutoCommit(true);',
		"t('usuarios', 'users')",
		"t('debitar', 'debit')",
		"t('acreditar', 'credit')",
		"t('obtenerConexion', 'getConnection')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	const lines = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.ok(lines('sourceA').length <= 20 && lines('sourceB').length <= 20, 'the editor holds at most 20 lines');
	assert.match(lines('sourceA')[7], /String sql = "SELECT \* FROM/, 'line 8 concatenates');
	assert.match(lines('sourceA')[13], /ps\.setString\(1, email\)/, 'line 14 binds the parameter');
	assert.match(lines('sourceB')[2], /setAutoCommit\(false\)/, 'line 3 opens the transaction');
	assert.match(lines('sourceB')[7], /conn\.commit\(\)/, 'line 8 commits');
	assert.match(lines('sourceB')[10], /conn\.rollback\(\)/, 'line 11 rolls back');
	assert.match(lines('sourceB')[13], /setAutoCommit\(true\)/, 'line 14 restores autocommit');
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/jdbc-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='jdbc-java'/g) ?? []).length, 4);
});
