import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a SQL query through JDBC": a short film (about two minutes) for
// the Java lesson "Acceso a Bases de Datos con JDBC y SQL Seguro" (order: 23). It
// plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/jdbc-java.astro`): an isometric tower where your code
// sits on top, the `java.sql` level with the `Connection` in the middle and the
// database at the bottom. Each query is a card that travels down that pipe. Magenta
// marks the problem (concatenated SQL, the half-done transfer under autocommit);
// violet marks what resolves it (`PreparedStatement` parameters, the transaction).

const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

/**
 * Pins captions on the step timeline: each one starts once the previous has been
 * read (same formula as `subtitleReadingTime`, for the slower locale) plus a pause.
 * Cues are placed relative to those starts to stay in sync with what is being said.
 */
const readingMs = (sub: Subtitle) => 1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;
function timed(...subs: Subtitle[]) {
	let at = 0;
	const starts: number[] = [];
	const list = subs.map((sub) => {
		starts.push(at);
		const placed: Subtitle = { ...sub, at };
		at += readingMs(sub) + 200;
		return placed;
	});
	return { list, start: (index: number) => starts[index] ?? 0 };
}

/** Cues in chronological order: later cues must be scheduled after the ones they override. */
const seq = (...cues: MotionCue[]): MotionCue[] =>
	cues
		.map((cue, index) => ({ cue, index }))
		.sort((a, b) => a.cue.at - b.cue.at || a.index - b.index)
		.map((entry) => entry.cue);

/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

/** Types the editor lines `from`..`to` of one page (`ea` or `eb`), one after the other. */
const typeLines = (at: number, page: 'ea' | 'eb', from: number, to: number, gap: number): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `${page}-${from + index}`,
		dur: Math.max(200, gap),
	}));

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/** Sends a query card down the pipe: out of the code, through the `Connection`, into the engine. */
const descend = (at: number, el: string, gap = 650): MotionCue[] => [
	{ at, do: 'move', el, to: 'a-port', dur: gap },
	{ at: at + gap, do: 'move', el, to: 'a-conn', dur: gap },
	{ at: at + gap * 2, do: 'move', el, to: 'a-engine', dur: gap },
];

/** Moves the execution particle and the editor bar together. */
const run = (at: number, anchor: string, line: number, dur = 700): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: anchor, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 600) },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const connect = timed(
	say(
		'`DriverManager` abre una `Connection` entre tu código y la base.',
		'`DriverManager` opens a `Connection` between your code and the database.',
	),
	say(
		'`Connection` es una interfaz de `java.sql`; el driver la implementa.',
		'`Connection` is a `java.sql` interface; the driver implements it.',
	),
	say(
		'El `try-with-resources` la cierra: si no, es un recurso perdido.',
		'The `try-with-resources` closes it; otherwise it is a lost resource.',
	),
);
const inject = timed(
	say(
		'El error clásico: el `email` que escribió el usuario se concatena en el SQL.',
		'The classic mistake: the `email` the user typed is concatenated into the SQL.',
	),
	say(
		"La base recibe `WHERE email = '' OR '1'='1'`, siempre verdadero.",
		"The database receives `WHERE email = '' OR '1'='1'`, always true.",
	),
	say(
		'El dato se volvió código: devuelve todos los usuarios. Eso es inyección SQL.',
		'The data became code: it returns every user. That is SQL injection.',
	),
);
const template = timed(
	say(
		'Con `PreparedStatement`, primero viaja solo la plantilla, con un `?` donde irá el valor.',
		'With `PreparedStatement`, only the template travels first, with a `?` for the value.',
	),
	say(
		'La base la compila y fija su estructura: un parámetro, y ya sabe dónde va.',
		'The database compiles it and fixes its structure: one parameter, and where it goes.',
	),
);
const bind = timed(
	say(
		'`setString(1, email)` envía el valor aparte, como dato. Los índices arrancan en 1.',
		'`setString(1, email)` sends the value apart, as data. Indexes start at 1.',
	),
	say(
		"La base busca el email literal `' OR '1'='1` y no encuentra a nadie.",
		"The database looks for the literal email `' OR '1'='1` and finds nobody.",
	),
);
const autocommit = timed(
	say(
		'Una transferencia son dos `UPDATE` que dependen entre sí: debitar $5000 y acreditarlos.',
		'A transfer is two dependent `UPDATE`s: debit $5000, then credit it.',
	),
	say(
		'Con autocommit, el débito se confirma al instante. Luego se corta la red y el crédito falla.',
		'With autocommit, the debit is confirmed at once. Then the network drops and the credit fails.',
	),
	say(
		'El dinero salió de una cuenta y no llegó a la otra.',
		'The money left one account and never reached the other.',
	),
);
const rollback = timed(
	say(
		'Mismos saldos, con `setAutoCommit(false)`: los dos `UPDATE` quedan pendientes.',
		'Same balances, with `setAutoCommit(false)`: both `UPDATE`s stay pending.',
	),
	say(
		'Falla el crédito otra vez. El `catch` llama a `rollback()` y la base deshace todo.',
		'The credit fails again. The `catch` calls `rollback()` and the database undoes everything.',
	),
);
const commit = timed(
	say(
		'En otra ejecución, el débito y el crédito llegan bien a la base.',
		'In another run, both the debit and the credit reach the database.',
	),
	say(
		'Solo entonces `commit()` confirma las dos juntas: $15000 y $8000.',
		'Only then does `commit()` confirm both together: $15000 and $8000.',
	),
	say(
		'El `finally` restaura `setAutoCommit(true)`: la conexión queda como la encontramos.',
		'The `finally` restores `setAutoCommit(true)`: the connection is left as we found it.',
	),
);
const recap = timed(
	say(
		'JDBC conecta, y `PreparedStatement` con `?` fija la estructura antes de que el dato exista.',
		'JDBC connects, and `PreparedStatement` with `?` fixes the structure before the data exists.',
	),
	say(
		'Una transacción es todo o nada: o pasan las dos cosas, o ninguna.',
		'A transaction is all or nothing: either both things happen, or neither.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'bridge', label: { es: 'El puente JDBC', en: 'The JDBC bridge' } },
		{ id: 'injection', label: { es: 'Inyección SQL', en: 'SQL injection' } },
		{ id: 'prepared', label: { es: 'PreparedStatement', en: 'PreparedStatement' } },
		{ id: 'autocommit', label: { es: 'Autocommit', en: 'Autocommit' } },
		{ id: 'transaction', label: { es: 'Commit y rollback', en: 'Commit and rollback' } },
		{ id: 'recap', label: { es: 'Todo el viaje', en: 'The whole journey' } },
	],
	steps: [
		// ─── Scene 1. The JDBC bridge ───────────────────────────────────────
		{
			id: 'connect',
			chapter: 'bridge',
			scene: 'journey',
			title: { es: 'Una Connection entre el código y la base', en: 'A Connection between code and database' },
			subtitles: connect.list,
			motion: {
				cues: seq(
					shot(0, 'shot-tower', 4000),
					{ at: 200, do: 'enter', el: 'floor-app' },
					...typeLines(300, 'ea', 1, 5, 260),
					{ at: 700, do: 'enter', el: 'floor-db' },
					{ at: 1100, do: 'enter', el: 'floor-jdbc' },
					{ at: 1500, do: 'enter', el: 'm-conn' },
					{ at: 1600, do: 'enter', el: 'm-sql' },
					{ at: 1700, do: 'enter', el: 'm-exec' },
					{ at: 1800, do: 'enter', el: 'm-prep' },
					{ at: 1900, do: 'enter', el: 'm-set' },
					{ at: 2000, do: 'enter', el: 'm-query' },
					{ at: 2100, do: 'draw', el: 'tr-a', dur: 900 },
					{ at: 2400, do: 'enter', el: 'hl' },
					{ at: 2600, do: 'enter', el: 'p' },
					{ at: 3000, do: 'enter', el: 'connm-on' },
					{ at: 3200, do: 'pulse', el: 'm-conn' },
					{ at: connect.start(1) + 200, do: 'draw', el: 'tr-pipe', dur: 1200 },
					{ at: connect.start(1) + 900, do: 'enter', el: 'conn-on' },
					{ at: connect.start(1) + 1200, do: 'enter', el: 'lb-conn' },
					{ at: connect.start(1) + 2200, do: 'enter', el: 'lb-driver' },
					{ at: connect.start(1) + 2800, do: 'pulse', el: 'conn-on' },
					{ at: connect.start(1) + 3300, do: 'draw', el: 'tr-users', dur: 700 },
					{ at: connect.start(2) + 300, do: 'enter', el: 'lb-twr' },
					{ at: connect.start(2) + 1200, do: 'pulse', el: 'lb-twr' },
					{ at: connect.start(2) + 2000, do: 'pulse', el: 'connm-on' },
				),
			},
		},

		// ─── Scene 2. SQL injection ─────────────────────────────────────────
		{
			id: 'inject',
			chapter: 'injection',
			scene: 'journey',
			title: { es: 'Concatenar: el dato se vuelve código', en: 'Concatenating: data becomes code' },
			subtitles: inject.list,
			motion: {
				cues: seq(
					shot(0, 'shot-app', 2200),
					...clear(100, 'lb-twr', 'connm-on', 'lb-conn', 'lb-driver'),
					...typeLines(300, 'ea', 6, 10, 220),
					...run(1300, 'a-sql', 8),
					{ at: 2100, do: 'enter', el: 'sql-on' },
					{ at: 2200, do: 'enter', el: 'hxa-8' },
					{ at: 2700, do: 'enter', el: 'q-bad' },
					{ at: 3300, do: 'pulse', el: 'q-bad' },
					...run(inject.start(1), 'a-exec', 10),
					{ at: inject.start(1) + 700, do: 'enter', el: 'exec-on' },
					shot(inject.start(1) + 800, 'shot-tower', 2000),
					{ at: inject.start(1) + 900, do: 'draw', el: 'fl-bad', dur: 1900 },
					...descend(inject.start(1) + 900, 'q-bad'),
					{ at: inject.start(1) + 2900, do: 'move', el: 'q-bad', to: 'a-users', dur: 700 },
					{ at: inject.start(2) + 100, do: 'exit', el: 'q-bad', dur: 300 },
					{ at: inject.start(2) + 300, do: 'enter', el: 'rows-bad' },
					{ at: inject.start(2) + 800, do: 'enter', el: 'res-all' },
					{ at: inject.start(2) + 1300, do: 'flow', el: 'fl-bad' },
					{ at: inject.start(2) + 1800, do: 'pulse', el: 'rows-bad' },
					{ at: inject.start(2) + 2800, do: 'pulse', el: 'res-all' },
				),
			},
		},

		// ─── Scene 3. PreparedStatement ─────────────────────────────────────
		{
			id: 'template',
			chapter: 'prepared',
			scene: 'journey',
			title: { es: 'Primero viaja la plantilla', en: 'The template travels first' },
			subtitles: template.list,
			motion: {
				cues: seq(
					...clear(0, 'fl-bad', 'rows-bad', 'res-all', 'hxa-8', 'sql-on', 'exec-on'),
					shot(0, 'shot-app', 2000),
					...typeLines(300, 'ea', 11, 13, 260),
					...run(900, 'a-prep', 12),
					{ at: 1600, do: 'enter', el: 'prep-on' },
					{ at: 1700, do: 'enter', el: 'hva-13' },
					{ at: 2100, do: 'enter', el: 'q-tpl' },
					{ at: 2600, do: 'pulse', el: 'q-tpl' },
					shot(3000, 'shot-mid', 2000),
					{ at: 3100, do: 'draw', el: 'fl-tpl', dur: 1900 },
					...descend(3100, 'q-tpl'),
					{ at: template.start(1) + 300, do: 'exit', el: 'q-tpl', dur: 300 },
					{ at: template.start(1) + 400, do: 'enter', el: 'engine-on' },
					{ at: template.start(1) + 700, do: 'enter', el: 'plan' },
					{ at: template.start(1) + 1500, do: 'pulse', el: 'plan' },
					{ at: template.start(1) + 2300, do: 'pulse', el: 'engine-on' },
				),
			},
		},
		{
			id: 'bind',
			chapter: 'prepared',
			scene: 'journey',
			title: { es: 'El valor viaja aparte, como dato', en: 'The value travels apart, as data' },
			subtitles: bind.list,
			motion: {
				cues: seq(
					...clear(0, 'fl-tpl'),
					shot(0, 'shot-app', 1800),
					...typeLines(200, 'ea', 14, 18, 200),
					...run(600, 'a-set', 14),
					{ at: 1300, do: 'enter', el: 'set-on' },
					{ at: 1600, do: 'enter', el: 'q-val' },
					{ at: 2200, do: 'pulse', el: 'q-val' },
					shot(2700, 'shot-mid', 1800),
					{ at: 2800, do: 'draw', el: 'fl-val', dur: 1700 },
					...descend(2800, 'q-val', 600),
					...run(bind.start(1), 'a-query', 15),
					{ at: bind.start(1) + 600, do: 'enter', el: 'query-on' },
					{ at: bind.start(1) + 700, do: 'move', el: 'q-val', to: 'a-users', dur: 800 },
					{ at: bind.start(1) + 1600, do: 'exit', el: 'q-val', dur: 300 },
					{ at: bind.start(1) + 1800, do: 'enter', el: 'res-none' },
					{ at: bind.start(1) + 2600, do: 'pulse', el: 'res-none' },
					{ at: bind.start(1) + 2800, do: 'move', el: 'hl', to: 'ln-16', dur: 400 },
					{ at: bind.start(1) + 3200, do: 'type', el: 'out-a', dur: 600 },
					{ at: bind.start(1) + 3500, do: 'flow', el: 'fl-val' },
					{ at: bind.start(1) + 3900, do: 'pulse', el: 'plan' },
				),
			},
		},

		// ─── Scene 4. Autocommit ────────────────────────────────────────────
		{
			id: 'autocommit',
			chapter: 'autocommit',
			scene: 'journey',
			title: { es: 'Autocommit: cada sentencia sola', en: 'Autocommit: each statement alone' },
			subtitles: autocommit.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'ea', 'out-a', 'res-none', 'plan', 'engine-on', 'hva-13', 'fl-val'),
					...clear(0, 'prep-on', 'set-on', 'query-on'),
					shot(0, 'shot-db', 2400),
					...run(100, 'a-deb', 5, 1),
					{ at: 500, do: 'enter', el: 'eb' },
					{ at: 600, do: 'type', el: 'eb-1', dur: 400 },
					{ at: 1000, do: 'type', el: 'eb-5', dur: 400 },
					{ at: 1400, do: 'type', el: 'eb-6', dur: 400 },
					{ at: 800, do: 'enter', el: 'accounts' },
					{ at: 1100, do: 'draw', el: 'tr-acc', dur: 800 },
					{ at: 1300, do: 'enter', el: 'sa-0' },
					{ at: 1500, do: 'enter', el: 'sb-0' },
					{ at: 1700, do: 'enter', el: 'm-deb' },
					{ at: 1800, do: 'enter', el: 'm-acr' },
					{ at: 1900, do: 'draw', el: 'tr-b', dur: 800 },
					{ at: 2300, do: 'enter', el: 'hl' },
					{ at: 2400, do: 'enter', el: 'p' },
					{ at: autocommit.start(1), do: 'enter', el: 'deb-on' },
					{ at: autocommit.start(1) + 100, do: 'enter', el: 'q-deb' },
					{ at: autocommit.start(1) + 400, do: 'draw', el: 'fl-tx', dur: 1500 },
					...descend(autocommit.start(1) + 400, 'q-deb', 500),
					{ at: autocommit.start(1) + 1900, do: 'move', el: 'q-deb', to: 'a-acc-a', dur: 500 },
					{ at: autocommit.start(1) + 2400, do: 'exit', el: 'q-deb', dur: 300 },
					{ at: autocommit.start(1) + 2400, do: 'exit', el: 'sa-0', dur: 300 },
					{ at: autocommit.start(1) + 2700, do: 'enter', el: 'sa-auto' },
					{ at: autocommit.start(1) + 2800, do: 'enter', el: 'lb-auto' },
					...run(autocommit.start(1) + 3300, 'a-acr', 6),
					{ at: autocommit.start(1) + 4000, do: 'enter', el: 'acr-bad' },
					{ at: autocommit.start(1) + 4000, do: 'enter', el: 'hxb-6' },
					{ at: autocommit.start(1) + 4100, do: 'enter', el: 'q-acr' },
					{ at: autocommit.start(1) + 4400, do: 'move', el: 'q-acr', to: 'a-port', dur: 500 },
					{ at: autocommit.start(1) + 4900, do: 'move', el: 'q-acr', to: 'a-conn', dur: 500 },
					{ at: autocommit.start(1) + 5400, do: 'move', el: 'q-acr', to: 'a-cut', dur: 500 },
					{ at: autocommit.start(1) + 5900, do: 'enter', el: 'cut' },
					{ at: autocommit.start(2) + 100, do: 'exit', el: 'q-acr', dur: 300 },
					{ at: autocommit.start(2) + 200, do: 'exit', el: 'lb-auto', dur: 300 },
					{ at: autocommit.start(2) + 500, do: 'enter', el: 'acc-a-bad' },
					{ at: autocommit.start(2) + 700, do: 'enter', el: 'lb-evap' },
					{ at: autocommit.start(2) + 1500, do: 'pulse', el: 'lb-evap' },
					{ at: autocommit.start(2) + 2300, do: 'pulse', el: 'sb-0' },
				),
			},
		},

		// ─── Scene 5. Commit and rollback ───────────────────────────────────
		{
			id: 'rollback',
			chapter: 'transaction',
			scene: 'journey',
			title: { es: 'rollback() deshace todo', en: 'rollback() undoes everything' },
			subtitles: rollback.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'cut', 'lb-evap', 'acc-a-bad', 'sa-auto', 'hxb-6', 'acr-bad', 'deb-on', 'fl-tx'),
					shot(0, 'shot-db', 1500),
					{ at: 300, do: 'enter', el: 'sa-0' },
					{ at: 300, do: 'move', el: 'q-deb', to: 'a-qdeb', dur: 1 },
					{ at: 300, do: 'move', el: 'q-acr', to: 'a-qacr', dur: 1 },
					...run(300, 'a-auto', 3, 1),
					...typeLines(400, 'eb', 2, 4, 160),
					...typeLines(900, 'eb', 7, 16, 120),
					{ at: 500, do: 'enter', el: 'm-auto' },
					{ at: 600, do: 'enter', el: 'm-commit' },
					{ at: 700, do: 'enter', el: 'm-rb' },
					{ at: 800, do: 'enter', el: 'm-fin' },
					{ at: 1000, do: 'enter', el: 'p' },
					{ at: 1000, do: 'enter', el: 'hl' },
					{ at: 1300, do: 'enter', el: 'auto-on' },
					{ at: 1500, do: 'enter', el: 'tx-box' },
					{ at: 1800, do: 'enter', el: 'lb-tx' },
					...run(2300, 'a-deb', 5),
					{ at: 3000, do: 'enter', el: 'deb-on' },
					{ at: 3000, do: 'enter', el: 'q-deb' },
					...descend(3200, 'q-deb', 450),
					{ at: 4550, do: 'move', el: 'q-deb', to: 'a-acc-a', dur: 450 },
					{ at: 5000, do: 'exit', el: 'q-deb', dur: 300 },
					{ at: 5000, do: 'exit', el: 'sa-0', dur: 300 },
					{ at: 5300, do: 'enter', el: 'sa-pend' },
					...run(rollback.start(1), 'a-acr', 6),
					{ at: rollback.start(1) + 700, do: 'enter', el: 'acr-bad' },
					{ at: rollback.start(1) + 700, do: 'enter', el: 'q-acr' },
					{ at: rollback.start(1) + 900, do: 'move', el: 'q-acr', to: 'a-port', dur: 450 },
					{ at: rollback.start(1) + 1350, do: 'move', el: 'q-acr', to: 'a-conn', dur: 450 },
					{ at: rollback.start(1) + 1800, do: 'move', el: 'q-acr', to: 'a-cut', dur: 450 },
					{ at: rollback.start(1) + 2250, do: 'enter', el: 'cut' },
					{ at: rollback.start(1) + 2500, do: 'exit', el: 'q-acr', dur: 300 },
					...run(rollback.start(1) + 2700, 'a-rb', 11),
					{ at: rollback.start(1) + 3400, do: 'enter', el: 'rb-on' },
					{ at: rollback.start(1) + 3400, do: 'enter', el: 'hvb-11' },
					{ at: rollback.start(1) + 3500, do: 'draw', el: 'fl-rb', dur: 1200 },
					{ at: rollback.start(1) + 4700, do: 'exit', el: 'sa-pend', dur: 300 },
					{ at: rollback.start(1) + 5000, do: 'enter', el: 'sa-0' },
					{ at: rollback.start(1) + 5200, do: 'enter', el: 'lb-rb' },
					{ at: rollback.start(1) + 5800, do: 'pulse', el: 'accounts' },
				),
			},
		},
		{
			id: 'commit',
			chapter: 'transaction',
			scene: 'journey',
			title: { es: 'commit() confirma las dos juntas', en: 'commit() confirms both together' },
			subtitles: commit.list,
			motion: {
				cues: seq(
					...clear(0, 'cut', 'acr-bad', 'lb-rb', 'hvb-11', 'rb-on', 'fl-rb', 'deb-on'),
					{ at: 100, do: 'move', el: 'q-deb', to: 'a-qdeb', dur: 1 },
					{ at: 100, do: 'move', el: 'q-acr', to: 'a-qacr', dur: 1 },
					...run(200, 'a-deb', 5),
					{ at: 700, do: 'enter', el: 'deb-on' },
					{ at: 700, do: 'enter', el: 'q-deb' },
					...descend(800, 'q-deb', 350),
					{ at: 1850, do: 'move', el: 'q-deb', to: 'a-acc-a', dur: 350 },
					{ at: 2200, do: 'exit', el: 'q-deb', dur: 300 },
					{ at: 2200, do: 'exit', el: 'sa-0', dur: 300 },
					{ at: 2400, do: 'enter', el: 'sa-pend' },
					...run(2400, 'a-acr', 6, 600),
					{ at: 3000, do: 'enter', el: 'acr-on' },
					{ at: 3000, do: 'enter', el: 'q-acr' },
					...descend(3100, 'q-acr', 350),
					{ at: 4150, do: 'move', el: 'q-acr', to: 'a-acc-b', dur: 350 },
					{ at: 4500, do: 'exit', el: 'q-acr', dur: 300 },
					{ at: 4500, do: 'exit', el: 'sb-0', dur: 300 },
					{ at: 4700, do: 'enter', el: 'sb-pend' },
					...run(commit.start(1), 'a-commit', 8),
					{ at: commit.start(1) + 700, do: 'enter', el: 'commit-on' },
					{ at: commit.start(1) + 700, do: 'enter', el: 'hvb-8' },
					{ at: commit.start(1) + 800, do: 'draw', el: 'fl-commit', dur: 1200 },
					{ at: commit.start(1) + 2000, do: 'exit', el: 'sa-pend', dur: 300 },
					{ at: commit.start(1) + 2000, do: 'exit', el: 'sb-pend', dur: 300 },
					{ at: commit.start(1) + 2300, do: 'enter', el: 'sa-ok' },
					{ at: commit.start(1) + 2400, do: 'enter', el: 'sb-ok' },
					{ at: commit.start(1) + 2500, do: 'enter', el: 'acc-a-on' },
					{ at: commit.start(1) + 2500, do: 'enter', el: 'acc-b-on' },
					{ at: commit.start(1) + 2800, do: 'exit', el: 'lb-tx', dur: 300 },
					{ at: commit.start(1) + 3100, do: 'enter', el: 'lb-commit' },
					shot(commit.start(2), 'shot-mid', 1800),
					...run(commit.start(2) + 100, 'a-fin', 14),
					{ at: commit.start(2) + 800, do: 'enter', el: 'fin-on' },
					{ at: commit.start(2) + 1000, do: 'exit', el: 'tx-box', dur: 500 },
					{ at: commit.start(2) + 1000, do: 'exit', el: 'auto-on', dur: 400 },
					{ at: commit.start(2) + 1300, do: 'enter', el: 'lb-reset' },
					{ at: commit.start(2) + 2000, do: 'pulse', el: 'conn-on' },
					{ at: commit.start(2) + 2600, do: 'pulse', el: 'lb-reset' },
				),
			},
		},

		// ─── Scene 6. The whole journey ─────────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Puente, parámetros y transacción', en: 'Bridge, parameters and transaction' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'lb-reset', 'fin-on', 'commit-on', 'hvb-8', 'acr-on', 'deb-on', 'fl-commit', 'lb-commit'),
					shot(200, 'shot-all', 3000),
					{ at: 800, do: 'enter', el: 'fl-tpl' },
					{ at: 1200, do: 'flow', el: 'fl-tpl' },
					{ at: 1400, do: 'enter', el: 'r-bridge' },
					{ at: 2000, do: 'pulse', el: 'conn-on' },
					{ at: 3200, do: 'enter', el: 'r-param' },
					{ at: 3500, do: 'enter', el: 'engine-on' },
					{ at: 4200, do: 'pulse', el: 'engine-on' },
					{ at: 4800, do: 'pulse', el: 'r-param' },
					{ at: recap.start(1) + 300, do: 'enter', el: 'r-tx' },
					{ at: recap.start(1) + 900, do: 'pulse', el: 'acc-a-on' },
					{ at: recap.start(1) + 1300, do: 'pulse', el: 'acc-b-on' },
					{ at: recap.start(1) + 2000, do: 'pulse', el: 'r-tx' },
				),
			},
		},
	],
};
