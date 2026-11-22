import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a commit to GitHub and back": a short film (about two minutes)
// for the Git lesson "Bajar y subir cambios" (order: 4). It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/sincronizacion-remota-git.astro`): three isometric
// platforms, Ana's computer, the remote on GitHub (`origin`) and Beto's computer.
// The editor is the terminal session of the lesson. A commit is always the same
// rounded node with its short hash, and a copy of it travels the pipes on every
// push, clone, fetch and pull. Magenta marks the problem (the rejected push);
// violet marks what resolves it (the merge commit that `git pull` creates).

/** A caption; `hold` keeps it on screen longer when its cues need the time. */
type Line = { sub: Subtitle; hold: number };
const say = (es: string, en: string, hold = 0): Line => ({ sub: { text: { es, en } }, hold });

/**
 * Pins captions on the step timeline: each one starts once the previous has been
 * read (same formula as `subtitleReadingTime`, for the slower locale) plus a pause.
 * Cues are placed relative to those starts to stay in sync with what is being said.
 */
const readingMs = (sub: Subtitle) => 1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;
function timed(...lines: Line[]) {
	let at = 0;
	const starts: number[] = [];
	const list = lines.map(({ sub, hold }) => {
		starts.push(at);
		const placed: Subtitle = { ...sub, at };
		at += readingMs(sub) + 200 + hold;
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

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/**
 * Runs editor line `n`: the command is typed, the bar slides onto it, the execution
 * particle flies to its module and the module lights up.
 */
const exec = (at: number, n: number): MotionCue[] => [
	{ at, do: 'type', el: `e-${n}`, dur: 500 },
	{ at: at + 300, do: 'move', el: 'hl', to: `ln-${n}`, dur: 400 },
	{ at: at + 300, do: 'move', el: 'p', to: `a-m-${n}`, dur: 800 },
	{ at: at + 1000, do: 'enter', el: `on-${n}`, dur: 400 },
];

/** Types the `rows` output lines of editor line `n`, one after the other. */
const out = (at: number, n: number, rows: number, gap = 380): MotionCue[] =>
	Array.from({ length: rows }, (_, row) => ({ at: at + row * gap, do: 'type' as const, el: `o-${n}-${row}`, dur: 450 }));

/** Ids of the output lines of editor line `n`. */
const outs = (n: number, rows: number) => Array.from({ length: rows }, (_, row) => `o-${n}-${row}`);

/** Sends a commit copy along a pipe, one stop after the other. */
const travel = (at: number, el: string, stops: string[], gap: number): MotionCue[] =>
	stops.map((to, index) => ({ at: at + index * gap, do: 'move' as const, el, to, dur: gap }));

// ─── Captions ───────────────────────────────────────────────────────────────
const push = timed(
	say('Ana tiene un commit. En GitHub crea `mi-proyecto`, vacío.', 'Ana has one commit. On GitHub she creates an empty `my-project`.'),
	say('`git remote add` registra el remoto con el alias `origin`.', '`git remote add` registers the remote under the alias `origin`.'),
	say(
		'`git push -u origin main` lo sube y deja `main` siguiendo a `origin/main`.',
		'`git push -u origin main` uploads it; `main` now tracks `origin/main`.',
	),
);
const clone = timed(
	say('Beto usa `git clone`: descarga el repositorio con todo su historial.', 'Bob uses `git clone`: it downloads the repository with all its history.'),
	say('El clon ya trae `origin`, y su `main` ya sigue a `origin/main`.', 'The clone already has `origin`; its `main` already tracks `origin/main`.'),
);
const stale = timed(
	say(
		'Beto agrega `tareas.txt`, hace commit y lo sube: GitHub avanza.',
		'Bob adds `tasks.txt`, commits and pushes: GitHub moves forward.',
		1000,
	),
	say('Ana ejecuta `git status` y le dice que está al día.', 'Ana runs `git status`, and it says she is up to date.'),
	say(
		'Compara con `origin/main`: la foto de la última vez que habló con GitHub.',
		'It compares with `origin/main`: the snapshot from her last talk with GitHub.',
	),
);
const fetch = timed(
	say('`git fetch` descarga el commit nuevo y solo mueve `origin/main`.', '`git fetch` downloads the new commit and only moves `origin/main`.', 200),
	say(
		'`main` y los archivos no cambian. `git status` ahora dice: atrás por 1 commit.',
		'`main` and the files do not change. `git status` now says: behind by 1 commit.',
	),
);
const pull = timed(
	say('`git pull` hace un `git fetch` y un merge de `origin/main` en `main`.', '`git pull` runs a `git fetch`, then merges `origin/main` into `main`.'),
	say('Ana no tenía commits propios: es un fast-forward, `main` solo avanza.', 'Ana had no commits of her own: a fast-forward, `main` just moves ahead.'),
	say('Luego agrega una tarea, hace commit y la sube con `git push`.', 'Then she adds a task, commits and pushes it with `git push`.'),
);
const rejected = timed(
	say('Mientras tanto, Beto cambia el README sin traer ese trabajo.', 'Meanwhile, Bob changes the README without bringing in that work.'),
	say('GitHub rechaza su push: el remoto tiene trabajo que Beto no tiene.', 'GitHub rejects his push: the remote has work that Bob does not have.'),
	say(
		'Un push solo adelanta la rama remota: aceptarlo borraría el commit de Ana.',
		"A push only moves the remote forward: accepting it would erase Ana's commit.",
	),
);
const merge = timed(
	say('Beto configura `pull.rebase false`: al divergir, Git integra con un merge.', 'Bob sets `pull.rebase false`: when branches diverge, Git merges.'),
	say('`git pull` trae el commit de Ana y crea un merge commit con dos padres.', "`git pull` brings in Ana's commit and creates a merge commit with two parents."),
	say('Ahora el `main` de Beto contiene todo lo del remoto.', "Now Bob's `main` contains everything on the remote."),
);
const recap = timed(
	say('Ahora su push es un fast-forward y GitHub lo acepta: no se pierde nada.', 'Now his push is a fast-forward and GitHub accepts it: nothing is lost.'),
	say('`push` sube, `fetch` solo mira, `pull` trae e integra.', '`push` uploads, `fetch` only looks, `pull` integrates.'),
	say('Si un push es rechazado: primero `git pull`, después `git push`.', 'If a push is rejected: `git pull` first, then `git push`.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'remote', label: { es: 'El remoto origin', en: 'The origin remote' } },
		{ id: 'clone', label: { es: 'Clonar', en: 'Cloning' } },
		{ id: 'fetch', label: { es: 'Mirar con fetch', en: 'Looking with fetch' } },
		{ id: 'pull', label: { es: 'Integrar con pull', en: 'Integrating with pull' } },
		{ id: 'rejected', label: { es: 'Push rechazado', en: 'Rejected push' } },
		{ id: 'fix', label: { es: 'Pull y después push', en: 'Pull, then push' } },
	],
	steps: [
		// ─── Scene 1. The origin remote ─────────────────────────────────────
		{
			id: 'push',
			chapter: 'remote',
			scene: 'journey',
			title: { es: 'El primer push', en: 'The first push' },
			subtitles: push.list,
			motion: {
				cues: seq(
					shot(0, 'shot-ana', 2400),
					{ at: 200, do: 'enter', el: 'floor-ana' },
					{ at: 500, do: 'enter', el: 'lb-ana' },
					{ at: 800, do: 'enter', el: 'ana-c1' },
					{ at: 1100, do: 'enter', el: 'ana-main' },
					shot(2000, 'shot-ana-rem', 2200),
					{ at: 2200, do: 'enter', el: 'floor-rem' },
					{ at: 2600, do: 'enter', el: 'lb-rem' },
					{ at: push.start(1) - 300, do: 'enter', el: 'hl' },
					{ at: push.start(1) - 200, do: 'enter', el: 'p' },
					...exec(push.start(1), 1),
					{ at: push.start(1) + 1200, do: 'draw', el: 'tr-ana', dur: 900 },
					{ at: push.start(1) + 1800, do: 'enter', el: 'ch-origin' },
					{ at: push.start(1) + 2800, do: 'pulse', el: 'ch-origin' },
					...clear(push.start(2), 'ch-origin', 'on-1'),
					...exec(push.start(2), 2),
					{ at: push.start(2) + 1000, do: 'enter', el: 'pk-push1' },
					{ at: push.start(2) + 1300, do: 'draw', el: 'fl-ana-up', dur: 1500 },
					...travel(push.start(2) + 1300, 'pk-push1', ['a-port-ana', 'a-port-rem-a', 'a-rem-c1'], 500),
					...out(push.start(2) + 1100, 2, 3),
					{ at: push.start(2) + 2800, do: 'exit', el: 'pk-push1', dur: 300 },
					{ at: push.start(2) + 2800, do: 'enter', el: 'rem-c1' },
					{ at: push.start(2) + 3100, do: 'enter', el: 'rem-main' },
					{ at: push.start(2) + 3600, do: 'enter', el: 'ana-origin' },
					{ at: push.start(2) + 4000, do: 'enter', el: 'ch-track' },
				),
			},
		},

		// ─── Scene 2. Cloning ───────────────────────────────────────────────
		{
			id: 'clone',
			chapter: 'clone',
			scene: 'journey',
			title: { es: 'Beto clona el repositorio', en: 'Bob clones the repository' },
			subtitles: clone.list,
			motion: {
				cues: seq(
					...clear(0, 'ch-track', 'fl-ana-up', 'on-2', ...outs(2, 3)),
					shot(0, 'shot-beto-rem', 2600),
					{ at: 300, do: 'enter', el: 'floor-beto' },
					{ at: 600, do: 'enter', el: 'lb-beto' },
					{ at: 900, do: 'draw', el: 'tr-beto', dur: 900 },
					...exec(1200, 3),
					...out(2200, 3, 1),
					{ at: 2300, do: 'enter', el: 'pk-clone' },
					{ at: 2500, do: 'draw', el: 'fl-beto-down', dur: 1500 },
					...travel(2500, 'pk-clone', ['a-port-rem-b', 'a-port-beto', 'a-beto-c1'], 600),
					{ at: 4300, do: 'exit', el: 'pk-clone', dur: 300 },
					{ at: 4300, do: 'enter', el: 'beto-c1' },
					{ at: 4600, do: 'enter', el: 'ch-clone' },
					{ at: 5300, do: 'pulse', el: 'ch-clone' },
					{ at: clone.start(1) + 200, do: 'enter', el: 'beto-main' },
					{ at: clone.start(1) + 700, do: 'enter', el: 'beto-origin' },
					{ at: clone.start(1) + 1500, do: 'pulse', el: 'beto-origin' },
					{ at: clone.start(1) + 2200, do: 'pulse', el: 'beto-main' },
				),
			},
		},

		// ─── Scene 3. Looking with fetch ────────────────────────────────────
		{
			id: 'stale',
			chapter: 'fetch',
			scene: 'journey',
			title: { es: 'origin/main es una foto', en: 'origin/main is a snapshot' },
			subtitles: stale.list,
			motion: {
				cues: seq(
					...clear(0, 'ch-clone', 'fl-beto-down', 'on-3', ...outs(3, 1)),
					shot(0, 'shot-beto', 1800),
					...exec(200, 4),
					...exec(900, 5),
					...clear(1900, 'on-4'),
					{ at: 1700, do: 'draw', el: 'lk-beto-12', dur: 500 },
					{ at: 1900, do: 'enter', el: 'beto-c2' },
					{ at: 2100, do: 'move', el: 'beto-main', to: 's-beto-m1', dur: 700 },
					...out(2000, 5, 2),
					...exec(2700, 6),
					...clear(2900, ...outs(5, 2)),
					...clear(3700, 'on-5'),
					shot(2800, 'shot-beto-rem', 1600),
					{ at: 3300, do: 'enter', el: 'pk-push2' },
					{ at: 3500, do: 'draw', el: 'fl-beto-up', dur: 1200 },
					...travel(3500, 'pk-push2', ['a-port-beto', 'a-port-rem-b', 'a-rem-c2'], 500),
					...out(3700, 6, 2),
					{ at: 4800, do: 'draw', el: 'lk-rem-12', dur: 400 },
					{ at: 5000, do: 'exit', el: 'pk-push2', dur: 300 },
					{ at: 5000, do: 'enter', el: 'rem-c2' },
					{ at: 5100, do: 'move', el: 'rem-main', to: 's-rem-m1', dur: 600 },
					{ at: 5200, do: 'move', el: 'beto-origin', to: 's-beto-o1', dur: 600 },
					...clear(stale.start(1), 'on-6', 'fl-beto-up', ...outs(6, 2)),
					shot(stale.start(1), 'shot-ana-rem', 2000),
					...exec(stale.start(1) + 800, 7),
					...out(stale.start(1) + 1900, 7, 2),
					{ at: stale.start(1) + 2600, do: 'enter', el: 'ch-uptodate' },
					{ at: stale.start(1) + 3200, do: 'pulse', el: 'ana-main' },
					{ at: stale.start(2) + 300, do: 'enter', el: 'ch-stale' },
					{ at: stale.start(2) + 1000, do: 'pulse', el: 'ana-origin' },
					{ at: stale.start(2) + 1800, do: 'pulse', el: 'rem-main' },
					{ at: stale.start(2) + 2600, do: 'pulse', el: 'ch-stale' },
				),
			},
		},
		{
			id: 'fetch',
			chapter: 'fetch',
			scene: 'journey',
			title: { es: 'fetch solo mueve origin/main', en: 'fetch only moves origin/main' },
			subtitles: fetch.list,
			motion: {
				cues: seq(
					...clear(0, 'ch-uptodate', 'ch-stale', 'on-7', ...outs(7, 2)),
					...exec(300, 8),
					{ at: 1100, do: 'enter', el: 'pk-fetch' },
					{ at: 1300, do: 'draw', el: 'fl-ana-down', dur: 1500 },
					...travel(1300, 'pk-fetch', ['a-port-rem-a', 'a-port-ana', 'a-ana-c2'], 600),
					...out(1400, 8, 2),
					{ at: 2900, do: 'draw', el: 'lk-ana-12', dur: 400 },
					{ at: 3100, do: 'exit', el: 'pk-fetch', dur: 300 },
					{ at: 3100, do: 'enter', el: 'ana-c2' },
					{ at: 3400, do: 'move', el: 'ana-origin', to: 's-ana-o1', dur: 700 },
					shot(fetch.start(1), 'shot-ana', 1800),
					{ at: fetch.start(1) + 200, do: 'enter', el: 'ch-files' },
					{ at: fetch.start(1) + 800, do: 'pulse', el: 'ana-main' },
					...clear(fetch.start(1) + 2000, 'on-8', 'fl-ana-down', ...outs(8, 2)),
					...exec(fetch.start(1) + 2000, 9),
					...out(fetch.start(1) + 3000, 9, 3),
					{ at: fetch.start(1) + 3800, do: 'enter', el: 'ch-behind' },
					{ at: fetch.start(1) + 4500, do: 'pulse', el: 'ch-behind' },
				),
			},
		},

		// ─── Scene 4. Integrating with pull ─────────────────────────────────
		{
			id: 'pull',
			chapter: 'pull',
			scene: 'journey',
			title: { es: 'pull: fetch y merge', en: 'pull: fetch and merge' },
			subtitles: pull.list,
			motion: {
				cues: seq(
					...clear(0, 'ch-files', 'ch-behind', 'on-9', ...outs(9, 3)),
					...exec(300, 10),
					...out(1400, 10, 3),
					{ at: 2200, do: 'pulse', el: 'ana-origin' },
					{ at: pull.start(1) + 300, do: 'move', el: 'ana-main', to: 's-ana-m1', dur: 900 },
					{ at: pull.start(1) + 1200, do: 'enter', el: 'ch-ff' },
					{ at: pull.start(1) + 2000, do: 'pulse', el: 'ana-main' },
					...clear(pull.start(2), 'ch-ff', 'on-10', ...outs(10, 3)),
					...exec(pull.start(2) + 100, 11),
					...exec(pull.start(2) + 900, 12),
					...clear(pull.start(2) + 1900, 'on-11'),
					{ at: pull.start(2) + 1600, do: 'draw', el: 'lk-ana-23', dur: 400 },
					{ at: pull.start(2) + 1800, do: 'enter', el: 'ana-c3' },
					{ at: pull.start(2) + 2000, do: 'move', el: 'ana-main', to: 's-ana-m2', dur: 700 },
					...out(pull.start(2) + 1800, 12, 2),
					...exec(pull.start(2) + 2700, 13),
					...clear(pull.start(2) + 2800, ...outs(12, 2)),
					...clear(pull.start(2) + 3700, 'on-12'),
					shot(pull.start(2) + 2700, 'shot-ana-rem', 1600),
					{ at: pull.start(2) + 3100, do: 'enter', el: 'pk-push3' },
					{ at: pull.start(2) + 3300, do: 'draw', el: 'fl-ana-up', dur: 1200 },
					...travel(pull.start(2) + 3300, 'pk-push3', ['a-port-ana', 'a-port-rem-a', 'a-rem-c3'], 450),
					...out(pull.start(2) + 3600, 13, 2),
					{ at: pull.start(2) + 4450, do: 'draw', el: 'lk-rem-23', dur: 400 },
					{ at: pull.start(2) + 4650, do: 'exit', el: 'pk-push3', dur: 300 },
					{ at: pull.start(2) + 4650, do: 'enter', el: 'rem-c3' },
					{ at: pull.start(2) + 4800, do: 'move', el: 'rem-main', to: 's-rem-m2', dur: 700 },
					{ at: pull.start(2) + 5000, do: 'move', el: 'ana-origin', to: 's-ana-o2', dur: 700 },
				),
			},
		},

		// ─── Scene 5. Rejected push ─────────────────────────────────────────
		{
			id: 'rejected',
			chapter: 'rejected',
			scene: 'journey',
			title: { es: 'El remoto avanzó: push rechazado', en: 'The remote moved: push rejected' },
			subtitles: rejected.list,
			motion: {
				cues: seq(
					...clear(0, 'on-13', 'fl-ana-up', ...outs(13, 2)),
					shot(0, 'shot-beto', 2000),
					...exec(400, 14),
					...exec(1400, 15),
					...clear(2400, 'on-14'),
					{ at: 2200, do: 'draw', el: 'lk-beto-2b', dur: 400 },
					{ at: 2400, do: 'enter', el: 'beto-b' },
					{ at: 2600, do: 'move', el: 'beto-main', to: 's-beto-mb', dur: 700 },
					...out(2500, 15, 2),
					...clear(rejected.start(1), 'on-15', ...outs(15, 2)),
					...exec(rejected.start(1), 16),
					shot(rejected.start(1) + 200, 'shot-beto-rem', 1600),
					{ at: rejected.start(1) + 900, do: 'enter', el: 'pk-rej' },
					{ at: rejected.start(1) + 1000, do: 'enter', el: 'hx-16' },
					{ at: rejected.start(1) + 1100, do: 'draw', el: 'fl-rej', dur: 1000 },
					...travel(rejected.start(1) + 1100, 'pk-rej', ['a-port-beto', 'a-port-rem-b'], 500),
					...out(rejected.start(1) + 1400, 16, 4, 350),
					{ at: rejected.start(1) + 2100, do: 'enter', el: 'rem-c3-bad' },
					{ at: rejected.start(1) + 2200, do: 'enter', el: 'ch-rejected' },
					{ at: rejected.start(1) + 2300, do: 'move', el: 'pk-rej', to: 'a-port-beto', dur: 600 },
					{ at: rejected.start(1) + 2900, do: 'exit', el: 'pk-rej', dur: 300 },
					{ at: rejected.start(2) + 300, do: 'enter', el: 'ch-lost' },
					{ at: rejected.start(2) + 1000, do: 'pulse', el: 'rem-c3-bad' },
					{ at: rejected.start(2) + 1800, do: 'pulse', el: 'rem-main' },
					{ at: rejected.start(2) + 2600, do: 'pulse', el: 'ch-lost' },
				),
			},
		},

		// ─── Scene 6. Pull, then push ───────────────────────────────────────
		{
			id: 'merge',
			chapter: 'fix',
			scene: 'journey',
			title: { es: 'pull crea un merge commit', en: 'pull creates a merge commit' },
			subtitles: merge.list,
			motion: {
				cues: seq(
					...clear(0, 'ch-rejected', 'ch-lost', 'rem-c3-bad', 'fl-rej', 'on-16', 'hx-16', ...outs(16, 4)),
					...exec(400, 17),
					{ at: 1500, do: 'enter', el: 'ch-merge' },
					{ at: 2400, do: 'pulse', el: 'ch-merge' },
					...clear(merge.start(1), 'ch-merge', 'on-17'),
					...exec(merge.start(1), 18),
					{ at: merge.start(1) + 800, do: 'enter', el: 'pk-pull' },
					{ at: merge.start(1) + 1000, do: 'draw', el: 'fl-beto-down', dur: 1200 },
					...travel(merge.start(1) + 1000, 'pk-pull', ['a-port-rem-b', 'a-port-beto', 'a-beto-c3'], 500),
					...out(merge.start(1) + 1100, 18, 4, 400),
					{ at: merge.start(1) + 2300, do: 'draw', el: 'lk-beto-23', dur: 400 },
					{ at: merge.start(1) + 2500, do: 'exit', el: 'pk-pull', dur: 300 },
					{ at: merge.start(1) + 2500, do: 'enter', el: 'beto-c3' },
					{ at: merge.start(1) + 2800, do: 'move', el: 'beto-origin', to: 's-beto-o2', dur: 700 },
					shot(merge.start(1) + 3300, 'shot-beto', 1500),
					{ at: merge.start(1) + 3500, do: 'draw', el: 'lk-beto-3m', dur: 400 },
					{ at: merge.start(1) + 3500, do: 'draw', el: 'lk-beto-bm', dur: 400 },
					{ at: merge.start(1) + 3800, do: 'enter', el: 'beto-m' },
					{ at: merge.start(1) + 4100, do: 'move', el: 'beto-main', to: 's-beto-m3', dur: 700 },
					{ at: merge.start(1) + 4500, do: 'enter', el: 'ch-parents' },
					{ at: merge.start(2) + 400, do: 'pulse', el: 'beto-main' },
					{ at: merge.start(2) + 1100, do: 'pulse', el: 'beto-m' },
					{ at: merge.start(2) + 1800, do: 'pulse', el: 'beto-origin' },
					{ at: merge.start(2) + 2500, do: 'pulse', el: 'ch-parents' },
				),
			},
		},
		{
			id: 'recap',
			chapter: 'fix',
			scene: 'journey',
			title: { es: 'El push aceptado y todo el viaje', en: 'The accepted push and the whole journey' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'ch-parents', 'on-18', 'fl-beto-down', ...outs(18, 4)),
					shot(0, 'shot-beto-rem', 1600),
					...exec(300, 19),
					{ at: 1000, do: 'enter', el: 'pk-push4b' },
					{ at: 1200, do: 'enter', el: 'pk-push4m' },
					{ at: 1200, do: 'draw', el: 'fl-merge', dur: 1300 },
					...travel(1200, 'pk-push4b', ['a-port-beto', 'a-port-rem-b', 'a-rem-b'], 550),
					...travel(1500, 'pk-push4m', ['a-port-beto', 'a-port-rem-b', 'a-rem-m'], 550),
					...out(1400, 19, 2),
					{ at: 2650, do: 'draw', el: 'lk-rem-2b', dur: 400 },
					{ at: 2850, do: 'exit', el: 'pk-push4b', dur: 300 },
					{ at: 2850, do: 'enter', el: 'rem-b' },
					{ at: 3000, do: 'draw', el: 'lk-rem-3m', dur: 400 },
					{ at: 3000, do: 'draw', el: 'lk-rem-bm', dur: 400 },
					{ at: 3150, do: 'exit', el: 'pk-push4m', dur: 300 },
					{ at: 3150, do: 'enter', el: 'rem-m' },
					{ at: 3400, do: 'move', el: 'rem-main', to: 's-rem-m3', dur: 700 },
					{ at: 3700, do: 'move', el: 'beto-origin', to: 's-beto-o3', dur: 700 },
					{ at: 4100, do: 'enter', el: 'ch-accepted' },
					...clear(recap.start(1), 'ch-accepted', 'on-19', 'p', 'hl', ...outs(19, 2)),
					shot(recap.start(1), 'shot-all', 3000),
					{ at: recap.start(1) + 800, do: 'enter', el: 'r-push' },
					{ at: recap.start(1) + 1600, do: 'enter', el: 'r-fetch' },
					{ at: recap.start(1) + 2400, do: 'enter', el: 'r-pull' },
					{ at: recap.start(2) + 200, do: 'enter', el: 'r-rule' },
					{ at: recap.start(2) + 300, do: 'flow', el: 'fl-merge' },
					{ at: recap.start(2) + 1200, do: 'pulse', el: 'r-rule' },
					{ at: recap.start(2) + 1800, do: 'pulse', el: 'rem-m' },
				),
			},
		},
	],
};
