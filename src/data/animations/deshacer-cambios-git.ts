import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of HEAD: undoing without losing work": a short film (about two
// minutes) for the Git lesson "Deshacer cambios" (order: 2). It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/deshacer-cambios-git.astro`): the terminal session on
// the left, and on the right an isometric repository where every commit is the same
// rounded node with its short hash, `HEAD` (over `main`) is one marker that slides
// along the chain, and the staging area and the working tree sit in front of it.
// Commits that leave the history (amend, reset) drop to a lane below the chain and
// turn into ghosts; `git reflog` lights that lane and brings one back. Magenta marks
// the mistake or what is lost, violet what fixes or recovers it.

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

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/**
 * Runs the command on editor line `line`: the line is typed, the bar slides to it,
 * the particle reaches its module on the command deck and the module lights up
 * (the previous one goes dark).
 */
const run = (at: number, line: number, prev?: number): MotionCue[] => [
	{ at, do: 'type', el: `e-${line}`, dur: 500 },
	{ at: at + 300, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 300, do: 'move', el: 'p', to: `a-m-${line}`, dur: 700 },
	{ at: at + 1000, do: 'enter', el: `on-${line}` },
	...(prev ? [{ at: at + 1000, do: 'exit' as const, el: `on-${prev}`, dur: 300 }] : []),
];

/** Slides `HEAD` (and `main` under it) to the tip of slot `k` of the chain. */
const head = (at: number, k: number, dur = 900): MotionCue => ({ at, do: 'move', el: 'head', to: `a-tip-${k}`, dur });

/** A commit leaves the history: it drops to its place in the lane below and turns into a ghost. */
const drop = (at: number, node: string, lane: number): MotionCue[] => [
	{ at, do: 'move', el: node, to: `a-o-${lane}`, dur: 900 },
	{ at: at + 900, do: 'enter', el: `${node}-off` },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const chain = timed(
	say(
		'Cada `git commit` agrega un nodo con su hash corto: `426061e`.',
		'Each `git commit` adds a node with its short hash: `261c13d`.',
	),
	say(
		'`HEAD` señala tu commit actual: apunta a `main`, y `main` al último.',
		'`HEAD` marks your current commit: it points to `main`, `main` to the latest.',
	),
);
const restore = timed(
	say(
		'Un cambio por error en `saludo.txt` vive solo en el working tree.',
		'A mistaken change to `greeting.txt` lives only in the working tree.',
	),
	say(
		'`git restore` vuelve al último commit: el cambio se pierde para siempre.',
		'`git restore` goes back to the last commit: the change is lost for good.',
	),
);
const amend = timed(
	say(
		'Un commit con un error en el mensaje: `Agrega despedia`.',
		'A commit with a typo in its message: `Add farewel`.',
	),
	say(
		'`--amend` crea uno nuevo, `cf59d35`, y el anterior sale del historial.',
		'`--amend` creates a new one, `f3e279c`; the old one leaves the history.',
	),
	say(
		'Con `--no-edit` suma `firma.txt`: otro hash. Solo en commits sin compartir.',
		'With `--no-edit` it adds `signature.txt`: another hash. Unshared commits only.',
	),
);
const revert = timed(
	say(
		'`git revert` crea un commit con el cambio inverso de `Cambia saludo a inglés`.',
		'`git revert` adds a commit with the opposite change of `Change greeting to Spanish`.',
	),
	say(
		'El original sigue en el historial: lo seguro si ya compartiste el commit.',
		'The original stays in the history: the safe choice for shared commits.',
	),
);
const soft = timed(
	say(
		'Nuevo commit. `git reset --soft HEAD~1` mueve `HEAD` a su padre.',
		'A new commit. `git reset --soft HEAD~1` moves `HEAD` to its parent.',
	),
	say(
		'El commit sale del historial; sus cambios quedan en el staging.',
		'The commit leaves the history; its changes stay in the staging area.',
	),
);
const mixed = timed(
	say(
		'Otro commit y otra vez atrás, con `--mixed`, el modo por defecto.',
		'Another commit and back again, with `--mixed`, the default mode.',
	),
	say(
		'El staging queda igual a `HEAD`: `tareas.txt` vuelve al working tree.',
		'Staging matches `HEAD`: `tasks.txt` returns to the working tree.',
	),
);
const hard = timed(
	say(
		'Un commit más y `git reset --hard HEAD~1`: todo queda igual a `HEAD`.',
		'One more commit, then `git reset --hard HEAD~1`: all matches `HEAD`.',
	),
	say(
		'`tareas.txt` ya no existe. Un cambio sin commit se perdería del todo.',
		'`tasks.txt` no longer exists. An uncommitted change would be gone for good.',
	),
);
const reflog = timed(
	say(
		'Parece perdido, pero `git reflog` anota cada lugar por el que pasó `HEAD`.',
		'It looks lost, but `git reflog` records every place `HEAD` has been.',
	),
	say(
		'Ahí está `6b8f501`, el commit que borraste con `--hard`.',
		'There is `bdf42a1`, the commit you deleted with `--hard`.',
	),
	say(
		'`git reset --hard 6b8f501` vuelve a ese commit, y `tareas.txt` regresa.',
		'`git reset --hard bdf42a1` goes back to it, and `tasks.txt` returns.',
	),
);
const recap = timed(
	say(
		'Lo que estuvo en un commit casi siempre se recupera con `git reflog`.',
		'What was in a commit can almost always be recovered with `git reflog`.',
	),
	say(
		'Lo que nunca estuvo en un commit se pierde con `restore` o `reset --hard`.',
		'What was never in a commit is lost with `restore` or `reset --hard`.',
	),
	say(
		'`--amend` y `reset` reescriben el historial; si ya compartiste, usa `git revert`.',
		'`--amend` and `reset` rewrite history; for shared commits, use `git revert`.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'restore', label: { es: 'HEAD y restore', en: 'HEAD and restore' } },
		{ id: 'amend', label: { es: 'Corregir con --amend', en: 'Fixing with --amend' } },
		{ id: 'revert', label: { es: 'Revertir', en: 'Reverting' } },
		{ id: 'reset', label: { es: 'Los tres reset', en: 'The three resets' } },
		{ id: 'reflog', label: { es: 'Recuperar con reflog', en: 'Recovering with reflog' } },
		{ id: 'recap', label: { es: 'Qué se recupera', en: 'What can be recovered' } },
	],
	steps: [
		// ─── Scene 1. HEAD over the chain, and restore ──────────────────────
		{
			id: 'chain',
			chapter: 'restore',
			scene: 'journey',
			title: { es: 'HEAD señala el último commit', en: 'HEAD points to the latest commit' },
			subtitles: chain.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1500),
					{ at: 200, do: 'enter', el: 'floor-repo' },
					{ at: 500, do: 'enter', el: 'floor-stage' },
					{ at: 700, do: 'enter', el: 'floor-work' },
					{ at: 900, do: 'enter', el: 'floor-deck' },
					...Array.from({ length: 18 }, (_, index) => ({ at: 1100 + index * 70, do: 'enter' as const, el: `m-${index + 1}` })),
					{ at: 2200, do: 'enter', el: 'hl' },
					{ at: 2200, do: 'enter', el: 'p' },
					...run(2400, 1),
					{ at: 3400, do: 'enter', el: 'c-init' },
					{ at: 3500, do: 'type', el: 'out-1', dur: 900 },
					{ at: 3900, do: 'pulse', el: 'c-init' },
					shot(chain.start(1), 'shot-repo', 2200),
					{ at: chain.start(1) + 600, do: 'enter', el: 'head' },
					{ at: chain.start(1) + 1500, do: 'pulse', el: 'head' },
					{ at: chain.start(1) + 3200, do: 'pulse', el: 'c-init' },
				),
			},
		},
		{
			id: 'restore',
			chapter: 'restore',
			scene: 'journey',
			title: { es: 'restore descarta un cambio sin commit', en: 'restore discards an uncommitted change' },
			subtitles: restore.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 2000),
					...clear(200, 'out-1'),
					...run(300, 2, 1),
					{ at: 1400, do: 'enter', el: 'f-saludo' },
					{ at: 2000, do: 'pulse', el: 'floor-work' },
					{ at: 2600, do: 'pulse', el: 'f-saludo' },
					...run(restore.start(1), 3, 2),
					{ at: restore.start(1) + 1100, do: 'exit', el: 'f-saludo', dur: 600 },
					{ at: restore.start(1) + 1700, do: 'enter', el: 'lb-hola' },
					{ at: restore.start(1) + 2500, do: 'enter', el: 'lb-lost' },
					{ at: restore.start(1) + 3300, do: 'pulse', el: 'lb-lost' },
				),
			},
		},

		// ─── Scene 2. --amend replaces the last commit ──────────────────────
		{
			id: 'amend',
			chapter: 'amend',
			scene: 'journey',
			title: { es: '--amend crea un commit nuevo', en: '--amend creates a new commit' },
			subtitles: amend.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-hola', 'lb-lost'),
					shot(0, 'shot-repo', 2000),
					...run(300, 4, 3),
					{ at: 1300, do: 'enter', el: 'c-typo' },
					{ at: 1400, do: 'draw', el: 'lk-1', dur: 600 },
					head(1500, 1),
					{ at: 1600, do: 'type', el: 'out-4', dur: 700 },
					{ at: 2400, do: 'enter', el: 'lb-typo' },
					...run(amend.start(1), 5, 4),
					{ at: amend.start(1) + 100, do: 'exit', el: 'out-4', dur: 300 },
					{ at: amend.start(1) + 900, do: 'exit', el: 'lb-typo', dur: 300 },
					...drop(amend.start(1) + 1100, 'c-typo', 1),
					{ at: amend.start(1) + 1600, do: 'enter', el: 'c-am1' },
					{ at: amend.start(1) + 1700, do: 'type', el: 'out-5', dur: 700 },
					{ at: amend.start(1) + 2300, do: 'enter', el: 'lb-out' },
					{ at: amend.start(1) + 2600, do: 'enter', el: 'lb-fixed' },
					...run(amend.start(2), 6, 5),
					{ at: amend.start(2) + 100, do: 'exit', el: 'out-5', dur: 300 },
					{ at: amend.start(2) + 1000, do: 'enter', el: 'f-firma' },
					...run(amend.start(2) + 1700, 7, 6),
					{ at: amend.start(2) + 2700, do: 'move', el: 'f-firma', to: 'a-slot-1', dur: 800 },
					{ at: amend.start(2) + 3500, do: 'exit', el: 'f-firma', dur: 300 },
					...drop(amend.start(2) + 3500, 'c-am1', 2),
					{ at: amend.start(2) + 3900, do: 'enter', el: 'c-am2' },
					{ at: amend.start(2) + 4000, do: 'type', el: 'out-7', dur: 900 },
					{ at: amend.start(2) + 4700, do: 'pulse', el: 'c-am2' },
				),
			},
		},

		// ─── Scene 3. revert adds the inverse commit ────────────────────────
		{
			id: 'revert',
			chapter: 'revert',
			scene: 'journey',
			title: { es: 'revert agrega un commit inverso', en: 'revert adds an inverse commit' },
			subtitles: revert.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-fixed', 'out-7'),
					shot(0, 'shot-repo', 1600),
					...run(300, 8, 7),
					{ at: 1300, do: 'enter', el: 'c-change' },
					{ at: 1400, do: 'draw', el: 'lk-2', dur: 600 },
					head(1500, 2),
					{ at: 1600, do: 'type', el: 'out-8', dur: 800 },
					{ at: 2400, do: 'enter', el: 'lb-change' },
					...run(3400, 9, 8),
					{ at: 3500, do: 'exit', el: 'out-8', dur: 300 },
					{ at: 4400, do: 'enter', el: 'c-revert' },
					{ at: 4500, do: 'draw', el: 'lk-3', dur: 600 },
					head(4600, 3),
					{ at: 4700, do: 'type', el: 'out-9', dur: 1000 },
					{ at: 5500, do: 'enter', el: 'lb-revert' },
					{ at: revert.start(1) + 200, do: 'pulse', el: 'c-change' },
					{ at: revert.start(1) + 900, do: 'pulse', el: 'c-revert' },
					{ at: revert.start(1) + 1600, do: 'pulse', el: 'lk-2' },
				),
			},
		},

		// ─── Scene 4. reset moves HEAD back: soft, mixed, hard ──────────────
		{
			id: 'soft',
			chapter: 'reset',
			scene: 'journey',
			title: { es: '--soft: los cambios al staging', en: '--soft: the changes to staging' },
			subtitles: soft.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-change', 'lb-revert', 'out-9'),
					shot(0, 'shot-main', 1800),
					...run(300, 10, 9),
					{ at: 1300, do: 'enter', el: 'c-t1' },
					{ at: 1400, do: 'draw', el: 'lk-4', dur: 600 },
					head(1500, 4),
					{ at: 1600, do: 'type', el: 'out-10', dur: 800 },
					...run(3400, 11, 10),
					{ at: 3500, do: 'exit', el: 'out-10', dur: 300 },
					head(4400, 3),
					{ at: 4600, do: 'exit', el: 'lk-4', dur: 400 },
					...drop(soft.start(1), 'c-t1', 3),
					{ at: soft.start(1) + 900, do: 'move', el: 'f-tareas', to: 'a-o-3', dur: 1 },
					{ at: soft.start(1) + 1000, do: 'enter', el: 'f-tareas' },
					{ at: soft.start(1) + 1500, do: 'move', el: 'f-tareas', to: 'a-stage', dur: 1100 },
					{ at: soft.start(1) + 2600, do: 'enter', el: 'lb-soft' },
					{ at: soft.start(1) + 3300, do: 'pulse', el: 'floor-stage' },
				),
			},
		},
		{
			id: 'mixed',
			chapter: 'reset',
			scene: 'journey',
			title: { es: '--mixed: los cambios al working tree', en: '--mixed: the changes to the working tree' },
			subtitles: mixed.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-soft'),
					...run(200, 12, 11),
					{ at: 1200, do: 'move', el: 'f-tareas', to: 'a-slot-4', dur: 800 },
					{ at: 2000, do: 'exit', el: 'f-tareas', dur: 300 },
					{ at: 2000, do: 'enter', el: 'c-t2' },
					{ at: 2100, do: 'enter', el: 'lk-4' },
					head(2100, 4),
					{ at: 2200, do: 'type', el: 'out-12', dur: 800 },
					...run(3600, 13, 12),
					{ at: 3700, do: 'exit', el: 'out-12', dur: 300 },
					head(4600, 3),
					{ at: 4700, do: 'exit', el: 'lk-4', dur: 400 },
					...drop(mixed.start(1), 'c-t2', 4),
					{ at: mixed.start(1) + 900, do: 'move', el: 'f-tareas', to: 'a-o-4', dur: 1 },
					{ at: mixed.start(1) + 1000, do: 'enter', el: 'f-tareas' },
					{ at: mixed.start(1) + 1500, do: 'move', el: 'f-tareas', to: 'a-work', dur: 1300 },
					{ at: mixed.start(1) + 2800, do: 'enter', el: 'lb-mixed' },
					{ at: mixed.start(1) + 3500, do: 'pulse', el: 'floor-work' },
				),
			},
		},
		{
			id: 'hard',
			chapter: 'reset',
			scene: 'journey',
			title: { es: '--hard: todo igual a HEAD', en: '--hard: everything matches HEAD' },
			subtitles: hard.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-mixed'),
					...run(100, 14, 13),
					{ at: 1000, do: 'move', el: 'f-tareas', to: 'a-stage', dur: 800 },
					...run(1800, 15, 14),
					{ at: 2700, do: 'move', el: 'f-tareas', to: 'a-slot-4', dur: 800 },
					{ at: 3500, do: 'exit', el: 'f-tareas', dur: 300 },
					{ at: 3500, do: 'enter', el: 'c-t3' },
					{ at: 3600, do: 'enter', el: 'lk-4' },
					head(3600, 4),
					{ at: 3700, do: 'type', el: 'out-15', dur: 800 },
					...run(4300, 16, 15),
					{ at: 4400, do: 'exit', el: 'out-15', dur: 300 },
					head(5300, 3),
					{ at: 5400, do: 'exit', el: 'lk-4', dur: 400 },
					{ at: 5500, do: 'type', el: 'out-16', dur: 900 },
					...drop(5600, 'c-t3', 5),
					{ at: hard.start(1) + 700, do: 'enter', el: 'lb-hard' },
					{ at: hard.start(1) + 1300, do: 'enter', el: 'lb-gone' },
					{ at: hard.start(1) + 2100, do: 'pulse', el: 'lb-gone' },
					{ at: hard.start(1) + 2900, do: 'pulse', el: 'c-t3' },
				),
			},
		},

		// ─── Scene 5. reflog brings the commit back ─────────────────────────
		{
			id: 'reflog',
			chapter: 'reflog',
			scene: 'journey',
			title: { es: 'reflog encuentra el commit', en: 'reflog finds the commit' },
			subtitles: reflog.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-hard', 'lb-gone', 'out-16'),
					shot(0, 'shot-repo', 2000),
					...run(300, 17, 16),
					{ at: 1300, do: 'type', el: 'out-17', dur: 1400 },
					{ at: 1500, do: 'enter', el: 'rf-lane' },
					{ at: 1900, do: 'flow', el: 'rf-lane' },
					{ at: 2600, do: 'pulse', el: 'c-typo' },
					{ at: 2900, do: 'pulse', el: 'c-am1' },
					{ at: 3200, do: 'pulse', el: 'c-t1' },
					{ at: 3500, do: 'pulse', el: 'c-t2' },
					{ at: reflog.start(1), do: 'enter', el: 'hv-17' },
					{ at: reflog.start(1) + 300, do: 'pulse', el: 'c-t3' },
					{ at: reflog.start(1) + 1200, do: 'pulse', el: 'hv-17' },
					...run(reflog.start(2), 18, 17),
					...clear(reflog.start(2) + 100, 'out-17', 'hv-17'),
					{ at: reflog.start(2) + 1000, do: 'exit', el: 'c-t3-off', dur: 400 },
					{ at: reflog.start(2) + 1100, do: 'move', el: 'c-t3', to: 'a-slot-4', dur: 1000 },
					{ at: reflog.start(2) + 1800, do: 'enter', el: 'lk-4' },
					head(reflog.start(2) + 1900, 4),
					{ at: reflog.start(2) + 2000, do: 'type', el: 'out-18', dur: 900 },
					{ at: reflog.start(2) + 2800, do: 'enter', el: 'lb-back' },
					{ at: reflog.start(2) + 3500, do: 'pulse', el: 'c-t3' },
				),
			},
		},

		// ─── Scene 6. What can be recovered ─────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'En un commit, casi nada se pierde', en: 'In a commit, almost nothing is lost' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'on-18', 'lb-back', 'out-18'),
					shot(200, 'shot-all', 3000),
					{ at: 1200, do: 'enter', el: 'r-commit' },
					{ at: 2000, do: 'pulse', el: 'rf-lane' },
					{ at: 2800, do: 'pulse', el: 'r-commit' },
					{ at: recap.start(1) + 200, do: 'enter', el: 'r-never' },
					{ at: recap.start(1) + 900, do: 'pulse', el: 'floor-work' },
					{ at: recap.start(1) + 1700, do: 'pulse', el: 'r-never' },
					{ at: recap.start(2) + 200, do: 'enter', el: 'r-share' },
					{ at: recap.start(2) + 900, do: 'pulse', el: 'c-revert' },
					{ at: recap.start(2) + 1600, do: 'pulse', el: 'head' },
				),
			},
		},
	],
};
